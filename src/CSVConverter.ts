import axios from "axios";
import fs from "fs-extra";
import { createObjectCsvWriter } from "csv-writer";
import { CsvGenerationResult, Product, ValidationResult } from "./types";
import { REQUIRED_FIELDS } from "./demoData";
import path from "path";

// FUNCTION TO FETCH ALL THE PRODUCTS
async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await axios.get("http://localhost:3000/api/products");
    if (response.data && response.data.success) {
      return response.data.data.data;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (error) {
    console.error(
      "Error fetching products:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
}

// THIS IS THE FUNCTION FOR THE VALIDATION FOR THE PRODUCT
function validateProduct(product: Product): ValidationResult {
  const missingFields: string[] = [];
  for (const field of REQUIRED_FIELDS) {
    if (
      !product[field] ||
      (typeof product[field] === "string" && product[field].trim() === "")
    ) {
      missingFields.push(field);
    }
  }
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// THIS IS FUNCTION WILL GENERATE THE CSV

async function generateCSV(): Promise<CsvGenerationResult> {
  try {
    const products = await fetchProducts();
    const validproducts: Product[] = [];
    const invalidProducts: any[] = [];

    for (const product of products) {
      const validation = validateProduct(product);
      if (validation.isValid) {
        validproducts.push(product);
      } else {
        invalidProducts.push({
          ...product,
          missingFields: validation.missingFields,
        });
      }
    }

    await fs.ensureDir(path.join(__dirname, "..", "output"));
    const csvWriter = createObjectCsvWriter({
      path: path.join(__dirname, "..", "output", "valid_products.csv"),
      header: REQUIRED_FIELDS.map((field) => ({ id: field, title: field })),
    });

    await csvWriter.writeRecords(validproducts);
    const invalidCsvWriter = createObjectCsvWriter({
      path: path.join(__dirname, "..", "output", "invalid_products.csv"),
      header: [...REQUIRED_FIELDS, "missingFields"].map((field) => ({
        id: field,
        title: field,
      })),
    });

    await invalidCsvWriter.writeRecords(invalidProducts);
    return {
      validProducts: validproducts,
      invalidProducts,
      validCsvPath: path.join(__dirname, "..", "output", "valid_products.csv"),
      invalidCsvPath: path.join(
        __dirname,
        "..",
        "output",
        "invalid_products.csv"
      ),
    };
  } catch (error) {
    console.error(
      "Error generating CSV:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
}
if (require.main === module) {
  generateCSV()
    .then((result) => {
      console.log(
        `Generated CSV with ${result.validProducts.length} valid products`
      );
      console.log(`Found ${result.invalidProducts.length} invalid products`);
    })
    .catch((err) => {
      console.error("CSV generation failed:", err);
    });
}

export { generateCSV, validateProduct };
