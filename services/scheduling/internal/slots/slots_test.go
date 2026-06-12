package slots

import (
	"testing"
	"time"
)

func TestCompute(t *testing.T) {
	loc := time.UTC
	now := time.Date(2026, 6, 1, 0, 0, 0, 0, loc) // a Monday, midnight
	// Monday 09:00–11:00 window, 60-min meetings.
	rules := []Rule{{Weekday: 1, StartMinute: 9 * 60, EndMinute: 11 * 60}}

	tests := []struct {
		name string
		p    Params
		want int
	}{
		{
			name: "two back-to-back slots",
			p: Params{
				Location: loc, Rules: rules,
				FromDate: "2026-06-01", ToDate: "2026-06-01",
				DurationMin: 60, Now: now,
			},
			want: 2, // 09:00 and 10:00
		},
		{
			name: "busy 09:00-10:00 removes first slot",
			p: Params{
				Location: loc, Rules: rules,
				FromDate: "2026-06-01", ToDate: "2026-06-01",
				DurationMin: 60, Now: now,
				Busy: []Interval{{
					Start: time.Date(2026, 6, 1, 9, 0, 0, 0, loc),
					End:   time.Date(2026, 6, 1, 10, 0, 0, 0, loc),
				}},
			},
			want: 1, // only 10:00
		},
		{
			name: "unavailable override yields nothing",
			p: Params{
				Location: loc, Rules: rules,
				Overrides:   []Override{{Date: "2026-06-01", Unavailable: true}},
				FromDate:    "2026-06-01", ToDate: "2026-06-01",
				DurationMin: 60, Now: now,
			},
			want: 0,
		},
		{
			name: "past slots excluded",
			p: Params{
				Location: loc, Rules: rules,
				FromDate: "2026-06-01", ToDate: "2026-06-01",
				DurationMin: 60,
				Now:         time.Date(2026, 6, 1, 9, 30, 0, 0, loc), // after 09:00
			},
			want: 1, // 10:00 only
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Compute(tc.p)
			if len(got) != tc.want {
				t.Fatalf("got %d slots, want %d: %+v", len(got), tc.want, got)
			}
		})
	}
}
