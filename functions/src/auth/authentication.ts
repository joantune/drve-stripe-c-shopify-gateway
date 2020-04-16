import * as express from 'express';
import {credentialsMatch} from "../conf/constants";

export interface authResult {
  testMode: boolean
}

export function expressAuthentication(req: express.Request, name: string, scopes?: string[]): Promise<any> {
  if (name === 'api_key') {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return Promise.reject({
        message: 'Missing Authorization Header',
        headers: [['WWW-Authenticate','Basic realm="DRVE Gateway Auth"']]
      })
    }
    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const cred = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [apiKey, apiSecret] = cred.split(':');
    const [authenticated, testMode] = credentialsMatch(apiKey, apiSecret);
    if (!authenticated) {
      return Promise.reject({
        message: 'Invalid authentication credentials'
      })
    } else {
      return Promise.resolve(<authResult>{testMode: testMode});
    }


  }
  return Promise.reject({error: 'Not authed'});
}
