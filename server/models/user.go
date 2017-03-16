package models

import (
	"encoding/json"

	"gopkg.in/mgo.v2/bson"
)

const ColUser = "users"

type User struct {
	ID         bson.ObjectId   `json:"id" bson:"_id"`
	GoogleID   string          `json:"google_id" bson:"google_id"`
	Email      string          `json:"email" bson:"email"`
	Name       string          `json:"name" bson:"name"`
	Picture    string          `json:"picture" bson:"picture"`
	Location   [2]float64      `json:"location" bson:"location"`
	Activities map[string]bool `json:"activities" bson:"activities"`
}

func (user *User) AddActivity(name string) {
	if user.Activities == nil {
		user.Activities = make(map[string]bool)
	}
	user.Activities[name] = true
}

func (user *User) DeleteActivity(name string) {
	if user.Activities == nil {
		user.Activities = make(map[string]bool)
	}
	user.Activities[name] = false
}

func (user *User) SetLocationFromHeader(locationString string) error {
	return json.Unmarshal([]byte(locationString), &user.Location)
}
