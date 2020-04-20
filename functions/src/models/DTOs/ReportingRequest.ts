import {ReportingResponse, ReportingService} from "../../services/ReportingService";
import {ReportableEntity} from "../ReportableEntity";
import {MerchantInstance, MerchantService, MerchantStatusInstance} from "../Merchant";
import {Error} from "tslint/lib/error";

export abstract class ReportingRequest<T extends ReportableEntity> {
  abstract merchantId: string;
  abstract objId: string;
  abstract url: string;

  _merchantInstance?: MerchantInstance;

  async getMerchantInstance(): Promise<MerchantInstance> {
    if (this._merchantInstance == null) {
      this._merchantInstance = await MerchantService.getRepository().findById(this.merchantId);
    }
    return this._merchantInstance;
  }

  abstract getObjInstance(): Promise<T | undefined>;

  abstract report(): Promise<ReportingResponse<T>>;

  async isAlreadyReported(): Promise<boolean> {
    return (await this.getObjInstance())!.reportedAt != null;
  }

  public toString(): string {
    return `ReportingRequest - merchantId: ${this.merchantId} - objId: ${this.objId} - url: ${this.url}`;
  }
}

export class MerchantStatusReportingRequest extends ReportingRequest<MerchantStatusInstance> {
  merchantId!: string;
  objId!: string;
  url!: string;

  _objInstance?: MerchantStatusInstance;

  async getObjInstance(): Promise<MerchantStatusInstance | undefined> {
    if (this._objInstance == null) {
      const merchant = await this.getMerchantInstance();
      // @ts-ignore
      this._objInstance = await merchant.statuses.findById(this.objId);
    }
    return this._objInstance;
  }

  async report(): Promise<ReportingResponse<MerchantStatusInstance>> {
    const merchantStatus = await this.getObjInstance();
    if (merchantStatus == null) {
      throw new Error("Merchant status couldn't be found");
    }
    const merchant = await this.getMerchantInstance();

    return ReportingService.report(merchantStatus, this.merchantId, this.url, merchant.testMode);

  }

  constructor(init: Partial<MerchantStatusReportingRequest>) {
    super();
    Object.assign(this, init);
  }


}