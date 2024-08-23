// Extracts and returns the price from a list of possible elements
export function extractPrice(...elements: any) {
  for (const e of elements) {
    const priceText = e.eq(0).text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, "");
      let firstPrice;
      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return "0";

  // for(const e of elements){

  //     let price = e.eq(0).text().trim();
  //     if (price && price.length > 0){
  //         return price.replace(/[^\d.]/g, '');
  //     }
  // }

  // return '0';
}

// Extracts and returns the currency symbol from an element
export function extractCurrency(element: any) {
  const currencyText = element.eq(0).text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}
