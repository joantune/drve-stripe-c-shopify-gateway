import * as functions from 'firebase-functions';
import * as express from "express";
import * as exphbs from "express-handlebars";
import cookieParser = require("cookie-parser");
import {constants} from "./conf/constants";
import * as bodyParser from "body-parser";
import * as methodOverride from 'method-override';
import './controllers/MerchantsController';

import { RegisterRoutes } from './routes/routes';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");

// });


const STATIC_PATH = "assets";

const app = express();

app.use(cookieParser("asdasd knjoi12u81289jasdnjkl njkl12iuo2oui3jsadnjk bhjklHLGGKEUYAEa!@#", {

}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

RegisterRoutes(app);

const hnldbrs = exphbs.create({
  helpers: {
    isoDate: function (aDate: Date) {
      return aDate.toISOString();
    },
    static: function (options: any) {
      return `${constants.basePath}/${STATIC_PATH}/${options.fn()}`;
    },
    url: function (options: any) {
      return `${constants.basePath}/${options.fn()}`;
    },
    eq: function (v1: any, v2: any) {
      return v1 === v2;
    },
    ne: function (v1: any, v2: any) {
      return v1 !== v2;
    },
    lt: function (v1: any, v2: any) {
      return v1 < v2;
    },
    gt: function (v1: any, v2: any) {
      return v1 > v2;
    },
    lte: function (v1: any, v2: any) {
      return v1 <= v2;
    },
    gte: function (v1: any, v2: any) {
      return v1 >= v2;
    },
    and: function () {
      return Array.prototype.slice.call(arguments).every(Boolean);
    },
    or: function () {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
  }
});
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  const body: any = {
    fields: err.fields || undefined,
    message: err.message || 'An error occurred during the request.',
    name: err.name,
    status,
    //TODO add stacktrace if in development mode
  };
  if(constants.production == false) {
    body.stack = err.stack || undefined;
  }
  for(let header of err.headers || []) {
    res.setHeader(header[0], header[1]);
  }
  res.status(status).json(body);
});

app.engine(
    "handlebars",
    hnldbrs.engine
);

app.set("view engine", "handlebars");

//serve static assets on dir assets
app.use(`/${STATIC_PATH}`, express.static("assets"));


exports.app = functions.runWith({
  memory: '256MB',
  timeoutSeconds: 500
}).https.onRequest(app);
