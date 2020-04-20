import {Collection, IEntity, ISubCollection, SubCollection} from "fireorm";
import {AbstractDatedEntity, AbstractDatedEntityImp} from "./AbstractDatedEntity";
import Stripe = require("stripe");
import {getRepository} from "../conf/database";
import * as _ from 'lodash';
import {ReportableEntity} from "./ReportableEntity";
import {ReportingService} from "../services/ReportingService";
import {constants} from "../conf/constants";
const Hashids = require('hashids/cjs');
import { v4 as uuidv4 } from 'uuid';
import * as randomstring from 'randomstring';

export enum StatusModel {
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

/**
 * @tsoaModel
 */
export interface MerchantOutput extends MerchantInput,IEntity, AbstractDatedEntity  {
  status: StatusModel;

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
  status: StatusModel  =StatusModel.Stripe_waiting;
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

export interface IMerchantStatus {
  status: StatusModel;
  miscInfo?: string;
  dateStatus: Date;
  enforcedBy: AuthorativeEntity;
}

export interface MerchantStatusOutput extends IMerchantStatus {
  drveUid: string;
}

class MerchantStatusOutputInstance implements MerchantStatusOutput{
  dateStatus: Date = new Date();
  drveUid: string = "";
  enforcedBy: AuthorativeEntity = AuthorativeEntity.DRVE;
  miscInfo: string = "";
  status: StatusModel = StatusModel.Inactive;
}

const merchantStatusOutputKeys = Object.keys(new MerchantStatusOutputInstance());

export class MerchantStatusInstance extends ReportableEntity implements IEntity,  IMerchantStatus {
  dateStatus!: Date;
  enforcedBy!: AuthorativeEntity;
  miscInfo?: string;
  status!: StatusModel;
  id!: string;


  asOutput(drveUid: string): Partial<MerchantStatusOutput> {
    const merchantStatusOutput = <MerchantStatusOutput>_.pick(this, merchantStatusOutputKeys);
    if(this.miscInfo == undefined) {
      delete merchantStatusOutput.miscInfo;
    }

    merchantStatusOutput.drveUid = drveUid;
    return merchantStatusOutput;
  }


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
    return this.latestStatus.status == StatusModel.Active;
  }
  set enabled(value: boolean) {
    throw new Error("Can't set the enabled directly");
  }

  gatewayAccountId!: string;
  gatewayCredentials!: string;
  gatewayURL!: string;
  name!: string;

  latestStatus!: IMerchantStatus;

  @SubCollection(MerchantStatusInstance)
  statuses!: ISubCollection<MerchantStatusInstance>;

  stripeEnabled: boolean = false;

  get status(): StatusModel {
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

  async addStatus(status: StatusModel, enforcedBy: AuthorativeEntity, miscInfo?: string) {
    const instance = new MerchantStatusInstance();
    instance.dateStatus = new Date();
    instance.enforcedBy = enforcedBy;
    instance.miscInfo = miscInfo;
    instance.status = status;

    this.latestStatus = Object.assign({},instance);
    const statusMerchant = await this.statuses.create(instance);
    //so - this enqueue might fail - but the status and etc was already written
    //that means that it should be picked up on the trigger

    await ReportingService.enqueueStatusMerchant(statusMerchant, this.id, this.connectedAccountWebhookUrl, `addStatus`);



  }
  //TODO - when setting stripe enabled - check the _enabled to see what changes
  async setEnabled(value: boolean, miscInfo?:string) {
    if(this._enabled != value && (this.status == StatusModel.Active || this.status == StatusModel.Inactive)) {
      //then the status changes
      const newStatus = value ? StatusModel.Active : StatusModel.Inactive;
      await this.addStatus(newStatus, AuthorativeEntity.DRVE,miscInfo);
    }
    this._enabled = value;
  }

  asOutput(): MerchantOutput {
    if(this.status == undefined) {
      throw new Error(`${this} had an empty status`);

    }
    return _.pick(this, merchantOutputKeys) as MerchantOutput;
  }
  public toString(): string {
    return `Merchant id: ${this.id}`;
  }

}

const hashids = new Hashids(constants.hashidsSalt);

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
    instance.gatewayURL = constants.gatewayUrl;
    instance.gatewayAccountId =
        `${hashids.encodeHex(Buffer.from(instance.id).toString('hex'))}-${uuidv4()}`;
    instance.gatewayCredentials = randomstring.generate();

    // gatewayURL: string;
    // gatewayAccountId: string;
    // gatewayCredentials: string
    //at the beginning - Stripe can't be active
    await instance.addStatus(StatusModel.Stripe_waiting, AuthorativeEntity.Stripe, "Merchant initial status");
    return instance;
  }
  static async create(testMode: boolean, init: MerchantInput): Promise<MerchantInstance> {
    const instance = await MerchantService.newInstance(testMode, init);
    return MerchantService.getRepository().update(instance);
  }
}