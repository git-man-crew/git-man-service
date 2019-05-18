import { Injectable, Logger, HttpService } from '@nestjs/common';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
  ICognitoUserPoolData,
  CognitoUserAttribute,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import AWS = require('aws-sdk');
import jwkToPem = require('jwk-to-pem');
import jwt = require('jsonwebtoken');
import { UserModel } from '../models/user.model';
import { ConfigService } from '../../config/service/config.service';
import fetch = require('node-fetch');
(global as any).fetch = fetch;

@Injectable()
export class UserRepository {
  private readonly poolData: ICognitoUserPoolData = {
    UserPoolId: this.configService.getSystemProperty('USER_POOL_ID'),
    ClientId: this.configService.getSystemProperty('APP_CLIENT_ID'),
  };
  private readonly userPool = new CognitoUserPool(this.poolData);
  private readonly poolRegion = this.configService.getSystemProperty(
    'AWS_REGION',
  );

  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
  ) {
    AWS.config = new AWS.Config();
    AWS.config.region = this.poolRegion;
  }

  public signUpUser(userModel: UserModel): Promise<any> {
    const attributeList = this.createAttributes(userModel);
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        userModel.email,
        userModel.password,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            Logger.warn(err);
            return reject(err);
          }
          const cognitoUser = result.user;
          Logger.log('user name is ' + cognitoUser.getUsername());
          resolve(cognitoUser);
        },
      );
    });
  }

  public signInUser(authModel: UserModel): Promise<CognitoUserSession> {
    const authenticationDetails = new AuthenticationDetails({
      Username: authModel.email,
      Password: authModel.password,
    });

    const userData = {
      Username: authModel.email,
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
          Logger.log('access token + ' + result.getAccessToken().getJwtToken());
          Logger.log('id token + ' + result.getIdToken().getJwtToken());
          Logger.log('refresh token + ' + result.getRefreshToken().getToken());
          resolve(result);
        },
        onFailure(err) {
          Logger.warn(err);
          reject(err);
        },
      });
    });
  }

  public validateToken(token): Promise<any> {
    return this.httpService
      .get(
        `https://cognito-idp.${this.poolRegion}.amazonaws.com/${
        this.poolData.UserPoolId
        }/.well-known/jwks.json`,
      )
      .toPromise()
      .then(async body => {
        if (body.status !== 200) {
          return Logger.warn('Unable to download JWKs', body.statusText);
        }

        const pemCollection = {};
        const keys: any[] = body.data.keys;
        keys.forEach(key => {
          const keyId = key.kid;
          const modulus = key.n;
          const exponent = key.e;
          const keyType = key.kty;
          const jwk = { kty: keyType, n: modulus, e: exponent };
          const generatedPem = jwkToPem(jwk);
          pemCollection[keyId] = generatedPem;
        });
        const decodedJwt: any = jwt.decode(token, { complete: true });
        if (!decodedJwt) {
          return Logger.warn('JWT token is invalid');
        }

        const kid = decodedJwt.header.kid;
        const pem = pemCollection[kid];

        return await new Promise((resolve, reject) => {
          jwt.verify(token, pem, (err, payload) => {
            if (err) {
              Logger.warn('JWT token is invalid');
              return reject(err);
            }
            Logger.log('JWT token is valid');
            Logger.log(payload);
            resolve(payload);
          });
        });
      });
  }

  public refreshToken(eMail: string, refreshToken: string) {
    const RefreshToken = new CognitoRefreshToken({
      RefreshToken: refreshToken,
    });
    const userPool = new CognitoUserPool(this.poolData);
    const userData = {
      Username: eMail,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
          Logger.log(err);
          return reject(err);
        }
        const refreshedToken = {
          access_token: session.accessToken.jwtToken,
          id_token: session.idToken.jwtToken,
          refresh_token: session.refreshToken.token,
        };
        Logger.log(refreshedToken);
        resolve(refreshedToken);
      });
    });
  }

  public async updateUser(userModel: UserModel) {
    const authenticationDetails = new AuthenticationDetails({
      Username: userModel.email,
      Password: userModel.password,
    });
    const attributeList: any[] = this.createAttributes(userModel);
    const userData = {
      Username: authenticationDetails.getUsername(),
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess() {
          cognitoUser.updateAttributes(attributeList, (err, result) => {
            if (err) {
              Logger.warn(err);
              return reject(err);
            }

            Logger.log(result);
            resolve(result);
          });
        },
        onFailure(err) {
          Logger.warn(err);
          reject(err);
        },
      });
    });
  }

  public deleteUser(userModel: UserModel) {
    const authenticationDetails = new AuthenticationDetails({
      Username: userModel.email,
      Password: userModel.password,
    });

    const userData = {
      Username: authenticationDetails.getUsername(),
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess() {
          cognitoUser.deleteUser((err, deletedUser) => {
            if (err) {
              Logger.warn(err);
              return reject(err);
            }
            Logger.log('Successfully deleted the user.');
            Logger.log(deletedUser);
            resolve(deletedUser);
          });
        },
        onFailure(err) {
          Logger.warn(err);
          reject(err);
        },
      });
    });
  }

  public changePassword(userModel: UserModel) {
    const authenticationDetails = new AuthenticationDetails({
      Username: userModel.email,
      Password: userModel.password,
    });
    const userData = {
      Username: authenticationDetails.getUsername(),
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess() {
          cognitoUser.changePassword(userModel.password, userModel.newPassword, (err, changedPassword) => {
            if (err) {
              Logger.warn(err);
              return reject(err);
            }
            Logger.log('Successfully changed password of the user.');
            Logger.log(changedPassword);
            return resolve(changedPassword);
          });
        },
        onFailure(err) {
          Logger.log(err);
          reject(err);
        },
      });
    });
  }

  public getUserAttributes(userModel: UserModel): Promise<CognitoUserAttribute[]> {
    const authenticationDetails = new AuthenticationDetails({
      Username: userModel.email,
      Password: userModel.password,
    });
    const userData = {
      Username: authenticationDetails.getUsername(),
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess() {
          cognitoUser.getUserAttributes((err, attributes: CognitoUserAttribute[]) => {
            if (err) {
              Logger.warn(err);
              return reject(err);
            }
            return resolve(attributes);
          });
        },
        onFailure(err) {
          Logger.log(err);
          reject(err);
        },
      });
    });
  }

  private createAttributes(userModel: UserModel): CognitoUserAttribute[] {
    const attributeList: CognitoUserAttribute[] = [];
    attributeList.push(
      new CognitoUserAttribute({ Name: 'name', Value: userModel.name }),
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name: 'preferred_username',
        Value: userModel.email,
      }),
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name: 'birthdate',
        Value: userModel.birthdate,
      }),
    );
    attributeList.push(
      new CognitoUserAttribute({ Name: 'email', Value: userModel.email }),
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name: 'phone_number',
        Value: userModel.phoneNumber,
      }));
    return attributeList;
  }
}
