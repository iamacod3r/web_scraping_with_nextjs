export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0 });
}