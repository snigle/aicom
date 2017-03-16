package login

import (
	"github.com/gin-gonic/gin"
	"github.com/snigle/aicom/server/models"
	"github.com/snigle/aicom/server/utils/mongo"
)

func GetMe(c *gin.Context) (*models.User, error) {
	user := c.MustGet(models.ColUser).(*models.User)
	return user, nil
}

func GetUsers(c *gin.Context) (res []*models.User, err error) {
	err = mongo.Aicom.C(models.ColUser).Find(nil).All(&res)
	return
}
