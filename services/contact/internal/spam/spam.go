// Package spam scores contact submissions with simple, explainable heuristics.
// It is pure so it can be unit-tested and tuned independently.
package spam

import (
	"strings"
	"unicode"
)

// Threshold at/above which a message is flagged as spam.
const Threshold = 0.7

var spammyWords = []string{
	"viagra", "casino", "lottery", "crypto", "forex", "bitcoin",
	"loan", "seo services", "cheap", "free money", "click here",
	"work from home", "weight loss", "porn", "escort",
}

// Score returns a spam likelihood in [0, 1] from the sender name, email, and
// submitted field values.
func Score(name, email string, values []string) float64 {
	text := strings.ToLower(strings.Join(append([]string{name, email}, values...), " "))
	score := 0.0

	// Links are the strongest signal in contact spam.
	links := strings.Count(text, "http://") + strings.Count(text, "https://") + strings.Count(text, "www.")
	score += float64(links) * 0.35

	for _, w := range spammyWords {
		if strings.Contains(text, w) {
			score += 0.4
		}
	}

	// Excessive shouting.
	if upper := upperRatio(strings.Join(values, " ")); upper > 0.6 {
		score += 0.2
	}

	// Extremely short bodies are often bot probes.
	if len(strings.TrimSpace(strings.Join(values, ""))) < 5 {
		score += 0.2
	}

	if score > 1 {
		score = 1
	}
	return score
}

// IsSpam reports whether the score crosses the threshold.
func IsSpam(score float64) bool { return score >= Threshold }

func upperRatio(s string) float64 {
	var letters, upper int
	for _, r := range s {
		if unicode.IsLetter(r) {
			letters++
			if unicode.IsUpper(r) {
				upper++
			}
		}
	}
	if letters == 0 {
		return 0
	}
	return float64(upper) / float64(letters)
}
