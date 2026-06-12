// Package crypto contains password hashing, token signing, and secret
// generation for the identity service.
package crypto

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

// argon2id parameters. Tuned for interactive logins (~64MB, single pass).
type argonParams struct {
	memory      uint32
	iterations  uint32
	parallelism uint8
	saltLen     uint32
	keyLen      uint32
}

var defaultParams = argonParams{
	memory:      64 * 1024,
	iterations:  1,
	parallelism: 4,
	saltLen:     16,
	keyLen:      32,
}

var errBadHash = errors.New("crypto: malformed password hash")

// HashPassword returns a PHC-formatted argon2id hash (self-describing: it
// embeds the parameters and salt, so VerifyPassword needs no external state).
func HashPassword(password string) (string, error) {
	salt := make([]byte, defaultParams.saltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("crypto: read salt: %w", err)
	}
	key := argon2.IDKey([]byte(password), salt,
		defaultParams.iterations, defaultParams.memory, defaultParams.parallelism, defaultParams.keyLen)

	b64 := base64.RawStdEncoding
	return fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version, defaultParams.memory, defaultParams.iterations, defaultParams.parallelism,
		b64.EncodeToString(salt), b64.EncodeToString(key)), nil
}

// VerifyPassword reports whether password matches the PHC-encoded hash, using a
// constant-time comparison.
func VerifyPassword(encoded, password string) (bool, error) {
	parts := strings.Split(encoded, "$")
	if len(parts) != 6 || parts[1] != "argon2id" {
		return false, errBadHash
	}

	var version int
	if _, err := fmt.Sscanf(parts[2], "v=%d", &version); err != nil || version != argon2.Version {
		return false, errBadHash
	}

	var p argonParams
	if _, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &p.memory, &p.iterations, &p.parallelism); err != nil {
		return false, errBadHash
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, errBadHash
	}
	want, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return false, errBadHash
	}

	got := argon2.IDKey([]byte(password), salt, p.iterations, p.memory, p.parallelism, uint32(len(want)))
	return subtle.ConstantTimeCompare(want, got) == 1, nil
}
