package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

const ColEvent = "events"

type Event struct {
	ID       bson.ObjectId    `json:"id" bson:"_id"`
	Activity string           `json:"activity" bson:"activity"`
	Place    *Place           `json:"place" bson:"place"`
	Time     time.Time        `json:"time" bson:"time"`
	Users    map[string]*bool `json:"users" bson:"users"`
	Accepted bool             `json:"accepted" bson:"accepted"`
}

type EventWithUsers struct {
	*Event
	Users map[string]*User `json:"users"`
}

type Place struct {
	ID          string    `json:"id" bson:"id"`
	Icon        string    `json:"icon" bson:"icon"`
	Name        string    `json:"name" bson:"name"`
	Description string    `json:"description" bson:"description"`
	Location    *Location `json:"location" bson:"location"`
	Distance    float64   `json:"distance"`
	Pictures    []string  `json:"picture" bson:"pictures"`
}

type Location struct {
	Latitude  float64 `json:"latitude" bson:"latitude"`
	Longitude float64 `json:"longitude" bson:"longitude"`
}
