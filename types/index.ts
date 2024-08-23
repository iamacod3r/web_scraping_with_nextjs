export type PriceHistoryItem = {
    price:number;
}

export type User = {
    email:string;
}

export type Image = {
    url:string;
    width:number;
    height:number;
}

export type Product = {
    _id?:string;
    title:string;
    url:string;
    currency:string;
    currentPrice:number;
    originalPrice:number;
    priceHistory:PriceHistoryItem[];
    highestPrice:number;
    lowestPrice:number;
    averagePrice:number;
    discountRate:number;
    description:string;
    category:string;
    reviewsCount:number;
    stars:number;
    isOutOfStock:boolean;
    images: Image[];
    users?: User[];
}

export type NotificationType = | "WELCOME" | "CHANGHE_OF_STOCK" | "LOWEST_PRICE" | "THRESHOLD_MET" | "NOTHING";

export type EmailContent = {
    subject:string;
    body:string;
}

export type EmailProductInfo = {
    title:string;
    url:string;
    images:any[];
}