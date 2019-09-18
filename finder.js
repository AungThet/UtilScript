// array = [ {key: value, key2: value2}, {key: value, key2: value2}]
// usage => search(array, string, string) => search(array, needle, key)
const search = (hay, needle, key) => {
    let matchList = [];
    hay.filter(item => {
        let charNeedleList = needle.toLowerCase().split('');
        let charHayList = key.length > 0 ? item[key].toLowerCase() : item.toLowerCase();
        charNeedleList.forEach((charN, i) => {
            let ini = charHayList.indexOf(charN);
            if (ini > -1) {
                if (i === charNeedleList.length - 1) {
                    matchList.push(item);
                }
                charHayList = charHayList.slice(ini + 1);
            }
        });
    });

    return matchList;
};


export default { search };