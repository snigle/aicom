package models

import "gopkg.in/mgo.v2/bson"

const ColUser = "users"

type User struct {
	ID         bson.ObjectId   `json:"id" bson:"_id"`
	GoogleID   string          `json:"google_id" bson:"google_id"`
	Email      string          `json:"email" bson:"email"`
	Name       string          `json:"name" bson:"name"`
	Picture    string          `json:"picture" bson:"picture"`
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
