module.exports = {
    toTimestamp: (strDate: any) => {
        let datum = Date.parse(strDate);
        return datum / 1000;
    }
}