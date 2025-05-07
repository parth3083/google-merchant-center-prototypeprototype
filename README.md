# Google Merchant Prototype

## Purpose
This project provides a prototype system for processing product data and preparing it for submission to Google Merchant Center. It validates product data against required fields, generates CSV files that adhere to Google Merchant Center specifications, and manages the validation and submission workflow.

## Project Overview
The Google Merchant Prototype is a TypeScript-based application designed to streamline the process of preparing and validating product data for Google Merchant Center. It consists of multiple microservices that handle different aspects of the product data pipeline:

1. **Product API** - Manages product data CRUD operations
2. **CSV API** - Handles CSV generation and validation
3. **Main Server** - Coordinates processing workflows and webhooks

The system separates valid and invalid products, helping merchants identify and fix data issues before submitting to Google Merchant Center.

## Architecture

The application is structured around three main servers:

- **Product API** (Port 3000): Manages product data
- **CSV API** (Port 3001): Handles CSV generation and file management
- **Main Server** (Port 4000): Processes webhooks and manages the validation queue


## Source Files

### types.ts
Contains all TypeScript interfaces used throughout the application including:
- `Product`: Defines the structure of product data
- `ValidationResult`: Represents product validation results
- `CsvGenerationResult`: Output of CSV generation process
- `ProcessingJob`: Queue jobs for processing data
- Various API response interfaces

### config.ts
Manages application configuration using environment variables. Includes settings for:
- API port numbers
- Google Merchant Center credentials
- Required product fields

### demoData.ts
Contains sample product data and defines required fields for Google Merchant Center:
- Sample product entries with various attributes
- `REQUIRED_FIELDS` array defining mandatory fields for valid products

### productAPI.ts
Implements a REST API for product management running on port 3000:
- GET `/api/products`: Retrieve all products
- GET `/api/product/:id`: Get a single product
- POST `/api/create`: Create a new product
- DELETE `/api/delete/:id`: Delete a product

### csvAPI.ts
Implements a REST API for CSV file operations running on port 3001:
- GET `/api/generate-csv`: Generate CSV files for valid and invalid products
- GET `/api/required-fields`: List required product fields
- GET `/api/files`: List generated files

### CSVConverter.ts
Contains the core logic for:
- Fetching products from the Product API
- Validating products against required fields
- Generating CSV files for both valid and invalid products
- Can be run standalone or as part of the API

### vercel-server.ts
Implements the main server running on port 4000:
- POST `/api/webhook/product-added`: Webhook for triggering CSV generation on product updates
- GET `/api/status`: Check status of processing queue
- Manages a processing queue for handling webhook events
- Serves static files from the output directory

## Environment Variables

The application requires the following environment variables:

```
# Server ports
PRODUCT_API_PORT=3000    # Port for the Product API
CSV_API_PORT=3001        # Port for the CSV API
SERVER_PORT=4000         # Port for the main webhook server

# Google Merchant API credentials
MERCHANT_ID=your_merchant_id_here  # Your Google Merchant ID

# CSV file settings
OUTPUT_DIR=output        # Directory for CSV output

# Node environment
NODE_ENV=development     # Application environment
```

## API Endpoints Summary

### Product API (Port 3000)
- GET `/api/products`: Get all products
- GET `/api/product/:id`: Get a specific product
- POST `/api/create`: Create a new product
- DELETE `/api/delete/:id`: Delete a product

### CSV API (Port 3001)
- GET `/api/generate-csv`: Generate CSV files
- GET `/api/required-fields`: Get required field definitions
- GET `/api/files`: List generated CSV files
- GET `/output/*`: Access generated CSV files

### Main Server (Port 4000)
- POST `/api/webhook/product-added`: Webhook for product updates
- GET `/api/status`: Get processing queue status
- GET `/output/*`: Access generated CSV files

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Build the TypeScript code:
   ```
   npm run build
   ```

3. Start the servers:
   ```
   npm run start-product-api
   npm run start-csv-api
   npm start
   ```

4. Generate a CSV file:
   ```
   npm run generate-csv
   ```