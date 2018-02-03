package main

import (
	"fmt"
	"log"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"github.com/gin-gonic/gin"
	"github.com/namsral/flag"
	"github.com/sirupsen/logrus"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/routes"
	_ "github.com/snigle/aicom/server/routes/login"
	_ "github.com/snigle/aicom/server/routes/place"
	_ "github.com/snigle/aicom/server/routes/user"
	"github.com/snigle/aicom/server/utils/google"
	"github.com/snigle/aicom/server/utils/mongo"
)

var port int

func init() {
	flag.IntVar(&port, "port", 8080, "api port")
}

func main() {
	flag.Parse()
	if mongo.DB == nil {
		return
	}

	r := gin.Default()
	for _, route := range routes.GetRoutes() {
		if !route.AuthRequired {
			switch route.Method {
			case http.MethodPut:
				r.PUT(route.Path, route.Function)
			case http.MethodPost:
				r.POST(route.Path, route.Function)
			case http.MethodGet:
				r.GET(route.Path, route.Function)
			case http.MethodDelete:
				r.DELETE(route.Path, route.Function)
			}
		}
	}
	authorized := r.Group("/")
	authorized.Use(AuthRequired())
	{
		for _, route := range routes.GetRoutes() {
			if route.AuthRequired {
				switch route.Method {
				case http.MethodPut:
					authorized.PUT(route.Path, route.Function)
				case http.MethodPost:
					authorized.POST(route.Path, route.Function)
				case http.MethodGet:
					authorized.GET(route.Path, route.Function)
				case http.MethodDelete:
					authorized.DELETE(route.Path, route.Function)
				}
			}
		}
	}

	c := &gin.Context{}
	userID := "59c352bdc7bcbb5c005e7fbc" // Ludo
	// userID := "59c354dcb0c2bf0004e35f6a" // Patrick
	// eventID := "5a5703c4997c81000477b742"

	user := &models.User{}
	err := mongo.Aicom.C(models.ColUser).FindId(bson.ObjectIdHex(userID)).One(&user)
	if err != nil {
		logrus.WithError(err).Error("fail to get user")
		return
	}
	c.Set("users", user)
	// Accept event
	// _, err = event.AcceptEvent(c, &event.AcceptEventInput{UUID: eventID})
	// if err != nil {
	// 	logrus.WithError(err).Error("fail to accept event")
	// 	return
	// }

	// Cancel event
	// err = event.CancelEvent(c, &event.AcceptEventInput{UUID: eventID})
	// if err != nil {
	// 	logrus.WithError(err).Error("fail to accept event")
	// 	return
	// }

	// Send notification
	google.SendNotification(user.FCMToken, &google.Notification{
		Title:      "Event Accepted",
		Body:       fmt.Sprintf(`We found an event ! Let's go to %s`, "test"),
		Route:      "events",
		ResetCache: []string{"event", "message"},
	})
	if err != nil {
		logrus.WithError(err).Error("fail to send notification")
		return
	}
	r.Run(fmt.Sprintf(":%d", port))
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Print("get token")
		accessToken := c.Request.Header.Get("X-Token")
		if accessToken == "" {
			accessToken = c.Query("token")
		}
		token := &models.Token{}
		log.Print("hash", accessToken, models.HashToken(accessToken))
		err := mongo.Aicom.C(models.ColToken).Find(bson.M{"token.accesstoken": models.HashToken(accessToken)}).One(&token)
		if err != nil {
			log.Printf("Fail to get token %v", err)
			c.AbortWithError(401, err)
			return
		}
		token.AccessToken = accessToken
		oldToken := *token
		user := &models.User{}
		err = mongo.Aicom.C(models.ColUser).FindId(token.UserID).One(&user)
		if err != nil {
			log.Printf("Fail to get user %v", err)
			c.AbortWithError(401, err)
			return
		}
		c.Set(models.ColToken, token)
		c.Set(models.ColUser, user)
		c.Next()

		go func() {
			log.Printf("access_token : %s\n copy : %s\n", oldToken.AccessToken, token.AccessToken)
			if oldToken.AccessToken != token.AccessToken {
				log.Print("token updated")
				err = mongo.Aicom.C(models.ColToken).UpdateId(token.ID, token)
				if err != nil {
					log.Print("fail to save updated token")
					return
				}
			}

			err = user.SetLocationFromHeader(c.Request.Header.Get("X-Location"))
			if err != nil {
				log.Printf("fail to set location for %s : %s", c.Request.Header.Get("X-Location"), err)
				return
			}

			log.Printf("update user, receive location : %s", c.Request.Header.Get("X-Location"))
			err = mongo.Aicom.C(models.ColUser).UpdateId(user.ID, bson.M{"$set": bson.M{"location": user.Location}})
			if err != nil {
				log.Print("fail to save updated location")
				return
			}
		}()
	}
}
