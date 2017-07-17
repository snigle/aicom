package google

import (
	"context"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/NaySoftware/go-fcm"
	"github.com/snigle/aicom/server/models"
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

type notification struct {
	Event *notificationEvent `json:"event"`
}

type notificationEvent struct {
	*models.Event
	Action string `json:"action"`
}

func SendRequest(token string, event *models.Event) error {
	notif.NewFcmMsgTo(token, &notification{Event: &notificationEvent{
		Event: event, Action: "PENDING_EVENT",
	}})
	_, err := notif.Send()
	return err
}

func SendAcceptedEvent(token string, event *models.Event) error {
	notif.NewFcmMsgTo(token, &notification{Event: &notificationEvent{
		Event: event, Action: "ACCEPTED_EVENT",
	}})
	_, err := notif.Send()
	return err
}
