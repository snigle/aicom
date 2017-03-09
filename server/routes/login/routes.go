package login

import (
	"net/http"

	"github.com/loopfz/gadgeto/tonic"
	"github.com/snigle/aicom/server/routes"
)

func init() {
	routes.AddRoute(&routes.Route{
		Function: tonic.Handler(Login, 200),
		Method:   http.MethodPost,
		Path:     "/login",
	})
}
