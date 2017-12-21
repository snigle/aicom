package login

import (
	"math"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/utils/mongo"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func GetMe(c *gin.Context) (*models.User, error) {
	user := c.MustGet(models.ColUser).(*models.User)
	return user, nil
}

func GetUsers(c *gin.Context) (res []*models.User, err error) {
	user := c.MustGet(models.ColUser).(*models.User)

	// err = mongo.Aicom.C(models.ColUser).Find(nil).All(&res)
	err = mongo.Aicom.C(models.ColUser).EnsureIndex(mgo.Index{
		Background: true,
		Key:        []string{"$2dsphere:location"},
		Name:       "location",
	})
	if err != nil {
		logrus.Error("fail to ensure index")
		return
	}
	err = mongo.Aicom.C(models.ColUser).Find(
		bson.M{
			"location": bson.M{
				"$geoNear": bson.M{
					"$geometry": bson.M{
						"type":        "Point",
						"coordinates": user.Location,
					},
					"$maxDistance": 30000,
				},
			},
		}).All(&res)

	for _, u := range res {
		u.Distance = Point(u.Location).GreatCircleDistance(Point(user.Location))
	}

	return
}

type Point [2]float64

const EARTH_RADIUS = 6371

func (p Point) GreatCircleDistance(p2 Point) float64 {
	dLat := (p2[1] - p[1]) * (math.Pi / 180.0)
	dLon := (p[0] - p[0]) * (math.Pi / 180.0)

	lat1 := p[1] * (math.Pi / 180.0)
	lat2 := p2[1] * (math.Pi / 180.0)

	a1 := math.Sin(dLat/2) * math.Sin(dLat/2)
	a2 := math.Sin(dLon/2) * math.Sin(dLon/2) * math.Cos(lat1) * math.Cos(lat2)

	a := a1 + a2

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return EARTH_RADIUS * c
}
