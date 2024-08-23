import Notifications from "@/lib/constraints/notifications";
import { getEmailNotificationType } from "@/lib/helper/notification";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/lib/helper/price";
import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeProduct } from "@/lib/scraper/amazon";
import { EmailProductInfo, User } from "@/types";
import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(){
    try{
        connectToDB();
        const prodcuts = await Product.find({});
        
        if (!prodcuts){
            throw new Error("No products found");
        }

        // 1. SCRAPE LATEST PRODUCT DETAILS & UPDATE IN DB
        const updatedProducts = await Promise.all(prodcuts.map(async (product) => {
            const scrapedProduct = await scrapeProduct(product.url);
            if (!scrapedProduct){
                console.log(`product not found : ${product.url}`);
                return;
            }
            
            const emailNotifyType = getEmailNotificationType(scrapedProduct, product);

            if (scrapedProduct.currentPrice !== product.currentPrice){
                product.priceHistory.push({ price: scrapedProduct.currentPrice });
                product.currentPrice = scrapedProduct.currentPrice;
                product.lowestPrice = getLowestPrice(product.priceHistory);
                product.highestPrice = getHighestPrice(product.priceHistory);
                product.averagePrice = getAveragePrice(product.priceHistory);
            }

            const updatedProduct = await Product.findOneAndUpdate({url:product.url}, product);


            // 2. CHECK EACH PRODUCT's STATUS & SEND EMAIL ACCORDINGLY
            if (emailNotifyType !== Notifications.NOTHING && product.users.length > 0){
                const productInfo : EmailProductInfo = {
                    title : product.title,
                    url : product.url,
                    images : product.images,
                };

                const emailBody = await generateEmailBody(productInfo, emailNotifyType);
                const userEmails = product.users.map((user:User) => user.email);

                await sendEmail(emailBody, userEmails);
            }

            return updatedProduct;
        }));

        return NextResponse.json({message:'Ok', updatedProducts});

    }catch(e){
        throw new Error(`Error in0GET: ${e}`);
    }
}