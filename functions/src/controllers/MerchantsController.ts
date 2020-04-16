// import {Controller, Get, Request, Route, Security} from "tsoa";
// import {  MerchantOutput, MerchantService} from "../models/Merchant";
import {Body, Controller, Get, Post, Request, Route, Security} from "tsoa";
import {MerchantInput, MerchantOutput, MerchantOutputInstance, MerchantService} from "../models/Merchant";
import {authResult} from "../auth/authentication";
import * as _ from "lodash";
import {ErrorHttp} from "../exceptions/ErrorHttp";

@Security('api_key')
@Route('merchants')
export class MerchantsController extends Controller {
  @Get()
  public async getMerchants(@Request() req:any): Promise<Array<Partial<MerchantOutputInstance>>> {
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
          chargeWebhookUrl: `https://phonyurl.com`,
          connectedAccountWebhookUrl: `https://phonyurl.com/something`,
          stripeOnConnectionRedirectURL: 'https://drve.com/connected'


        });
        merchantsCreated++;
      }
    }
    return {
      merchantsCreated: merchantsCreated
    }

  }

}

