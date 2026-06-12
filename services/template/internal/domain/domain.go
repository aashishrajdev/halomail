// Package domain holds template entities. Pure: no I/O.
package domain

import "time"

// Theme kinds.
const (
	ThemeMinimal  = "minimal"
	ThemeApple    = "apple"
	ThemeNotion   = "notion"
	ThemeGlass    = "glass"
	ThemeTerminal = "terminal"
	ThemeCustom   = "custom"
)

// BuiltinThemes is the ordered set of non-custom themes.
var BuiltinThemes = []string{ThemeMinimal, ThemeApple, ThemeNotion, ThemeGlass, ThemeTerminal}

// Template is a user-owned saved email design.
type Template struct {
	ID         string
	OwnerID    string
	Name       string
	Theme      string
	Subject    string
	CustomHTML string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

// ThemeInfo describes a built-in theme for the gallery.
type ThemeInfo struct {
	Kind        string
	Name        string
	Description string
	PreviewHTML string
}
