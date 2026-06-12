// Package idgen produces sortable, collision-resistant identifiers.
package idgen

import "github.com/google/uuid"

// New returns a UUIDv7 string — time-ordered, so it sorts by creation time
// and indexes well as a primary key.
func New() string {
	id, err := uuid.NewV7()
	if err != nil {
		return uuid.NewString() // v4 fallback
	}
	return id.String()
}

// Prefixed returns prefix + New(), e.g. Prefixed("evt_").
func Prefixed(prefix string) string { return prefix + New() }
