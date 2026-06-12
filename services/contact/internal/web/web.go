// Package web serves the static embeddable contact widget.
package web

import (
	_ "embed"
	"net/http"
)

//go:embed widget.js
var widgetJS []byte

// WidgetHandler serves widget.js with a long cache lifetime.
func WidgetHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		w.Header().Set("Cache-Control", "public, max-age=3600")
		_, _ = w.Write(widgetJS)
	})
}
