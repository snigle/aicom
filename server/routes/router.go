package routes

import "github.com/gin-gonic/gin"

type Route struct {
	Function     gin.HandlerFunc
	AuthRequired bool
	Method       string
	Path         string
}

var routes []*Route

func GetRoutes() []*Route {
	return routes
}

func AddRoute(r ...*Route) {
	routes = append(routes, r...)
}
