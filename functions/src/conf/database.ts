// Inits and exports the database
import * as fbadmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fireorm from 'fireorm';
// import {MerchantInstance} from "../models/Merchant";

// console.log('Trying to init DB');
const firestore = fbadmin.initializeApp(functions.config().firebase).firestore();
fireorm.initialize(firestore);
export const db = firestore;


// console.log('DB inited');

export const getRepository = fireorm.getRepository;

//let's init the database and add MerchantPartners
console.log('Initing MerchantPartner')

// getRepository(MerchantInstance).find().then(async (result) => {
//   if (result.length == 0) {
//     const repo = getRepository(MerchantInstance);
//     console.log('adding data to MerchantPartner')
//     for (let i = 0; i < 3; i++) {
//       const mp = new MerchantInstance({
//         drveUid: `driveUidA${i}`,
//         shopifyDomain: `exampledomain-${i}.myshopify.com`,
//         testMode: true
//       });
//       await repo.create(mp);
//     }
//   }
// });

