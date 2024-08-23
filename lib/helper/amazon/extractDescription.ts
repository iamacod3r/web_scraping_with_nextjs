export function extractDescription($: any) {
    // these are possible elements holding description of the product
    const selectors = [
      ".a-unordered-list .a-list-item",
      ".a-expander-content p",
      // Add more selectors here if needed
    ];
  
    for (const selector of selectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        const textContext = elements
          .map((_: any, e: any) => $(e).text().trim())
          .get()
          .join("\n");
        return textContext;
      }
    }
  
    // If no matching elements were found, return an empty string
    return "";
  }