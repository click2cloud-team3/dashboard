// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package jwe

import (
	"time"

	jose "gopkg.in/square/go-jose.v2"
	"k8s.io/apimachinery/pkg/util/json"
	"k8s.io/client-go/tools/clientcmd/api"

	// "encoding/json"

	authApi "github.com/kubernetes/dashboard/src/app/backend/auth/api"
	"github.com/kubernetes/dashboard/src/app/backend/errors"
)

// Implements TokenManager interface
type jweTokenManager struct {
	keyHolder KeyHolder
	tokenTTL  time.Duration
}

type Token struct {
	LocationOfOrigin string
	Token            string
}

// AdditionalAuthData contains information required to validate token. It is integrity protected.
// For more information check: https://tools.ietf.org/html/rfc7516 (Chapter 2: Terminology)
type AdditionalAuthData map[Claim]string

// Claim represent token claims used in AAD header. For more information check:
// https://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#rfc.section.4
type Claim string

const (
	// Time format used when generating AAD header for token. Required to set token creation/expiration time.
	timeFormat = time.RFC3339
	// IAT claim is part of token AAD header. It represents token "issued at" time.
	IAT Claim = "iat"
	// EXP claim is part of token AAD header. It represents token expiration time.
	EXP Claim = "exp"
)

// Generate and encrypt JWE token based on provided AuthInfo structure. AuthInfo will be embedded in a token payload and
// encrypted with autogenerated signing key.
func (self *jweTokenManager) Generate(authInfo api.AuthInfo) (string, error) {
	marshalledAuthInfo, err := json.Marshal(authInfo)
	if err != nil {
		return "", err
	}

	jweObject, err := self.getEncrypter().EncryptWithAuthData(marshalledAuthInfo, self.generateAAD())
	if err != nil {
		return "", err
	}

	return jweObject.FullSerialize(), nil
}

// Decrypt provides token and returns AuthInfo structure saved in a token payload.
func (self *jweTokenManager) Decrypt(jweToken string) (*api.AuthInfo, error) {
	jweTokenObject, err := self.validate(jweToken)
	if err != nil {
		return nil, err
	}

	decrypted, err := jweTokenObject.Decrypt(self.keyHolder.Key())
	if err == jose.ErrCryptoFailure {
		// Force key refresh and try to decrypt again
		self.keyHolder.Refresh()
		decrypted, err = jweTokenObject.Decrypt(self.keyHolder.Key())
	}

	if err != nil {
		return nil, err
	}

	authInfo := new(api.AuthInfo)
	err = json.Unmarshal(decrypted, authInfo)
	return authInfo, err
}

// Refresh implements token manager interface. See TokenManager for more information.
func (self *jweTokenManager) Refresh(jweToken string) (string, error) {
	if len(jweToken) == 0 {
		return "", errors.NewInvalid("Can not refresh token. No token provided.")
	}

	jweTokenObject, err := self.validate(jweToken)
	if err != nil {
		return "", err
	}

	decrypted, err := jweTokenObject.Decrypt(self.keyHolder.Key())
	if err != nil {
		return "", err
	}

	authInfo := new(api.AuthInfo)
	err = json.Unmarshal(decrypted, authInfo)
	if err != nil {
		return "", errors.NewInvalid("Token refresh error. Could not unmarshal token payload.")
	}

	return self.Generate(*authInfo)
}

// SetTokenTTL implements token manager interface. See TokenManager for more information.
func (self *jweTokenManager) SetTokenTTL(ttl time.Duration) {
	if ttl < 0 {
		ttl = 0
	}

	self.tokenTTL = ttl * time.Second
}

func (self *jweTokenManager) getEncrypter() jose.Encrypter {
	return self.keyHolder.Encrypter()
}

// Parses and validates provided token to check if it hasn't been manipulated with.
func (self *jweTokenManager) validate(jweToken string) (*jose.JSONWebEncryption, error) {
	jwe, err := jose.ParseEncrypted(jweToken)
	if err != nil {
		return nil, err
	}

	if self.tokenTTL > 0 {
		aad := AdditionalAuthData{}
		err = json.Unmarshal(jwe.GetAuthData(), &aad)
		if err != nil {
			return nil, errors.NewInvalid("Token validation error. Could not unmarshal AAD.")
		}

		if self.isExpired(aad[IAT], aad[EXP]) {
			return nil, errors.NewTokenExpired(errors.MsgTokenExpiredError)
		}
	}

	return jwe, nil
}

// Returns true if token has expired. In case time could not be parsed it might mean that token was tampered with and
// token will be marked as expired. This will force user to log in again.
func (self *jweTokenManager) isExpired(iatStr, expStr string) bool {
	iat, err := time.Parse(timeFormat, iatStr)
	if err != nil {
		return true
	}

	exp, err := time.Parse(timeFormat, expStr)
	if err != nil {
		return true
	}

	age := time.Now().Sub(iat.Local())
	return iat.Add(age).After(exp)
}

func (self *jweTokenManager) generateAAD() []byte {
	now := time.Now()
	aad := AdditionalAuthData{
		IAT: now.Format(timeFormat),
	}

	if self.tokenTTL > 0 {
		aad[EXP] = now.Add(self.tokenTTL).Format(timeFormat)
	}

	rawAAD, _ := json.Marshal(aad)
	return rawAAD
}

// Creates and returns default JWE token manager instance.
func NewJWETokenManager(holder KeyHolder) authApi.TokenManager {
	manager := &jweTokenManager{keyHolder: holder, tokenTTL: authApi.DefaultTokenTTL * time.Second}
	return manager
}
