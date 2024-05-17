import { Injectable } from '@nestjs/common';
import { CognitoUserPool, CognitoUserAttribute, ISignUpResult } from 'amazon-cognito-identity-js';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor() {
    const poolData = {
      UserPoolId: 'us-west-1_LUkW6AImW',
      ClientId: '71k5st4jo9ffr117a3hkduvcu' 
    };
    this.userPool = new CognitoUserPool(poolData);
  }

  async signUp(username: string, password: string, email: string): Promise<ISignUpResult | undefined> {
    const attributeList: CognitoUserAttribute[] = [];
    const dataEmail = {
      Name: 'email',
      Value: email,
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, attributeList, [], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
