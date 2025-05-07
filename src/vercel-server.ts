import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { generateCSV } from "./CSVConverter";
import config from './config';
import { ProcessingJob, ApiResponse, StatusResponse, WebhookResponse } from './types';


let processingQueue: ProcessingJob[] = [];
let isProcessing: boolean = false;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from output directory
app.use('/output', express.static(path.join(__dirname, '..', 'output')));


app.use((req: Request, res: Response, next: NextFunction) => {
  
  if (req.path.startsWith('/api/products')) {
    
    console.log('Product API request:', req.method, req.path);
  } else if (req.path.startsWith('/api/generate-csv') || req.path.startsWith('/api/files')) {
    
    console.log('CSV API request:', req.method, req.path);
  }
  next();
});


interface WebhookRequestBody {
  triggeredBy?: string;
  productId?: string;
}


app.post('/api/webhook/product-added', (req: Request<{}, {}, WebhookRequestBody>, res: Response) => {
 
  processingQueue.push({
    timestamp: new Date(),
    triggeredBy: req.body.triggeredBy || 'webhook',
    productId: req.body.productId
  });
  
  // Start processing if not already in progress
  if (!isProcessing) {
    processQueue();
  }
  
  const response: ApiResponse<WebhookResponse> = {
    success: true,
    data: {
      message: 'Added to processing queue',
      queuePosition: processingQueue.length
    }
  };
  
  res.json(response);
});

// Process the queue
async function processQueue(): Promise<void> {
  if (processingQueue.length === 0) {
    isProcessing = false;
    return;
  }
  
  isProcessing = true;
  const job = processingQueue.shift()!;
  
  console.log(`Processing job triggered by ${job.triggeredBy} at ${job.timestamp}`);
  
  try {
    const result = await generateCSV();
    console.log(`Processed CSV with ${result.validProducts.length} valid products and ${result.invalidProducts.length} invalid products`);
    
   
    console.log('Ready to upload valid_products.csv to Google Merchant Center');
    
    // Process next job in queue
    processQueue();
  } catch (error) {
    console.error('Error processing queue job:', error);
    isProcessing = false;
  }
}

// Status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  const response: ApiResponse<StatusResponse> = {
    success: true,
    data: {
      queueLength: processingQueue.length,
      isProcessing,
      serverTime: new Date()
    }
  };
  res.json(response);
});

const PORT = config.mainServerPort;
app.listen(PORT, () => {
  console.log(`Main server running on port ${PORT}`);
  console.log(`Access the webhook at http://localhost:${PORT}/api/webhook/product-added`);
  console.log(`Check status at http://localhost:${PORT}/api/status`);
});