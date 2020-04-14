import {Collection, IEntity} from "fireorm";
import {AbstractDatedEntity, AbstractDatedEntityImp} from "./AbstractDatedEntity";
// import Stripe = require("stripe");
import {getRepository} from "../conf/database";

export enum Status {
  Stripe_waiting = "Stripe_waiting", //Stripe_waiting (waiting activation from Stripe) [enabled = false]
  Active = "Active", //Active (all good and accepting payments)  [enabled = true]
  Inactive = "Inactive",//Inactive (disabled by the API)  [enabled = false]
  Stripe_inactive = "Stripe_inactive" //Stripe_inactive (disabled by Stripe [either removed on the Stripe's dashboard - or something else])  [enabled = false]

}

export interface MerchantInput extends IEntity, AbstractDatedEntity {
  drveUid: string;//doubles down with DRVE id

  shopifyDomain: string;

  // commissionPercentage: number;
  // enabled: boolean;
  // name: string;
  //
  // chargeWebhookUrl: string;
  // connectedAccountWebhookUrl: string;
  //
  // stripeOnConnectionRedirectURL: string;

  testMode: boolean;


}

export interface MerchantOutput extends MerchantInput {
  // status: Status;
  //
  // gatewayURL: string;
  // gatewayAccountId: string;
  // gatewayCredentials: string
  //
  // stripeAcctId: string;
  // stripeURLToConnectAccount: string;


}

export interface Merchant extends MerchantOutput {
  // stripeCredentials?: Stripe.oauth.IOAuthToken;
}

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

  // chargeWebhookUrl!: string;
  // commissionPercentage!: number;
  // connectedAccountWebhookUrl!: string;
  // enabled!: boolean;
  // gatewayAccountId!: string;
  // gatewayCredentials!: string;
  // gatewayURL!: string;
  // name!: string;
  // status!: Status;
  // stripeAcctId!: string;
  // stripeCredentials?: Stripe.oauth.IOAuthToken;
  // stripeOnConnectionRedirectURL!: string;
  // stripeURLToConnectAccount!: string;
  public constructor(init?: Partial<MerchantInstance>) {
    super();
    Object.assign(this, init);
  }

}


export class MerchantService {
  public static getRepository() {
    return getRepository(MerchantInstance);
  }
}