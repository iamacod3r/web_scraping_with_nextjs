import { Product } from "@/types";
import { getLowestPrice } from "./price";
import Notifications from "../constraints/notifications";

const THRESHOLD_PERCENTAGE = 40;

export function getEmailNotificationType(
  scrapedProduct: Product,
  currentProduct: Product
) {
  const lowerPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowerPrice) {
    return Notifications.LOWEST_PRICE as keyof typeof Notifications;
  }

  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notifications.CHANGHE_OF_STOCK as keyof typeof Notifications;
  }

  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notifications.THRESHOLD_MET as keyof typeof Notifications;
  }

  return Notifications.NOTHING as keyof typeof Notifications;
}
