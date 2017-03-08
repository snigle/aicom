package login

import (
	"net/http"

	"github.com/loopfz/gadgeto/tonic"
	"github.com/snigle/server/routes"
)

func init() {
	routes.AddRoute(
		&routes.Route{
			Function:     tonic.Handler(SetActivity, 200),
			Method:       http.MethodPut,
			Path:         "/user/activity",
			AuthRequired: true,
		},
		&routes.Route{
			Function:     tonic.Handler(DeleteActivity, 200),
			Method:       http.MethodDelete,
			Path:         "/user/activity",
			AuthRequired: true,
		})
}
