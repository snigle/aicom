package event

import (
	"fmt"
	"log"
	"reflect"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/utils/mongo"
	"gopkg.in/mgo.v2/bson"
)

func filterEvents(user *models.User, myValidation, otherValidation *bool) ([]*models.Event, error) {
	events := []*models.Event{}

	err := mongo.Aicom.C(models.ColEvent).Find(
		bson.M{"$and": []bson.M{
			{fmt.Sprintf("users.%s", user.ID.Hex()): myValidation},
			{"time": bson.M{"$gte": time.Now()}},
		}},
	).All(&events)

	if err != nil {
		log.Print(err)
		return nil, err
	}

	result := make([]*models.Event, 0, len(events))
	for _, e := range events {
		allValidated := true
		for userID, other := range e.Users {
			// Avoid user validation
			if userID == user.ID.Hex() {
				continue
			}
			if !reflect.DeepEqual(other, otherValidation) {
				allValidated = false
				continue
			}
		}
		if allValidated {
			result = append(result, e)
		}
	}
	return result, nil
}

func GetPendingEvent(c *gin.Context) ([]*models.Event, error) {
	user := c.MustGet(models.ColUser).(*models.User)

	b := true
	return filterEvents(user, nil, &b)

}

func attachUsers(events []*models.Event) ([]*models.EventWithUsers, error) {
	l := logrus.WithField("function", "attachUsers")

	uuids := []bson.ObjectId{}
	for _, e := range events {
		for userID := range e.Users {
			uuids = append(uuids, bson.ObjectIdHex(userID))
		}
	}

	users := []*models.User{}
	err := mongo.Aicom.C(models.ColUser).Find(
		bson.M{"_id": bson.M{"$in": uuids}},
	).All(&users)
	if err != nil {
		l.WithError(err).Info("fail to get users")
		return nil, err
	}

	usersMap := make(map[string]*models.User)
	for _, user := range users {
		usersMap[user.ID.Hex()] = user
	}

	result := make([]*models.EventWithUsers, 0, len(events))
	for _, event := range events {
		eventRes := &models.EventWithUsers{
			Event: event,
			Users: make(map[string]*models.User),
		}
		for userID := range event.Users {
			eventRes.Users[userID] = usersMap[userID]
		}
		result = append(result, eventRes)
	}

	return result, nil
}

func GetEvents(c *gin.Context) ([]*models.EventWithUsers, error) {
	user := c.MustGet(models.ColUser).(*models.User)
	l := logrus.WithField("function", "GetEvents")

	b := true
	events, err := filterEvents(user, &b, &b)
	if err != nil {
		l.WithError(err).Info("fail to get users")
		return nil, err
	}
	return attachUsers(events)
}
