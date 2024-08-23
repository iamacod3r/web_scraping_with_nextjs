export function extractImages(...elements: any) {
    
    var images:any[] = [];

    for (const e of elements) {
        if (!e){
            continue
        }
        let rawData = JSON.parse(e);

        if (rawData){
            for (const key in rawData){
                images.push({url:key, width: rawData[key][0], height: rawData[key][1]});
            }
            return images;
        }
    }

    return images;
}