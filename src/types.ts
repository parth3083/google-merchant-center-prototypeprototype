// Product interface
export interface Product {
    id: string;
    title: string;
    description: string;
    link: string;
    image_link: string;
    price: string;
    availability: string;
    brand: string;
    condition: string;
    gtin?: string;
    mpn?: string;
    gender?: string;
    age_group?: string;
    color?: string;
    size?: string;
    material?: string;
    [key: string]: string | string[] | undefined;
  }
  
  // Product validation result
  export interface ValidationResult {
    isValid: boolean;
    missingFields: string[];
  }
  
  // Invalid product with missing fields information
  export interface InvalidProduct extends Product {
    missingFields: string[];
  }
  
  // CSV generation result
  export interface CsvGenerationResult {
    validProducts: Product[];
    invalidProducts: InvalidProduct[];
    validCsvPath: string;
    invalidCsvPath: string;
  }
  
  // Queue job interface
  export interface ProcessingJob {
    timestamp: Date;
    triggeredBy: string;
    productId?: string;
  }
  
  // Configuration interface
  export interface Config {
    productApiPort: number;
    csvApiPort: number;
    mainServerPort: number;
    googleMerchantSettings: {
      merchantId?: string;
      [key: string]: string | undefined;
    };
    requiredFields: string[];
  }
  
  // File details interface
  export interface FileDetails {
    name: string;
    size: number;
    created: Date;
    url: string;
  }
  
  // API response interfaces
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export interface ProductsResponse {
    count: number;
    data: Product[];
  }
  
  export interface FilesResponse {
    files: FileDetails[];
  }
  
  export interface CsvResponse {
    validProductsCount: number;
    invalidProductsCount: number;
    validCsvUrl: string;
    invalidCsvUrl: string;
    invalidProducts: InvalidProduct[];
  }
  
  export interface RequiredFieldsResponse {
    requiredFields: string[];
  }
  
  export interface StatusResponse {
    queueLength: number;
    isProcessing: boolean;
    serverTime: Date;
  }
  
  export interface WebhookResponse {
    message: string;
    queuePosition: number;
  }