import express, { Request, response, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { generateCSV } from "./CSVConverter";
import path from "path";
import fs from "fs-extra";
import {
  ApiResponse,
  CsvResponse,
  FileDetails,
  FilesResponse,
  RequiredFieldsResponse,
} from "./types";
import { REQUIRED_FIELDS } from "./demoData";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CREATING THE OUTPUT DIRECTORY FOR THE STATIC FILES
app.use("/output", express.static(path.join(__dirname, "..", "output")));

// API TO GENERRAET THE CSV FILE
app.get("/api/genarate-csv", async (req: Request, res: Response) => {
  try {
    const result = await generateCSV();
    const response: ApiResponse<CsvResponse> = {
      success: true,
      data: {
        validProductsCount: result.validProducts.length,
        invalidProductsCount: result.invalidProducts.length,
        validCsvUrl: `/output/valid_products.csv`,
        invalidCsvUrl: `/output/invalid_products.csv`,
        invalidProducts: result.invalidProducts,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Error in /api/generate-csv:", error);
    res.status(500).json({
      success: false,
      error: `Failed to generate CSV: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
  }
});

// API TO GET THE LIST OF THE REQUIRED FIELDS
app.get("/api/required-fields", (req: Request, res: Response) => {
  const response: ApiResponse<RequiredFieldsResponse> = {
    success: true,
    data: {
      requiredFields: REQUIRED_FIELDS,
    },
  };
  res.json(response);
});

// API TO GET THE GENERATED FILES LIST
app.get("/api/files", async (req: Request, res: Response) => {
  try {
    const files = await fs.readdir(path.join(__dirname, "..", "output"));
    const fileDetails: FileDetails[] = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(path.join(__dirname, "..", "output", file));
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          url: `/output/${file}`,
        };
      })
    );

    const response: ApiResponse<FilesResponse> = {
      success: true,
      data: {
        files: fileDetails,
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to list files: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
  }
});
const PORT = process.env.CSV_API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`CSV API server running on port ${PORT}`);
});
