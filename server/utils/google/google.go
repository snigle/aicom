package google

import (
	"context"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/NaySoftware/go-fcm"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	calendar "google.golang.org/api/calendar/v3"
	"googlemaps.github.io/maps"
)

var ctx context.Context
var config *oauth2.Config
var notif *fcm.FcmClient

func init() {
	ctx = context.Background()
	b, err := ioutil.ReadFile("google-service.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}
	config, err = google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	notif = fcm.NewFcmClient("AAAA0MkYYgE:APA91bH3tssooUVEm-wbUKU5oDQo10D0mKY-KSF9JhHHLenanJZjgu0YUubQTO1OrbS6TUGlNtR7OlkbQwt93phFjbUpLsXWprZpOeW6NFwDGGVEgi-7P1c3FqpaiWMIGcE7-pTA3ekY")

}

func GetClientFromServerToken(serverToken string) (*http.Client, *oauth2.Token, error) {
	token, err := config.Exchange(oauth2.NoContext, serverToken)
	if err != nil {
		log.Printf("Unable to retrieve token from web %v", err)
		return nil, nil, err
	}
	return GetClientFromToken(token), token, nil
}

func GetClientFromToken(token *oauth2.Token) *http.Client {
	return config.Client(ctx, token)
}

func GetClient() (*maps.Client, error) {
	return maps.NewClient(maps.WithAPIKey("AIzaSyBzw0TKHErNipMhGauIwMsem4CSGEMx-WI"))
}

type Notification struct {
	Title      string      `json:"title"`
	Body       string      `json:"body"`
	Action     string      `json:"action"`
	Route      string      `json:"route"`
	Data       interface{} `json:"data"`
	ResetCache []string    `json:"resetCache"`
}

type Message struct {
	UUID     uuid.UUID `json:"uuid"`
	SenderID string    `json:"senderID"`
	Body     string    `json:"body"`
}

func SendNotification(token string, notification *Notification) error {
	notif.NewFcmMsgTo(token, struct {
		Event *Notification `json:"event"`
	}{notification})
	_, err := notif.Send()
	return err
}

const MESSAGE_EVENT = "MESSAGE_EVENT"
const RECEIVED_MESSAGE_EVENT = "RECEIVED_MESSAGE_EVENT"
const ACCEPTED_EVENT = "ACCEPTED_EVENT"
const PENDING_EVENT = "PENDING_EVENT"
