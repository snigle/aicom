package mongo

import (
	"log"

	mgo "gopkg.in/mgo.v2"
)

var DB *mgo.Session
var Aicom *mgo.Database

func init() {
	var err error
	DB, err = mgo.Dial("mongodb://aicom:u94iw2kam@406b629e-acbc-42f3-9533-7a8ec01804aa.pdb.ovh.net:21486/aicom?authSource=admin")
	if err != nil {
		log.Fatal(err)
	}
	Aicom = DB.DB("aicom")
}
