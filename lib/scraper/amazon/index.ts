import axios from "axios";
import * as cheerio from "cheerio";
import {
  extractCurrency,
  extractPrice,
} from "../../helper/amazon/extractPrice";
import { extractImages } from "../../helper/amazon/extractImages";
import { extractDescription } from "@/lib/helper/amazon/extractDescription";

import { PriceHistoryItem } from "@/types";

export async function scrapeProduct(productUrl: string) {
  if (!productUrl) {
    return;
  }

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const hostname = String(process.env.BRIGHT_DATA_HOSTNAME);
  const port = String(process.env.BRIGHT_DATA_PORT);

  const session_id = (1_000_000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: hostname,
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page

    const response = await axios.get(productUrl, options);
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $('span.a-price-whole'),
      $('a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
    );

    const currentFraction = extractPrice(
      $(".priceToPay span.a-price-fraction")
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $("a.size.base.a-color-price"),
      $("span.aok-offscreen")
    );

    const isOutOfStock =
      $("#availability span").text().trim().toLocaleLowerCase() ===
      "currently unavailable";

    const images = extractImages(
      $("#imgBlkFront").attr("data-a-dynamic-image"),
      $("#landingImage").attr("data-a-dynamic-image")
    );

    const currency = extractCurrency($("span.a-price-symbol"));

    const discountRate = $(".savingsPercentage")
      .eq(0)
      .text()
      .replace(/[-%]/g, "");

    const description = extractDescription($);
    const priceHistory: PriceHistoryItem[] = [];
    const data = {
      url: productUrl,
      title,
      category: "category",
      currency : currency || '$',
      currentPrice : Number(currentPrice) || Number(originalPrice),
      currentFraction : Number(currentFraction) || 0,
      originalPrice: Number(originalPrice) || Number(currentPrice),
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),      
      discountRate : Number(discountRate) || 0,
      priceHistory: priceHistory,
      reviewsCount: 0,
      stars: 0,
      isOutOfStock,
      images,
      description
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
