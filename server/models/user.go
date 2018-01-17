package models

import (
	"encoding/json"

	"gopkg.in/mgo.v2/bson"
)

const ColUser = "users"

type User struct {
	ID         bson.ObjectId   `json:"id" bson:"_id"`
	GoogleID   string          `json:"google_id" bson:"google_id"`
	FCMToken   string          `json:"fcm_token" bson:"fcm_token"`
	Email      string          `json:"email" bson:"email"`
	Name       string          `json:"name" bson:"name"`
	Picture    string          `json:"picture" bson:"picture"`
	Location   [2]float64      `json:"location" bson:"location"`
	Activities map[string]bool `json:"activities" bson:"activities"`
	Stats      struct {
		EventRequested int             `json:"event_requested" bson:"event_requested"`
		EventAccepted  int             `json:"event_accepted" bson:"event_accepted"`
		UsersMet       map[string]bool `json:"users_met" bson:"users_met"`
		PlacesVisited  map[string]bool `json:"places_visited" bson:"places_visited"`
	} `json:"stats" bson:"Stats"`
}
type SecureUser struct {
	User
	Location interface{} `json:"location,omitempty"`
	Distance float64     `json:"distance" bson:"-"`
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
	if locationString != "" {
		return json.Unmarshal([]byte(locationString), &user.Location)
	}
	return nil
}
