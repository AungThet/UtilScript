// array = [ {key: value, key2: value2}, {key: value, key2: value2}]
// usage => search(array, string, string) => search(array, needle, key)
// description => search from object array by using object key
const search = (hay, needle, key) => {
  let matchList = [];
  hay.filter(item => {
    let charNeedleList = needle.toLowerCase().split("");
    let charHayList =
      key.length > 0 ? item[key].toLowerCase() : item.toLowerCase();
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

// array = [ {key: value, key2: value2}, {key: value, key2: value2}]
// usage => removeItemByKey(array, object, string) => search(array, {key: value}, key)
// description => remove object from object array using key => eg . obj.id
const removeItemByKey = (list, item, key) =>
  list.filter(element => (item[key] === element[key] ? false : element));

// array1 = [ {key: value, key2: value2}, {key: value, key2: value2}]
// array2 = [ {key: value, key2: value2}, {key: value, key2: value2}]
// usage => mergeArray(array1, array2) 
// description => merage two array and make unique items (remove duplicate item)
const mergeArray = (arr1, arr2) => {
  let mergeList = arr1.concat(arr2);
  return Array.from(new Set(mergeList));
};

export default { search, removeItemByKey, mergeArray };
