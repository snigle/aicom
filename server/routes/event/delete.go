package event

import (
	"fmt"
	"log"

	"gopkg.in/mgo.v2/bson"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/utils/google"
	"github.com/snigle/aicom/server/utils/mongo"
)

type CancelEventInput struct {
	UUID string `path:"uuid,required"`
}

func CancelEvent(c *gin.Context, in *AcceptEventInput) error {
	user := c.MustGet(models.ColUser).(*models.User)
	logrus.Info("accept event " + in.UUID)

	e := &models.Event{}
	err := mongo.Aicom.C(models.ColEvent).FindId(bson.ObjectIdHex(in.UUID)).One(&e)
	if err != nil {
		logrus.WithError(err).Error("fail to find event")
		return err
	}

	b := false
	e.Users[user.ID.Hex()] = &b
	e.Accepted = false

	// Insert or update event
	err = mongo.Aicom.C(models.ColEvent).UpdateId(e.ID, e)
	if err != nil {
		log.Printf("Unable to update event in db %v", err)
		return err
	}

	for uuid, value := range e.Users {
		l := logrus.WithField("user_id", uuid).WithField("participate", value)
		if value == nil || !*value || uuid == user.ID.Hex() {
			l.Info("avoid main user")
			continue
		}
		// get user
		invitedUser := &models.User{}
		err := mongo.Aicom.C(models.ColUser).FindId(bson.ObjectIdHex(uuid)).One(&invitedUser)
		if err != nil {
			l.WithError(err).Error("fail to get user")
			return err
		}
		err = google.SendNotification(invitedUser.FCMToken, &google.Notification{
			Title: fmt.Sprintf("%s has canceled the event :(", user.Name),
			Body:  fmt.Sprintf("You can invite another person !"),
			Route: "events",
		})
		if err != nil {
			l.WithError(err).Error("fail to send notification")
			return err
		}
		err = google.ResetCache(invitedUser.FCMToken)
		if err != nil {
			l.WithError(err).Error("fail to send reset_cache notification")
			return err
		}
		l.Info("notification sent")
	}

	return nil
}
