package login

import (
	"gopkg.in/mgo.v2/bson"

	"github.com/gin-gonic/gin"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/utils/mongo"
)

func Logout(c *gin.Context) error {
	token := c.MustGet(models.ColToken).(*models.Token)
	return mongo.Aicom.C(models.ColToken).Remove(bson.M{"_id": token.ID})
}
