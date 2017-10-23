package event

import (
	"net/http"

	"github.com/loopfz/gadgeto/tonic"
	"github.com/snigle/aicom/server/routes"
)

func init() {
	routes.AddRoute(
		&routes.Route{
			Function:     tonic.Handler(GetEvents, 200),
			Method:       http.MethodGet,
			Path:         "/event",
			AuthRequired: true,
		},
		&routes.Route{
			Function:     tonic.Handler(GetPendingEvent, 200),
			Method:       http.MethodGet,
			Path:         "/event/pending",
			AuthRequired: true,
		},
		&routes.Route{
			Function:     tonic.Handler(NewEvent, 200),
			Method:       http.MethodPost,
			Path:         "/event",
			AuthRequired: true,
		},
		&routes.Route{
			Function:     tonic.Handler(AcceptEvent, 200),
			Method:       http.MethodPut,
			Path:         "/event/:uuid",
			AuthRequired: true,
		},
		&routes.Route{
			Function:     tonic.Handler(CancelEvent, 200),
			Method:       http.MethodDelete,
			Path:         "/event/:uuid",
			AuthRequired: true,
		},
		&routes.Route{
			Function:     tonic.Handler(SendMessage, 200),
			Method:       http.MethodPost,
			Path:         "/event/:uuid/message",
			AuthRequired: true,
		},
		&routes.Route{
			Function:     tonic.Handler(ReceivedMessage, 200),
			Method:       http.MethodPut,
			Path:         "/event/:uuid/message/:messageId",
			AuthRequired: true,
		},
	)
}
