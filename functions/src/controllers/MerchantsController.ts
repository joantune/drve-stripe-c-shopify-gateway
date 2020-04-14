import {Controller, Get, Route} from "tsoa";
import {MerchantInstance, MerchantOutput, MerchantService} from "../models/Merchant";

@Route('Merchants')
export class MerchantsController extends Controller {
  @Get()
  public async getMerchants(): Promise<Array<MerchantOutput>> {
    return await MerchantService.getRepository().find();
  }

}

@Route('MerchantsCreate')
export class MerchantsCreateController extends Controller {
  @Get()
  public async createMerchants(): Promise<any> {
    const existingMerchants = await MerchantService.getRepository().find();
    let merchantsCreated = 0;
    if (existingMerchants.length == 0) {
      const repo = MerchantService.getRepository();
      console.log('adding data to MerchantPartner')
      for (let i = 0; i < 3; i++) {
        const mp = new MerchantInstance({
          drveUid: `driveUidA${i}`,
          shopifyDomain: `exampledomain-${i}.myshopify.com`,
          testMode: true
        });
        merchantsCreated++;
        await repo.create(mp);
      }
    }
    return {
      merchantsCreated: merchantsCreated
    }

  }

}

