package event

import (
	"errors"
	"log"
	"time"

	"gopkg.in/mgo.v2/bson"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/utils/google"
	"github.com/snigle/aicom/server/utils/mongo"
)

type EventInput struct {
	Activity string        `json:"activity" binding:"required"`
	Place    *models.Place `json:"place" binding:"required"`
	Time     time.Time     `json:"time" binding:"required"`
	UserID   bson.ObjectId `json:"userId" binding:"required"`
}

func NewEvent(c *gin.Context, in *EventInput) (*models.Event, error) {
	user := c.MustGet(models.ColUser).(*models.User)
	log.Println("creating event with user ", in.UserID, " for ", in.Time.Add(3*time.Hour))
	if in.Time.Before(time.Now()) || in.Time.After(time.Now().Add(24*time.Hour)) {
		err := errors.New("can't create event in the past or in more than one day in the future")
		log.Println(err)
		return nil, err
	}

	// Creation de l'event si il n'existe pas un dans le créneau time +2h avec même user et même activity
	e := &models.Event{}
	// { "$and" : [{"activity" :"bar"}, {"users.58bf2dc6fae14b6b022eb7d5" : true }, { "$or" : [{"time": { "$gte" : {"$date":"2017-04-19T23:00:00.000Z"} } }, {"time": { "$lte" : {"$date":"2017-04-19T23:00:00.000Z"} } }]} ] }
	e.Place = in.Place
	e.Users = make(map[string]*bool)
	e.Users[in.UserID.Hex()] = nil
	e.ID = bson.NewObjectId()
	e.Time = in.Time
	e.Activity = in.Activity
	b := true
	e.Users[user.ID.Hex()] = &b

	// Insert or update event
	_, err := mongo.Aicom.C(models.ColEvent).UpsertId(e.ID, e)
	if err != nil {
		log.Printf("Unable to get user in db %v", err)
		return nil, err
	}
	user.Stats.EventRequested++
	logrus.Info("test")
	// TODO If all are OK, send notification ?
	go func() {
		// get user
		invitedUser := &models.User{}
		err = mongo.Aicom.C(models.ColUser).Find(bson.M{"_id": in.UserID}).One(&invitedUser)
		if err != nil {
			logrus.WithError(err).Error("fail to get user")
			return
		}
		err = google.SendRequest(invitedUser.FCMToken, e)
		if err != nil {
			logrus.WithError(err).Error("fail to send notification")
			return
		}
		logrus.Info("notification sent")
	}()

	// Generate token
	return e, nil
}

type AcceptEventInput struct {
	UUID string `path:"uuid,required"`
}

func AcceptEvent(c *gin.Context, in *AcceptEventInput) (*models.Event, error) {
	user := c.MustGet(models.ColUser).(*models.User)
	logrus.Info("accept event " + in.UUID)

	e := &models.Event{}
	err := mongo.Aicom.C(models.ColEvent).FindId(bson.ObjectIdHex(in.UUID)).One(&e)
	if err != nil {
		logrus.WithError(err).Error("fail to find event")
		return nil, err
	}

	b := true
	e.Users[user.ID.Hex()] = &b

	// Insert or update event
	_, err = mongo.Aicom.C(models.ColEvent).UpsertId(e.ID, e)
	if err != nil {
		log.Printf("Unable to get user in db %v", err)
		return nil, err
	}

	for uuid, value := range e.Users {
		if value == nil || !*value || uuid == user.ID.Hex() {
			continue
		}
		go func(uuid string) {
			// get user
			invitedUser := &models.User{}
			err := mongo.Aicom.C(models.ColUser).FindId(bson.M{"_id": uuid}).One(&invitedUser)
			if err != nil {
				logrus.WithError(err).Error("fail to get user")
				return
			}
			invitedUser.Stats.EventAccepted++
			err = google.SendAcceptedEvent(invitedUser.FCMToken, e)
			if err != nil {
				logrus.WithError(err).Error("fail to send notification")
				return
			}
			logrus.Info("notification sent")
			err = mongo.Aicom.C(models.ColUser).Update(bson.M{"_id": uuid}, invitedUser)
			if err != nil {
				logrus.WithError(err).Error("fail to update user stats")
				return
			}
		}(uuid)
	}

	user.Stats.EventAccepted++

	return e, nil
}

type SendMessageParams struct {
	UUID    string `path:"uuid,required"`
	Message string `json:"message"`
}

type MessageID struct {
	UUID uuid.UUID `json:"uuid"`
}

func SendMessage(c *gin.Context, in *SendMessageParams) (*MessageID, error) {
	user := c.MustGet(models.ColUser).(*models.User)
	logrus.Info("send message to event " + in.UUID)

	e := &models.Event{}
	err := mongo.Aicom.C(models.ColEvent).FindId(bson.ObjectIdHex(in.UUID)).One(&e)
	if err != nil {
		logrus.WithError(err).Error("fail to find event")
		return nil, err
	}

	// Check that the user has the right to send a message
	if participatePtr := e.Users[user.ID.Hex()]; participatePtr == nil || !*participatePtr {
		return nil, errors.New("Forbidden")
	}
	messageID := uuid.New()
	for userID, participate := range e.Users {
		if participate != nil && *participate && userID != user.ID.Hex() {
			invitedUser := &models.User{}
			err := mongo.Aicom.C(models.ColUser).FindId(bson.ObjectIdHex(userID)).One(&invitedUser)
			if err != nil {
				logrus.WithError(err).Error("fail to get user")
				return nil, err
			}
			logrus.WithField("user_id", userID).WithField("username", invitedUser.Name).Info("send notif to user")
			err = google.SendMessageEvent(invitedUser.FCMToken, e, &google.Message{UUID: messageID, Body: in.Message})
			if err != nil {
				logrus.WithError(err).Error("fail to send notification")
				return nil, err
			}
		}
	}

	return &MessageID{UUID: messageID}, nil
}

type ReceivedMessageParams struct {
	UUID      string    `path:"uuid,required"`
	MessageID uuid.UUID `path:"messageId,required"`
}

func ReceivedMessage(c *gin.Context, in *ReceivedMessageParams) error {
	user := c.MustGet(models.ColUser).(*models.User)
	logrus.Info("send message to event " + in.UUID)

	e := &models.Event{}
	err := mongo.Aicom.C(models.ColEvent).FindId(bson.ObjectIdHex(in.UUID)).One(&e)
	if err != nil {
		logrus.WithError(err).Error("fail to find event")
		return err
	}

	// Check that the user has the right to send a message
	if participatePtr := e.Users[user.ID.Hex()]; participatePtr == nil || !*participatePtr {
		return errors.New("Forbidden")
	}
	for userID, participate := range e.Users {
		if participate != nil && *participate {
			invitedUser := &models.User{}
			err := mongo.Aicom.C(models.ColUser).Find(bson.M{"_id": userID}).One(&invitedUser)
			if err != nil {
				logrus.WithError(err).Error("fail to get user")
				return err
			}

			err = google.SendReceivedMessageEvent(invitedUser.FCMToken, e, in.MessageID)
			if err != nil {
				logrus.WithError(err).Error("fail to send notification")
				return err
			}
		}
	}

	return nil
}
