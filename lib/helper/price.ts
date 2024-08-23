import { PriceHistoryItem } from "@/types";

export function getHighestPrice(priceHistory: PriceHistoryItem[]) {
  return Math.max(...priceHistory.map((p) => p.price));
}

export function getLowestPrice(priceHistory: PriceHistoryItem[]) {
  return Math.min(...priceHistory.map((p) => p.price));
}

export function getAveragePrice(priceHistory: PriceHistoryItem[]) {
  const total = priceHistory.reduce((acc, p) => acc + p.price, 0);
  return total / priceHistory.length || 0;
}
