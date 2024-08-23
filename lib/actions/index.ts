"use server";

import { revalidatePath } from "next/cache";
import {
  getAveragePrice,
  getHighestPrice,
  getLowestPrice,
} from "../helper/price";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeProduct } from "../scraper/amazon";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) {
    return;
  }

  // TODO: Implement which scrapes and stores product data from the given URL
  try {
    const scrapedProduct = await scrapeProduct(productUrl);

    if (!scrapedProduct) {
      return;
    }

    connectToDB();

    let product = scrapedProduct;

    // const deletedProduct = await Product.deleteOne({ url: product.url });
    const existingProduct = await Product.findOne({ url: product.url });

    if (existingProduct) {
      product.priceHistory = existingProduct.priceHistory;

      if (existingProduct.currentPrice !== product.currentPrice) {
        product.priceHistory.push({ price: product.currentPrice });
      }

      product.lowestPrice = getLowestPrice(product.priceHistory);
      product.highestPrice = getHighestPrice(product.priceHistory);
      product.averagePrice = getAveragePrice(product.priceHistory);
    } else {
      product = {
        ...scrapedProduct,
        priceHistory: [
          {
            price: product.currentPrice,
          },
        ],
        lowestPrice: product.currentPrice,
        highestPrice: product.currentPrice,
        averagePrice: product.currentPrice,
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    console.log(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();
    console.log(`getProductById -> getting -> product`);
    const product = await Product.findOne({ _id: productId });
    console.log(`getProductById -> got -> product`);
    return product;
  } catch (error: any) {
    console.log(`Failed to get product [${productId}]: ${error.message}`);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();
    const products = await Product.find();
    return products;
  } catch (error: any) {
    console.log(`Failed to get products: ${error.message}`);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findOne({_id :productId});
    console.log(`similarProducts -> got -> currentProduct`);
    if (!currentProduct) return null;
    console.log(`similarProducts getting`);
    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(4);
    console.log(`similarProducts length : ${similarProducts.length})`);
    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await Product.findOne({_id :productId});

    if (!product) return;

    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );

    if (userExists) {
      return;
    }

    product.users.push({ email: userEmail });

    await product.save();

    const emailContent = await generateEmailBody(product, "WELCOME");

    await sendEmail(emailContent, [userEmail]);
  } catch (error) {
    console.log(error);
  }
}
