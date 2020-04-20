import {MerchantService, MerchantStatusInstance} from "../models/Merchant";
import {PaymentInstance} from "../models/Payment";
import {RefundInstance} from "../models/Refund";
import * as functions from "firebase-functions";
import {logger} from "../utils/logger";
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";

import axios, {AxiosResponse, AxiosTransformer} from "axios";
import * as crypto from "crypto";
import {credentials} from "../conf/constants";
import {ReportableEntity} from "../models/ReportableEntity";
import {MerchantStatusReportingRequest} from "../models/DTOs/ReportingRequest";
import {AvailableGCloudQueues, enqueueUpdate} from "./GoogleCloudTasksService";

function generateTransformer(testModeRequest: boolean): AxiosTransformer {
  return (data, headers) => {
    const secretToUse = testModeRequest ? credentials.testing.webhookSecret : credentials.live.webhookSecret;
    const dataString = JSON.stringify(data);
    const calculatedHmac = Buffer.from(
        crypto
            .createHmac("sha256", secretToUse)
            .update(dataString)
            .digest("base64")).toString();
    headers['x-gateway-hmac-sha256'] = calculatedHmac;
    return dataString;
  }

}

export class ReportingResponse<T extends ReportableEntity> {
  constructor(readonly rawResponse: AxiosResponse, public successful: boolean, public reportedObj: T ) {}
}

export class ReportingService {


  static enqueueStatusMerchant(statusMerchant: MerchantStatusInstance, merchantId: string, url: string, from?: string): Promise<any> {
    //todo enqueue the stuff
    const reportRequest = new MerchantStatusReportingRequest({
      merchantId: merchantId,
      objId: statusMerchant.id,
      url: url
    });
    return enqueueUpdate(reportRequest, AvailableGCloudQueues.processMerchantStatus, from);
  }

  static enqueuePayment(payment: PaymentInstance, merchantId: string) {
    //TODO
  }

  static enqueueRefund(refund: RefundInstance, paymentId: string, merchantId: string) {
    //TODO
  }

  static async report(statusMerchant: MerchantStatusInstance, merchantIdDrveUid: string,
                      url: string, testMode: boolean, phonyCall: boolean = false): Promise<ReportingResponse<MerchantStatusInstance>> {
    const axiosInstance = axios.create({transformRequest: generateTransformer(testMode)});
    const rawResponse = await axiosInstance.post(url, statusMerchant.asOutput(merchantIdDrveUid))
    return ReportingService.processResponse<MerchantStatusInstance>(statusMerchant,
        rawResponse, url, async (status: MerchantStatusInstance) => {
          const merchant = await MerchantService.getRepository().findById(merchantIdDrveUid);
          return merchant.statuses.update(status);
        }, phonyCall)
  }

  private static async processResponse<T extends ReportableEntity>(reportedEntity: T, rawResponse: AxiosResponse,
                                                                   url: string,
                                                                   updateEntity: (obj: T) => Promise<T>,
                                                                   phonyCall: boolean = false): Promise<ReportingResponse<T>> {
    const successful = Math.trunc(rawResponse.status / 100) == 2;
    const toReturn = new ReportingResponse<T>( rawResponse, successful, reportedEntity);
    if (successful) {
      //success
      reportedEntity.reportBody = JSON.stringify(rawResponse.data);
      reportedEntity.reportedAt = new Date();
      reportedEntity.reportedTo = url;
      reportedEntity.reportHeaders = JSON.stringify(rawResponse.headers);
      if (!phonyCall) {
        toReturn.reportedObj = await updateEntity(reportedEntity);
      }


    }

    return toReturn;

  }




}

export const processNewlyCreatedStatusMerchant = functions.firestore.document('MerchantInstances/{mid}/statuses/{status}')
    .onCreate(async (snap: DocumentSnapshot, context) => {
      //TODO - make this actually enqueue the MerchantInstance - just in case feature
      const LOG = logger('processNewlyCreatedStatusMerchant');
        //let's make sure that
        const statusMerchant = <MerchantStatusInstance> snap.data();
        const merchantInstanceId =  context.params.mid;
        LOG.warn(`process Status called for ${merchantInstanceId} status ID: ${statusMerchant.id}`);

        const miscInfo = statusMerchant.miscInfo || "";
        if(miscInfo.endsWith("failed once already")) {
          //then let's not fail
          LOG.warn(`Processed things correctly`);
        } else {
          const merchant = await MerchantService.getRepository().findById(merchantInstanceId);
          statusMerchant.miscInfo = miscInfo + " failed once already";
          await merchant.statuses.update(statusMerchant);
          LOG.error('Throwing error')
          throw new Error('Faulted on purpose');

        }


    });
