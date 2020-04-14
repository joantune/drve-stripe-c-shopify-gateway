import {IEntity} from "fireorm";
import {AbstractDatedEntity} from "./AbstractDatedEntity";

export interface MerchantInput extends IEntity, AbstractDatedEntity {
  drveUid: string;//doubles down with DRVE id
  shopifyDomain: string;
  commissionPercentage: number;
  enabled: boolean;
  name: string;

  chargeWebhookUrl: string;
  connectedAccountWebhookUrl: string;

  stripeOnConnectionRedirectURL: string;


}

export interface Merchant extends MerchantInput {
  status: Enu

  gatewayURL: string;
  gatewayAccountId: string;
  gatewayCredentials: string

  stripeAcctId: string;
  stripeURLToConnectAccount: string;

}