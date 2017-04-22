package place

import (
	"context"
	"log"
	"sync"

	"googlemaps.github.io/maps"

	"github.com/gin-gonic/gin"
	"github.com/snigle/aicom/server/models"
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
					Location: &maps.LatLng{Lat: user.Location[0], Lng: user.Location[1]},
					Name:     activity,
					Radius:   20000,
				}
				resp, err := client.NearbySearch(context.Background(), r)
				if err != nil {
					log.Printf("fatal error: %s", err)
					return
				}
				list := make([]*models.Place, 0, len(resp.Results))
				for _, p := range resp.Results {
					pictures := make([]string, 0, len(p.Photos))
					for _, p := range p.Photos {
						// If no copyright
						if len(p.HTMLAttributions) == 0 {
							pictures = append(pictures, p.PhotoReference)
						}
					}
					list = append(list, &models.Place{ID: p.PlaceID, Icon: p.Icon, Name: p.Name, Description: p.Vicinity, Location: &models.Location{
						Latitude: p.Geometry.Location.Lat, Longitude: p.Geometry.Location.Lng,
					}, Pictures: pictures})
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
// func GetPicture(c *gin.Context, in *PictureParams) (string, error) {
// 	client, err := google.GetClient()
// 	if err != nil {
// 		log.Printf("fatal error: %s", err)
// 		return nil, err
// 	}
// 	resp, err := client.PlacePhoto(context.Background(), &maps.PlacePhotoRequest{PhotoReference: in.Reference, MaxHeight: 400, MaxWidth: 400})
// 	if err != nil {
// 		log.Printf("fatal error: %s", err)
// 		return nil, err
// 	}
// 	defer resp.Data.Close()
// 	bytes, err := ioutil.ReadAll(resp.Data)
//
// 	str := base64.StdEncoding.EncodeToString(bytes)
// 	if tmpl, err := template.New("image").Parse(ImageTemplate); err != nil {
// 		log.Println("unable to parse image template.")
// 		return "", err
// 	} else {
// 		data := map[string]interface{}{"Image": str}
// 		if err = tmpl.Execute(w, data); err != nil {
// 			log.Println("unable to execute template.")
// 			return "", err
// 		}
// 	}
// }
//
// var ImageTemplate string = `<!DOCTYPE html>
// <html lang="en"><head></head>
// <body><img src="data:image/jpg;base64,{{.Image}}"></body></html>`
