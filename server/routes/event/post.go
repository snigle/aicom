package event

import (
	"errors"
	"fmt"
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
	e.ID = bson.NewObjectId()
	e.Time = in.Time
	e.Activity = in.Activity
	b := true

	e.Users[in.UserID.Hex()] = nil
	e.Users[user.ID.Hex()] = &b

	// Insert or update event
	_, err := mongo.Aicom.C(models.ColEvent).UpsertId(e.ID, e)
	if err != nil {
		log.Printf("Unable to get user in db %v", err)
		return nil, err
	}
	go func() {
		// get user
		invitedUser := &models.User{}
		err = mongo.Aicom.C(models.ColUser).Find(bson.M{"_id": in.UserID}).One(&invitedUser)
		if err != nil {
			logrus.WithError(err).Error("fail to get user")
			return
		}
		err = google.SendNotification(invitedUser.FCMToken, &google.Notification{
			Title:      "Event requested",
			Body:       fmt.Sprintf("You have 1 requests for event at %s", e.Time),
			ResetCache: []string{"event", "message"},
			Route:      "events",
		})
		if err != nil {
			logrus.WithError(err).Error("fail to send notification")
			return
		}
		logrus.Info("notification sent")
	}()

	return e, nil
}

type AcceptEventInput struct {
	UUID string `path:"uuid,required"`
}

func AcceptEvent(c *gin.Context, in *AcceptEventInput) (*models.EventWithUsers, error) {
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
	e.Accepted = true

	// Insert or update event
	_, err = mongo.Aicom.C(models.ColEvent).UpsertId(e.ID, e)
	if err != nil {
		log.Printf("Unable to get user in db %v", err)
		return nil, err
	}

	for uuid, value := range e.Users {
		l := logrus.WithField("user_id", uuid).WithField("participate", value)
		if value == nil || !*value || uuid == user.ID.Hex() {
			l.Info("user don't participate")
			continue
		}
		// get user
		invitedUser := &models.User{}
		err = mongo.Aicom.C(models.ColUser).FindId(bson.ObjectIdHex(uuid)).One(&invitedUser)
		if err != nil {
			l.WithError(err).Error("fail to get user")
			return nil, err
		}
		err = google.SendNotification(invitedUser.FCMToken, &google.Notification{
			Title:      "Event Accepted",
			Body:       fmt.Sprintf(`We found an event ! Let's go to %s`, e.Place.Name),
			Route:      "events",
			ResetCache: []string{"event", "message"},
		})
		if err != nil {
			l.WithError(err).Error("fail to send notification")
			return nil, err
		}
		l.Info("notification sent")
		go updateUserStats(invitedUser, e)
	}
	go updateUserStats(user, e)

	eventsWithUser, err := attachUsers([]*models.Event{e})
	if err != nil || len(eventsWithUser) != 1 {
		logrus.WithError(err).Error("fail to attach users")
		return nil, err
	}
	return eventsWithUser[0], nil
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
			err = google.SendNotification(invitedUser.FCMToken, &google.Notification{
				Title:  user.Name,
				Body:   in.Message,
				Action: google.MESSAGE_EVENT,
				Data:   &google.Message{UUID: messageID, SenderID: user.ID.Hex(), Body: in.Message},
			})
			if err != nil {
				logrus.WithError(err).Error("fail to send notification")
				return nil, err
			}
		}
	}

	return &MessageID{UUID: messageID}, nil
}

type ReceivedMessageParams struct {
	MessageID uuid.UUID `path:"messageId,required"`
	SenderID  string    `json:"uuid" binding:"required"`
}

func ReceivedMessage(c *gin.Context, in *ReceivedMessageParams) error {
	logrus.Info("message received")

	invitedUser := &models.User{}
	err := mongo.Aicom.C(models.ColUser).FindId(bson.ObjectIdHex(in.SenderID)).One(&invitedUser)
	if err != nil {
		logrus.WithError(err).Error("fail to get user")
		return err
	}

	err = google.SendNotification(invitedUser.FCMToken, &google.Notification{
		Action: google.RECEIVED_MESSAGE_EVENT,
		Data:   &google.Message{UUID: in.MessageID},
	})
	if err != nil {
		logrus.WithError(err).Error("fail to send notification")
		return err
	}

	return nil
}

func updateUserStats(user *models.User, e *models.Event) {
	userID := user.ID.Hex()
	sets := bson.M{}
	sets[fmt.Sprintf("stats.places_visited.%s", e.Place.ID)] = true
	sets["stats.event_accepted"] = user.Stats.EventAccepted + 1
	for otherUser, ok := range e.Users {
		if otherUser == userID || ok == nil || !*ok {
			continue
		}
		sets[fmt.Sprintf("stats.users_met.%s", otherUser)] = true
	}
	logrus.Infof("update user stats %+v", sets)
	err := mongo.Aicom.C(models.ColUser).UpdateId(user.ID, bson.M{"$set": sets})
	if err != nil {
		logrus.WithError(err).Error("fail to update user stats")
	}
}
