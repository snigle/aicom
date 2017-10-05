package mongo

import (
	"log"

	mgo "gopkg.in/mgo.v2"
)

var DB *mgo.Session
var Aicom *mgo.Database

func init() {
	var err error
	DB, err = mgo.Dial("mongodb://aicom:u94iw2kam@ds143774.mlab.com:43774/aicom")
	if err != nil {
		log.Fatal(err)
	}
	Aicom = DB.DB("aicom")
}
