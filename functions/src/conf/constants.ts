import * as express from "express";
import * as functions from "firebase-functions";

export const constants = {
  basePath:  process.env.NODEMON_DEBUG ? "" :
      process.env.FUNCTIONS_EMULATOR
      ? "/drve-stripe-c-gateway-shopify/us-central1/app"
      :  "/app",
  port: process.env.FUNCTIONS_EMULATOR ? null : null,
  shopifyApiVersion: '2019-07',
  schema: process.env.FUNCTIONS_EMULATOR ? "https" : "https",
  project: process.env.GCLOUD_PROJECT || "drve-stripe-c-gateway-shopify",
  allowedHosts: [
    "localhost",
    "drve-gateway.ngrok.io",
    "us-central1-drve-stripe-c-gateway-shopify.cloudfunctions.net"
  ],
  defaultRequestHost: functions.config().default.req_host,
  functionLocation: 'us-central1',
  jwtSecret: process.env.JWT_SECRET || "asdkjlas jlkjkalsdjkljk lsjklsdaj l!@#ASD askjhd ASD k;SDVAFBCVNMS",
  production: process.env.PRODUCTION || false
};

interface apiCredentials {
  apiKey: string,
  apiSecret: string,
  webhookSecret: string
}


interface credentialsInterface {
  live: apiCredentials,
  testing: apiCredentials
}


export const credentials : credentialsInterface= {
  live:  {
    apiKey: "129k=-asdmk123-asd2-asdancxcxv",
    apiSecret: "lalk2109asdASDJFK@#",
    webhookSecret: "asdsakjh122309912038"
  },
  testing: {
    apiKey: "testing",
    apiSecret: "apiSecret",
    webhookSecret: "asldslakjdkj123lkj123"
  }
}

export const credentialsMatch = function(apiKey: string, apiSecret: string): Array<boolean> {
  if(credentials.live.apiKey == apiKey && credentials.live.apiSecret == apiSecret) {
    return [true, false];
  }
  if(credentials.testing.apiKey == apiKey && credentials.testing.apiSecret == apiSecret) {
    return [true, true];
  }
  return [false, false];

}


/**
 * return an empty string if no custom port is defined - or the :<port> which is
 * appropriate for an URL
 */
export const portURIStringOrEmpty = function (): string {
  return constants.port == null ? "" : `:${constants.port}`;
};

export const baseAbsUrl = function(): string {
  return `https://${constants.defaultRequestHost}/`;
}
/**
 * @returns the host - if the host of the request is on the list of allowed hosts
 * throws an error otherwise
 * @param request the Express request to extract
 */
export const requestHost = function (request: express.Request): string {
  if (constants.allowedHosts.indexOf(request.hostname) == -1) {
    throw new Error(`Host: ${request.hostname} not in allowedHosts`);
  }
  return request.hostname;
};
