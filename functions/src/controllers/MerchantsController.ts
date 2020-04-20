// import {Controller, Get, Request, Route, Security} from "tsoa";
// import {  MerchantOutput, MerchantService} from "../models/Merchant";
import {Body, Controller, Get, Post, Put, Request, Route, Security} from "tsoa";
import {
  AuthorativeEntity,
  MerchantInput,
  MerchantOutput,
  MerchantService,
  StatusModel
} from "../models/Merchant";
import {authResult} from "../auth/authentication";
import {ErrorHttp} from "../exceptions/ErrorHttp";
import {logger} from "../utils/logger";
import _ = require("lodash");

@Security('api_key')
@Route('merchants')
export class MerchantsController extends Controller {
  @Get()
  public async getMerchants(@Request() req:any): Promise<Array<MerchantOutput>> {
    const authResultUser: authResult = req.user;
    const result = await MerchantService.getRepository().whereEqualTo(m => m.testMode, authResultUser.testMode).find();
    return result.map(merchant => merchant.asOutput());
    // const toReturn = [];
    // result.forEach()
  }

  @Get('{drveUid}')
  public async getMerchant(@Request() req: any, drveUid: string): Promise<Partial<MerchantOutput>> {
    const authResultUser: authResult = req.user;
    const foundMerchant = await MerchantService.getRepository().findById(drveUid);
    if(foundMerchant == undefined || foundMerchant.testMode != authResultUser.testMode) {
      throw new ErrorHttp(`Merchant not found id: ${drveUid} - testMode: ${authResultUser.testMode}`, 404)
    }
    return foundMerchant.asOutput();
  }
  @Post()
  public async createMerchant(@Body() merchantInput: MerchantInput,
                              @Request() req: any): Promise<MerchantOutput>{
    const authResultUser: authResult = req.user;

    const created = await MerchantService.create(authResultUser.testMode, merchantInput);

    return created as MerchantOutput;

  }

  @Put('{drveUid}')
  public async editMerchant(@Body() merchantInput: MerchantInput,
                              drveUid: string,
                              @Request() req: any): Promise<MerchantOutput>{
    const repo = MerchantService.getRepository();
    const merchant = await repo.findById(drveUid);
    Object.assign(merchant, _.omit(merchantInput, 'drveUid', 'enabled'))
    merchant.setEnabled(merchantInput.enabled);
    merchant.updatedAt = new Date();

    return await repo.update(merchant);

  }

}

@Route('merchantsCreate')
export class MerchantsCreateController extends Controller {
  @Get()
  public async createMerchants(): Promise<any> {
    const existingMerchants = await MerchantService.getRepository().find();
    let merchantsCreated = 0;
    if (existingMerchants.length == 0) {
      console.log('adding data to MerchantPartner')
        for (let i = 0; i < 4; i++) {
         await MerchantService.create(i != 3,{
          drveUid: `driveUidA${i}`,
          shopifyDomain: `exampledomain-${i}.myshopify.com`,
          commissionPercentage: i*2.5,
          enabled: true,
          name: `Namesmthng${i}`,
          chargeWebhookUrl: `https://webhook.site/faeb6269-7ce3-4c35-8803-b831d2f02487`,
          connectedAccountWebhookUrl: `https://webhook.site/faeb6269-7ce3-4c35-8803-b831d2f02487`,
          stripeOnConnectionRedirectURL: 'https://drve.com/connected'


        });
        merchantsCreated++;
      }
    }
    return {
      merchantsCreated: merchantsCreated
    }

  }

  @Get('nestedTest')
  public async createNestedExample(): Promise<any> {
    //let's do this on driveUidA0
    const LOG = logger('merchantsCreate/nestedTest');
    try {

    const merchant = await MerchantService.getRepository().findById('driveUidA0');
    let nrStatusesCreated = 0;
    for(; nrStatusesCreated< 200; nrStatusesCreated++) {
      await merchant.addStatus(StatusModel.Inactive, AuthorativeEntity.DRVE, `baloney status nr ${nrStatusesCreated}`);
    }

    return {
      statusCreated: nrStatusesCreated
    };
    }catch(err) {
      LOG.error(err);
    }

  }

}

