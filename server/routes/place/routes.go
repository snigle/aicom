package place

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/loopfz/gadgeto/tonic"
	"github.com/snigle/aicom/server/routes"
)

func init() {
	routes.AddRoute(
		&routes.Route{
			Function:     tonic.Handler(GetPlaces, 200),
			Method:       http.MethodGet,
			Path:         "/place",
			AuthRequired: true,
		},
		&routes.Route{
			Function:     gin.HandlerFunc(GetPicture),
			Method:       http.MethodGet,
			Path:         "/place/picture/:reference",
			AuthRequired: true,
		},
	)
}
