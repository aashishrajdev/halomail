package crypto

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

// RandomToken returns a hex-encoded cryptographically-random string of nbytes.
// Used for opaque refresh tokens and API-key secrets.
func RandomToken(nbytes int) (string, error) {
	b := make([]byte, nbytes)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("crypto: random: %w", err)
	}
	return hex.EncodeToString(b), nil
}

// SHA256Hex returns the hex SHA-256 of s. Refresh tokens and API-key secrets are
// stored as this digest, never in plaintext.
func SHA256Hex(s string) string {
	sum := sha256.Sum256([]byte(s))
	return hex.EncodeToString(sum[:])
}
