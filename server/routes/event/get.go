package event

import (
	"fmt"
	"log"
	"reflect"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/utils/mongo"
	"gopkg.in/mgo.v2/bson"
)

func filterEvents(user *models.User, myValidation, otherValidation *bool) ([]*models.Event, error) {
	events := []*models.Event{}
	// { "$and" : [{"activity" :"bar"}, {"users.58bf2dc6fae14b6b022eb7d5" : true }, { "$or" : [{"time": { "$gte" : {"$date":"2017-04-19T23:00:00.000Z"} } }, {"time": { "$lte" : {"$date":"2017-04-19T23:00:00.000Z"} } }]} ] }
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
	return filterEvents(user, &b, nil)

}

func GetEvents(c *gin.Context) ([]*models.Event, error) {
	user := c.MustGet(models.ColUser).(*models.User)

	b := true
	return filterEvents(user, &b, &b)

}
