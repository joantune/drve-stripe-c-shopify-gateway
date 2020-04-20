import * as express from 'express';
import {AvailableGCloudQueues} from "../services/GoogleCloudTasksService";
import {MerchantStatusReportingRequest, ReportingRequest} from "../models/DTOs/ReportingRequest";
import {ReportableEntity} from "../models/ReportableEntity";
import {logger} from "../utils/logger";
import * as jwt from 'jsonwebtoken';
import {constants} from "../conf/constants";
import {errorToString, prettyPrint} from "../utils/utils";

const router = express.Router();

export const PROCESSOR_BASE_PATH="/processors";

const processorControllerBasis =
    function <T extends ReportableEntity>(queueName: string, requestObjFromRequest: (objRep: object) => ReportingRequest<T>)
        : (req: express.Request, resp: express.Response, next: Function) => void {
      const LOG = logger(`processorMiddleWare-${queueName}`);
      return async (req: express.Request, res: express.Response, next: Function) => {


        const jwtToken: string = String(req.query.code);
        const from = req.query.from;
        let requestObject: ReportingRequest<T> | null = null;
        try {
          const auxReqIdentifier = jwt.verify(Buffer.from(jwtToken, "base64").toString(), constants.jwtSecret);
          requestObject = await requestObjFromRequest(auxReqIdentifier as object);
        } catch (e) {
          LOG.error(`While decoding JWT token! - code: ${jwtToken} - from ${from} - returning non 200`, e);
          return res.status(500).send(`Error while decoding JWT token! see error report!`);
        }

        try {
          if (await requestObject.isAlreadyReported()) {
            LOG.info(`Request: ${requestObject} already reported`)
            return res.status(200).send(`Request already processed`);
          }
          const requestResult = await requestObject.report()
          if(requestResult.successful) {
            LOG.info(`Request: ${requestObject} processed`);
            return res.status(200).send('Processed');
          } else {
            const message  =`Error processing request: ${requestObject} - response: ${prettyPrint(requestResult.rawResponse)}`
            LOG.error(message);
            return res.status(400).send(message);
          }

        } catch (ex) {
          const message = `Caught exception processing req: ${requestObject} - ex: ${errorToString(ex)}`;
          LOG.error(message, ex);
          return res.status(500).send(message);
        }

      };
    }

export const processMerchantStatusGETRoute = router.get(`/${AvailableGCloudQueues.processMerchantStatus.toString()}`,
    processorControllerBasis(AvailableGCloudQueues.processMerchantStatus, (obj: any) => new MerchantStatusReportingRequest(obj)));

export const processorController = router;