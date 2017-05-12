package event

import (
	"errors"
	"fmt"
	"log"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/gin-gonic/gin"
	"github.com/snigle/aicom/server/models"
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
	log.Println("creating event")
	if in.Time.Before(time.Now()) || in.Time.After(time.Now().Add(24*time.Hour)) {
		err := errors.New("can't create event in the past or in more than one day in the future")
		log.Println(err)
		return nil, err
	}

	// Creation de l'event si il n'existe pas un dans le créneau time +2h avec même user et même activity
	e := &models.Event{}
	// { "$and" : [{"activity" :"bar"}, {"users.58bf2dc6fae14b6b022eb7d5" : true }, { "$or" : [{"time": { "$gte" : {"$date":"2017-04-19T23:00:00.000Z"} } }, {"time": { "$lte" : {"$date":"2017-04-19T23:00:00.000Z"} } }]} ] }
	err := mongo.Aicom.C(models.ColEvent).Find(
		bson.M{"$and": []bson.M{
			bson.M{"activity": in.Activity},
			bson.M{"$or": []bson.M{
				{fmt.Sprintf("users.%s", user.ID.Hex()): true}, {fmt.Sprintf("users.%s", in.UserID.Hex()): true},
			}},
			{"time": bson.M{"$gte": in.Time.Add(-1 * time.Hour)}},
			{"time": bson.M{"$lte": in.Time.Add(2 * time.Hour)}},
		},
		},
	).One(&e)

	// Check that userID exists

	if err == mgo.ErrNotFound {
		e.Place = in.Place
		e.Users = make(map[string]*bool)
		e.Users[in.UserID.Hex()] = nil
		e.ID = bson.NewObjectId()
		e.Time = in.Time
		e.Activity = in.Activity
	}
	b := true
	e.Users[user.ID.Hex()] = &b

	// Insert or update event
	_, err = mongo.Aicom.C(models.ColEvent).UpsertId(e.ID, e)
	if err != nil {
		log.Printf("Unable to get user in db %v", err)
		return nil, err
	}

	// TODO If all are OK, send notification ?

	// Generate token
	return e, nil
}
