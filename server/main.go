package main

import (
	"fmt"
	"log"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"github.com/gin-gonic/gin"
	"github.com/namsral/flag"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/routes"
	_ "github.com/snigle/aicom/server/routes/login"
	_ "github.com/snigle/aicom/server/routes/user"
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
			if route.Method == "POST" {
				r.POST(route.Path, route.Function)
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
				case http.MethodDelete:
					authorized.DELETE(route.Path, route.Function)
				}
			}
		}
	}
	r.Run(fmt.Sprintf(":%d", port))
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Print("get token")
		accessToken := c.Request.Header.Get("X-Token")
		token := &models.Token{}
		log.Print("hash", accessToken, models.HashToken(accessToken))
		err := mongo.Aicom.C(models.ColToken).Find(bson.M{"token.accesstoken": models.HashToken(accessToken)}).One(&token)
		if err != nil {
			log.Printf("Fail to get token %v", err)
			c.AbortWithError(401, err)
			return
		}
		oldToken := *token
		user := &models.User{}
		err = mongo.Aicom.C(models.ColUser).Find(bson.M{"_id": token.UserID}).One(&user)
		if err != nil {
			log.Printf("Fail to get user %v", err)
			c.AbortWithError(401, err)
			return
		}
		token.AccessToken = accessToken
		c.Set(models.ColToken, token)
		c.Set(models.ColUser, user)
		c.Next()

		if oldToken != *token {
			log.Print("token updated")
			token.AccessToken = models.HashToken(token.AccessToken)
			err = mongo.Aicom.C(models.ColToken).Update(bson.M{"_id": token.ID}, token)
			if err != nil {
				log.Print("fail to save updated token")
			}
		}
	}
}
