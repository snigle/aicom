package google

import (
	"context"
	"io/ioutil"
	"log"
	"net/http"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	calendar "google.golang.org/api/calendar/v3"
)

var ctx context.Context
var config *oauth2.Config

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
