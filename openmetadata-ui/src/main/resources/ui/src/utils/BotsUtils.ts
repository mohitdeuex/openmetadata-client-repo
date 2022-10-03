/*
 *  Copyright 2021 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { isUndefined } from 'lodash';
import moment from 'moment';
import { AuthTypes } from '../enums/signin.enum';
import { AuthenticationMechanism } from '../generated/api/teams/createUser';
import { SsoServiceType } from '../generated/entity/teams/authN/ssoAuth';
import { AuthType, JWTTokenExpiry, User } from '../generated/entity/teams/user';

export const getJWTTokenExpiryOptions = () => {
  return Object.keys(JWTTokenExpiry).map((expiry) => {
    const expiryValue = JWTTokenExpiry[expiry as keyof typeof JWTTokenExpiry];
    const isHourOption = expiryValue === JWTTokenExpiry.OneHour;

    return {
      label: isHourOption ? '1 hr' : `${expiryValue} days`,
      value: expiryValue,
    };
  });
};

export const getAuthMechanismTypeOptions = (
  authConfig: Record<string, string | boolean> | undefined
) => {
  const JWTOption = { label: 'OpenMetadata JWT', value: AuthType.Jwt };
  /**
   * If no auth is setup return the JWT option only
   */
  if (isUndefined(authConfig)) {
    return [JWTOption];
  } else {
    /**
     * If there is provider then return JWT and SSO options
     * Else return JWT option only
     */
    switch (authConfig?.provider) {
      case SsoServiceType.Google: {
        const GoogleSSOOption = { label: 'Google SSO', value: AuthType.Sso };

        return [JWTOption, GoogleSSOOption];
      }
      case SsoServiceType.Auth0: {
        const Auth0SSOOption = { label: 'Auth0 SSO', value: AuthType.Sso };

        return [JWTOption, Auth0SSOOption];
      }
      case SsoServiceType.Azure: {
        const AzureSSOOption = { label: 'Azure SSO', value: AuthType.Sso };

        return [JWTOption, AzureSSOOption];
      }
      case SsoServiceType.Okta: {
        const OktaSSOOption = { label: 'Okta SSO', value: AuthType.Sso };

        return [JWTOption, OktaSSOOption];
      }
      case SsoServiceType.CustomOidc: {
        const CustomOidcSSOOption = {
          label: 'CustomOidc SSO',
          value: AuthType.Sso,
        };

        return [JWTOption, CustomOidcSSOOption];
      }

      case AuthTypes.BASIC:
      default:
        return [JWTOption];
    }
  }
};

/**
 *
 * @param expiry expiry value like "7" "30"
 * @returns expiry text like "The Token will expire on date"
 */
export const getTokenExpiryText = (expiry: string) => {
  if (expiry === JWTTokenExpiry.Unlimited) {
    return 'The token will never expire!';
  } else if (expiry === JWTTokenExpiry.OneHour) {
    return `The token will expire in ${expiry}`;
  } else {
    return `The token will expire on ${moment()
      .add(expiry, 'days')
      .format('ddd Do MMMM, YYYY')}`;
  }
};

/**
 *
 * @param expiry expiry timestamp
 * @returns TokenExpiry
 */
export const getTokenExpiry = (expiry: number) => {
  // get the current date timestamp
  const currentTimeStamp = Date.now();

  const isTokenExpired = currentTimeStamp >= expiry;

  return {
    tokenExpiryDate: moment(expiry).format('ddd Do MMMM, YYYY,hh:mm A'),
    isTokenExpired,
  };
};

export const getAuthMechanismFormInitialValues = (
  authMechanism: AuthenticationMechanism,
  botUser: User
) => {
  const authConfig = authMechanism.config?.authConfig;
  const email = botUser.email;

  return {
    audience: authConfig?.audience,
    secretKey: authConfig?.secretKey,

    clientId: authConfig?.clientId,

    oktaEmail: authConfig?.email,

    orgURL: authConfig?.orgURL,

    privateKey: authConfig?.privateKey,

    scopes: authConfig?.scopes?.join(','),

    domain: authConfig?.domain,

    authority: authConfig?.authority,

    clientSecret: authConfig?.clientSecret,

    tokenEndpoint: authConfig?.tokenEndpoint,
    email,
  };
};
