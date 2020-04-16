// import {Controller, Get, Request, Route, Security} from "tsoa";
// import {  MerchantOutput, MerchantService} from "../models/Merchant";
import {Body, Controller, Get, Post, Request, Route, Security} from "tsoa";
import {MerchantInput, MerchantOutput, MerchantService} from "../models/Merchant";
import {authResult} from "../auth/authentication";

@Security('api_key')
@Route('merchants')
export class MerchantsController extends Controller {
  @Get()
  public async getMerchants(): Promise<Array<MerchantOutput>> {
    return await MerchantService.getRepository().find();
  }

  @Get('{drveUid}')
  public async getMerchant(drveUid: string): Promise<MerchantOutput> {
    return await MerchantService.getRepository().findById(drveUid);
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
      for (let i = 0; i < 3; i++) {
         await MerchantService.create(true,{
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

