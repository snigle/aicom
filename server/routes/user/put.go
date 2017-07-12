package login

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/utils/mongo"
)

// How to get code : https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost:8080&prompt=consent&response_type=code&client_id=896727015937-03jkctj1nc3tcac0s8435198tnls0bjp.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&access_type=offline
type ActivityInputs struct {
	Name string `query:"name,required"`
}

func SetActivity(c *gin.Context, in *ActivityInputs) error {
	user := c.MustGet(models.ColUser).(*models.User)
	user.AddActivity(in.Name)
	err := mongo.Aicom.C(models.ColUser).UpdateId(user.ID, user)
	if err != nil {
		log.Printf("Unable to update in db %v", err)
		return err
	}
	return nil
}

func DeleteActivity(c *gin.Context, in *ActivityInputs) error {
	user := c.MustGet(models.ColUser).(*models.User)
	user.DeleteActivity(in.Name)
	err := mongo.Aicom.C(models.ColUser).UpdateId(user.ID, user)
	if err != nil {
		log.Printf("Unable to update in db %v", err)
		return err
	}
	return nil
}

type NotificationInputs struct {
	Token string `json:"token" binding="required"`
}

func SetNotificationToken(c *gin.Context, in *NotificationInputs) error {
	user := c.MustGet(models.ColUser).(*models.User)
	user.FCMToken = in.Token
	err := mongo.Aicom.C(models.ColUser).UpdateId(user.ID, user)
	if err != nil {
		log.Printf("Unable to update in db %v", err)
		return err
	}
	return nil
}
