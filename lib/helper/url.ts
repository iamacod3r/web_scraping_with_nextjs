export function isValidUrl (url: string, host:string) {
    try{
    
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      return hostname === host;
    } catch (error) {
    }
    return false;
  };