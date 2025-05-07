import dotenv from 'dotenv';
import { Config } from './types';

dotenv.config();
const config: Config = {
    productApiPort: parseInt(process.env.PRODUCT_API_PORT || '3000', 10),
    csvApiPort: parseInt(process.env.CSV_API_PORT || '3001', 10),
    mainServerPort: parseInt(process.env.SERVER_PORT || '4000', 10),
    googleMerchantSettings: {
      merchantId: process.env.MERCHANT_ID,
     
    },
    requiredFields: [
      'id', 'title', 'description', 'link', 'image_link', 
      'price', 'availability', 'brand', 'condition'
    ],
    
  };
  
  export default config;