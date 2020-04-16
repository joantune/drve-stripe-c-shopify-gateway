import {Collection, IEntity, ISubCollection, SubCollection} from "fireorm";
import {AbstractDatedEntity, AbstractDatedEntityImp} from "./AbstractDatedEntity";
import Stripe = require("stripe");
import {getRepository} from "../conf/database";
import * as _ from 'lodash';

// import * as uuid from 'uuid';

export enum Status {
  Stripe_waiting = "Stripe_waiting", //Stripe_waiting (waiting activation from Stripe) [enabled = false]
  Active = "Active", //Active (all good and accepting payments)  [enabled = true]
  Inactive = "Inactive",//Inactive (disabled by the API)  [enabled = false]
  Stripe_inactive = "Stripe_inactive" //Stripe_inactive (disabled by Stripe [either removed on the Stripe's dashboard - or something else])  [enabled = false]

}

export interface MerchantInput {
  drveUid: string;//doubles down with DRVE id

  shopifyDomain: string;

  commissionPercentage: number;
  enabled: boolean;
  name: string;

  chargeWebhookUrl: string;
  connectedAccountWebhookUrl: string;

  stripeOnConnectionRedirectURL: string;



}

export interface MerchantOutput extends MerchantInput,IEntity, AbstractDatedEntity  {
  status: Status;

  gatewayURL: string;
  gatewayAccountId: string;
  gatewayCredentials: string

  stripeAcctId: string;
  stripeURLToConnectAccount: string;
  testMode: boolean;


}

export class MerchantOutputInstance implements MerchantOutput {
  chargeWebhookUrl: string = "";
  commissionPercentage: number = 0;
  connectedAccountWebhookUrl: string = "";
  createdAt: Date = new Date();
  drveUid: string = "";
  enabled: boolean = false;
  gatewayAccountId: string = "";
  gatewayCredentials: string = "";
  gatewayURL: string = "";
  id: string = "";
  name: string = "";
  shopifyDomain: string = "";
  status: Status  =Status.Stripe_waiting;
  stripeAcctId: string = "";
  stripeOnConnectionRedirectURL: string = "";
  stripeURLToConnectAccount: string = "";
  testMode: boolean = true;
  updatedAt: Date = new Date();


  constructor(init?: Partial<MerchantOutput>) {
    Object.assign(this,init);
  }

}

export interface Merchant extends MerchantOutput {
  // stripeCredentials?: Stripe.oauth.IOAuthToken;
}

export enum AuthorativeEntity {
  Stripe = "Stripe",
  DRVE = "DRVE"
}

export interface StatusMerchant {
  status: Status;
  miscInfo?: string;
  dateStatus: Date;
  enforcedBy: AuthorativeEntity;
}

export interface StatusMerchantOutput extends StatusMerchant {
  drveUid: string;
}

export class StatusMerchantInstance implements IEntity,  StatusMerchant {
  dateStatus!: Date;
  enforcedBy!: AuthorativeEntity;
  miscInfo?: string;
  status!: Status;
  id!: string;

}

const merchantOutputKeys = Object.keys(new MerchantOutputInstance());

@Collection()
export class MerchantInstance extends AbstractDatedEntityImp implements Merchant {

  get id(): string {
    return this.drveUid;
  }

  set id(value: string){
    this.drveUid = value;
  }
  drveUid!: string;
  testMode!: boolean;
  shopifyDomain!: string;

  chargeWebhookUrl!: string;
  commissionPercentage!: number;
  connectedAccountWebhookUrl!: string;


  _enabled?: boolean;
  get enabled(): boolean {
    return this.latestStatus.status == Status.Active;
  }
  set enabled(value: boolean) {
    throw new Error("Can't set the enabled directly");
  }

  gatewayAccountId!: string;
  gatewayCredentials!: string;
  gatewayURL!: string;
  name!: string;

  latestStatus!: StatusMerchant;

  @SubCollection(StatusMerchantInstance)
  statuses!: ISubCollection<StatusMerchantInstance>;

  stripeEnabled: boolean = false;

  get status(): Status {
    return this.latestStatus.status;
  }





  stripeAcctId!: string;
  stripeCredentials?: Stripe.oauth.IOAuthToken;
  stripeOnConnectionRedirectURL!: string;
  stripeURLToConnectAccount!: string;

  constructor() {
    super();
  }

  //whenever there's a change here - a Status can/should be used as well
  // async innerSetEnabledStatus(enabled: boolean) {
  //   if (this._enabled != undefined && enabled != this._enabled && this.enabled) {
  //     then we should create the status of disabled
      // await this.addStatus(Status.Inactive, AuthorativeEntity.DRVE);
    // }
    // this._enabled = enabled;
  // }

  async addStatus(status: Status, enforcedBy: AuthorativeEntity, miscInfo?: string) {
    const instance = new StatusMerchantInstance();
    instance.dateStatus = new Date();
    instance.enforcedBy = enforcedBy;
    instance.miscInfo = miscInfo;
    instance.status = status;

    this.latestStatus = Object.assign({},instance);
    await this.statuses.create(instance);


  }

  asOutput(): Partial<MerchantOutput> {
    return _.pick(this, merchantOutputKeys);
  }

}


export class MerchantService {
  public static getRepository() {
    return getRepository(MerchantInstance);
  }

  private static async newInstance(testMode: boolean, init: MerchantInput): Promise<MerchantInstance> {
    let instance = new MerchantInstance();
    const enabledValue = init.enabled
    delete init.enabled;
    Object.assign(instance, init);
    instance.testMode = testMode;
    instance._enabled = enabledValue;
    instance = await MerchantService.getRepository().create(instance);
    //at the beginning - Stripe can't be active
    instance.addStatus(Status.Stripe_waiting, AuthorativeEntity.Stripe, "Merchant initial status");
    return instance;
  }
  static async create(testMode: boolean, init: MerchantInput): Promise<MerchantInstance> {
    const instance = await MerchantService.newInstance(testMode, init);
    return MerchantService.getRepository().update(instance);
  }
}