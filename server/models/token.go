package models

import (
	"crypto/sha1"
	"encoding/base64"

	"golang.org/x/oauth2"
	"gopkg.in/mgo.v2/bson"
)

const ColToken = "tokens"

type Token struct {
	oauth2.Token
	GoogleID string        `json:"google_id" bson:"google_id"`
	UserID   bson.ObjectId `json:"user_id" bson:"user_id"`
	ID       bson.ObjectId `json:"id" bson:"_id"`
}

func HashToken(token string) string {
	hasher := sha1.New()
	hasher.Write([]byte(token))
	return base64.URLEncoding.EncodeToString(hasher.Sum(nil))
}
