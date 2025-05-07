import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ApiResponse, Product, ProductsResponse } from "./types";
import { products } from "./demoData";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API TO GET ALL THE PRODUCTS
app.get("/api/products", (req: Request, res: Response) => {
  const response: ApiResponse<ProductsResponse> = {
    success: true,
    data: {
      count: products.length,
      data: products,
    },
  };
  res.json(response);
});

// API TO GET THE DETAILS OF THE SINGLE PRODUCT
app.get("/api/product/:id", (req: Request, res: Response) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({
      error: "Product not found",
      success: false,
    });
  }
  const response: ApiResponse<Product> = {
    success: true,
    data: product,
  };
  res.json(response);
});

// API TO CREATE THE NEW PRODUCT
app.post("/api/create", (req: Request, res: Response) => {
  const newProduct: Product = req.body;
  if (!newProduct.title && !newProduct.price) {
    res.status(404).json({
      success: false,
      error: "Please provide title and price of the product",
    });
  }
  if (!newProduct.id) {
    newProduct.id =
      "prod" +
      Math.floor(Math.random() * 100000)
        .toString()
        .padStart(6, "0");
  }
  products.push(newProduct);
  const response: ApiResponse<Product> = {
    success: true,
    data: newProduct,
  };
  res.status(201).json(response);
});

// API FOR THE DELETION OF THE PRODUCT
app.delete("/api/delete/:id", (req: Request, res: Response) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({
      success: false,
      error: "Product not found!!!",
    });
  }
  products.splice(index, 1);
  res.json({
    success: true,
    message: "Product deleted",
  });
});

const PORT = process.env.PRODUCT_API_PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Product API server running on the port http://localhost:${PORT}`
  );
});
