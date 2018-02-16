package place

import (
	"context"
	"errors"
	"io/ioutil"
	"log"
	"sync"

	"googlemaps.github.io/maps"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/snigle/aicom/server/models"
	userroute "github.com/snigle/aicom/server/routes/user"
	"github.com/snigle/aicom/server/utils/google"
)

type activityPlace struct {
	activity string
	places   []*models.Place
}

func GetPlaces(c *gin.Context) (map[string][]*models.Place, error) {
	user := c.MustGet(models.ColUser).(*models.User)

	client, err := google.GetClient()
	if err != nil {
		log.Printf("fatal error: %s", err)
		return nil, err
	}
	result := make(map[string][]*models.Place)
	var wg sync.WaitGroup
	inputChan := make(chan string)
	outputChan := make(chan *activityPlace, len(user.Activities))

	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for activity := range inputChan {
				r := &maps.NearbySearchRequest{
					Location: &maps.LatLng{Lat: user.Location[1], Lng: user.Location[0]},
					Name:     activity,
					Radius:   3000,
				}
				resp, err := client.NearbySearch(context.Background(), r)
				if err != nil {
					log.Printf("fatal error: %s", err)
					return
				}
				if len(resp.Results) == 0 {
					r.Radius = 5000
					resp, err = client.NearbySearch(context.Background(), r)
					if err != nil {
						log.Printf("fatal error: %s", err)
						return
					}
				}
				list := make([]*models.Place, 0, len(resp.Results))
				for _, p := range resp.Results {
					pictures := make([]string, 0, len(p.Photos))
					// logrus.Info("pictures : %v", p.Photos)
					for _, p := range p.Photos {
						// If no copyright
						// if len(p.HTMLAttributions) == 0 {
						pictures = append(pictures, p.PhotoReference)
						// }
					}
					location := &models.Location{
						Latitude: p.Geometry.Location.Lat, Longitude: p.Geometry.Location.Lng,
					}
					list = append(list, &models.Place{
						ID: p.PlaceID, Icon: p.Icon, Name: p.Name, Description: p.Vicinity,
						Location: location,
						Pictures: pictures,
						Distance: userroute.Point([2]float64{location.Longitude, location.Latitude}).GreatCircleDistance(userroute.Point(user.Location)),
					})
				}
				outputChan <- &activityPlace{activity, list}
			}
		}()
	}

	for activity := range user.Activities {
		inputChan <- activity
	}
	close(inputChan)
	wg.Wait()
	close(outputChan)
	for output := range outputChan {
		result[output.activity] = output.places
	}

	return result, nil
}

type PictureParams struct {
	Reference string `path:"reference,required"`
}

// TODO use http://www.sanarias.com/blog/1214PlayingwithimagesinHTTPresponseingolang
func GetPicture(c *gin.Context) {
	reference, ok := c.Params.Get("reference")
	if !ok {
		err := errors.New("missing reference parameter")
		c.AbortWithError(400, err)
		// return err
	}

	client, err := google.GetClient()
	if err != nil {
		log.Printf("fatal error: %s", err)
		c.AbortWithError(500, err)
		return
		// return err
	}
	resp, err := client.PlacePhoto(context.Background(), &maps.PlacePhotoRequest{PhotoReference: reference, MaxHeight: 400, MaxWidth: 400})
	if err != nil {
		log.Printf("fatal error: %s", err)
		c.AbortWithError(500, err)
		return
		// return err
	}
	defer resp.Data.Close()
	bytes, err := ioutil.ReadAll(resp.Data)
	if err != nil {
		logrus.WithError(err).Error("fail to read response")
		c.AbortWithError(500, err)
		return
	}
	c.Writer.Write(bytes)
	// return nil
}
