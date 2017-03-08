package login

import (
	"errors"
	"log"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/gin-gonic/gin"
	"github.com/snigle/server/models"
	"github.com/snigle/server/utils/google"
	"github.com/snigle/server/utils/mongo"
	oauth2_api "google.golang.org/api/oauth2/v2"
)

// How to get code : https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost:8080&prompt=consent&response_type=code&client_id=896727015937-03jkctj1nc3tcac0s8435198tnls0bjp.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&access_type=offline
type LoginInput struct {
	GoogleAuthToken string `json:"token" binding:"required"`
}

func Login(c *gin.Context, in *LoginInput) (*models.Token, error) {
	client, token, err := google.GetClientFromServerToken(in.GoogleAuthToken)
	if err != nil {
		log.Printf("Unable to get google client %v", err)
		return nil, err
	}
	// Get user infos
	api, err := oauth2_api.New(client)
	if err != nil {
		log.Printf("Unable to get oauth api client %v", err)
		return nil, err
	}
	info, err := api.Userinfo.Get().Do()
	if err != nil {
		log.Printf("Unable to retrieve token info %v", err)
		return nil, err
	}

	if info.VerifiedEmail == nil || *(info.VerifiedEmail) == false {
		return nil, errors.New("you must have verified email")
	}

	// Get user in database
	u := &models.User{}
	err = mongo.Aicom.C(models.ColUser).Find(bson.M{"google_id": info.Id}).One(&u)
	// Update data from google
	u.Email = info.Email
	u.Name = info.Name
	u.Picture = info.Picture
	if err == mgo.ErrNotFound {
		u.ID = bson.NewObjectId()
	}
	// Insert or update user
	_, err = mongo.Aicom.C(models.ColUser).UpsertId(u.ID, u)
	if err != nil {
		log.Printf("Unable to get user in db %v", err)
		return nil, err
	}
	// Generate token
	t := &models.Token{Token: *token, GoogleID: info.Id, ID: bson.NewObjectId(), UserID: u.ID}
	accessToken := t.AccessToken
	t.AccessToken = models.HashToken(t.AccessToken)
	// Save in mongo
	err = mongo.Aicom.C("tokens").Insert(t)
	if err != nil {
		log.Printf("Unable to insert token in db %v", err)
		return nil, err
	}
	t.AccessToken = accessToken
	return t, nil
}
