import { router } from "../plugins/vue-router";
import store from "../store";
import ConstantKeys from "../config/constants";
import { except_route } from "../config/route";
import rank from "../config/rank";

const cloneJson = json => {
    return JSON.parse(JSON.stringify(json));
};

const isJson = str => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
};

const splitMultiple = (str, arr) => {
    if(!str || arr.length == 0){
        console.warn('splitMultiple invalid string ', str, arr);
        return str;
    }

    if(arr.length > 1){
        return splitMultiple(str.split(arr.shift()).join(','), arr);
    }

    return (str.split(arr.shift())).filter(item => item).join(',').split(',');
};

const getServiceFeeName = services_name => {
    // get service fee name by service name
    let services_fee_name = ConstantKeys.enum_services_matcher[services_name];
    return services_fee_name;
};

const getServiceName = service_fee_name => {
    let keys = Object.keys(ConstantKeys.enum_services_matcher);
    let result = "";
    var BreakException = {};

    try {
        keys.forEach(service_name => {
            if (
                ConstantKeys.enum_services_matcher[service_name] ===
                service_fee_name
            ) {
                result = service_name;
                throw BreakException;
            }
        });
    } catch (e) {
        console.warn(e);
    }

    return result;
};

const parseJson = json => {
    if (isJson(json)) {
        return JSON.parse(json);
    }
    console.warn("parseJSON => json is invalid ", json);
    return json;
};

const castToString = val => {
    return val+"";
};

// list, keyToSearch, pointOfObjectKey
const search = (hay, needle, key, strict) => {

    if (!Array.isArray(hay) || !needle || !key) {
        return null;
    }
    //split key word as letter array
    let charNeedleList = castToString(needle).split('');

    // loop array to take out individual object
    hay = hay.filter(item => {
        // take out value from object by using pointOfObjectKey

        let valueGotByNestedKey = getNestedValue(key, item);

        if (!valueGotByNestedKey) {
            return null;
        }

        let currentWord = castToString(valueGotByNestedKey).toLowerCase().split('');

        let status = false;
        for (var i = 0; i < charNeedleList.length; i++) {
            let charN = charNeedleList[i];
            let ini = currentWord.indexOf(charN);

            if (ini > -1) {
                if (i === charNeedleList.length - 1) {
                    if(strict){
                        status = castToString(valueGotByNestedKey).length === castToString(needle).length;
                    }
                    else{
                        status = true;
                    }
                }
                currentWord = currentWord.slice(ini + 1);
            } else {
                break;
            }
        }
        console.log(status);
        return status;
    });

    return hay;
};

//get date
const gd = (year, month, day) => {
    return new Date(year, month - 1, day).getTime();
};

const avatarImg = img => {
    $(img)
        .on("load", function() {
        })
        .on("error", function() {
            console.log("error loading image", img.src);
            // get avatar class to from attr of img tag
            let avatarClass = $(this).attr("avatar_class");
            if (!avatarClass) {
                //if not default avatar class
                avatarClass = "file_image fas";
            }
            $(img)
                .siblings(".avatar")
                .remove(); // clear previous avatar
            $(this).hide(); // hide img tag
            $(this).before(
                $(`<div class="avatar ${avatarClass} rounded-circle"></div>`)
            ); // add avatar div before img
        });
};

const loadImg = e => {
    let input = e.target;
    let img = $(e.target).siblings("img")[0];

    if (!img) {
        img = $(e.target)
            .parent("div")
            .siblings("img")[0];
    }

    if (!img) {
        console.warn("Not Found img tag");
    }

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            img.setAttribute("src", e.target.result);
            img.style.cssText = "width:100%;height:100%";
            $(img)
                .siblings(".avatar")
                .remove();
        };
        reader.readAsDataURL(input.files[0]);

        return input.files[0];
    }
};

const castBool = data => {
    if (typeof data === "string") {
        return data === "true";
    }
    return !!data;
};

const objToArray = obj => {
    if (obj && typeof obj == "object") {
        let arr = [];
        Object.keys(obj).map(key => {
            if (typeof obj[key] == "object") {
                arr.push({ [key]: obj[key] });
            } else {
                arr.push({ [key]: obj[key] });
            }
        });
        return arr;
    }
    return obj;
};

const isFunction = functionToCheck => {
    return (
        functionToCheck &&
        {}.toString.call(functionToCheck) === "[object Function]"
    );
};

const getTownShipById = (list, township_id) => {
    if (isNaN(township_id)) {
        console.warn(township_id, "is not a valid number");
        return;
    }

    return findById(list, Number(township_id));
};
const getResponseError = error => {
    let errors = error.response.data.errors;
    let key = Object.keys(errors)[0];

    return {
        errors: errors,
        firstError: {
            key: key,
            message: errors[key][0]
        }
    };
};

const getValidateError = (validateStatus, field) => {
    let validationObj = {
        message:
            validateStatus && validateStatus[field]
                ? validateStatus[field][0]
                : "",
        status: validateStatus ? !!validateStatus[field] : false
    };

    return validationObj;
};

// list = ["name" : { "en": "Hello", "mm" : "ဟယ်လို"}], keys = "name.en"
const getNestedValue = (keys, list) => {
    keys = keys.split(".");
    let key = keys.shift();
    if (keys.length > 0) {
        return getNestedValue(keys.join("."), list[key]);
    } else {
        return list[key];
    }
};

const prepareForRevalidate = (oldValidationStatus, form) => {
    let buff = {};
    Object.keys(oldValidationStatus).forEach(key => {
        Object.assign(buff, { [key]: form[key] });
    });
    return buff;
};

const toDate = dateStr => {
    let dateList = dateStr.split("/");
    return new Date(dateList[2], dateList[1] - 1, dateList[0]);
};

const shortText = (str, length = 30) => `${str.substr(0, length)}...`;

const toTitle = str => {
    let arr = str.split("_");
    arr = arr.map(item => {
        return item.charAt(0).toUpperCase() + item.slice(1);
    });
    return arr.join(" ");
};

const findByKeyword = (list, key, value) => {
    if (!key || !value) {
        return null;
    }

    if (typeof list != "array" && typeof list != "object") {
        return null;
    }

    if (typeof list === "object") {
        const val = Object.values(list);
        if (typeof val == "undefined") return null;
        const result = val.find(
            item => value.toString() === getNestedValue(key, item).toString()
        );
        return result;
    }

    return list.find(
        item => getNestedValue(key, item).toString() === value.toString()
    );
};

const findById = (list, id) => findByKeyword(list, "id", parseInt(id, 10));

const sortedByDate = (list, key) => {
    let sortedList = $(list).sort((a, b) => {
        return moment(a[key]).isBefore(b[key]) ? -1 : 1;
    });

    return sortedList;
};

const sortedByKey = (list, key) => {
    let sortedList = $(list).sort((a, b) => {
        return getNestedValue(key, a) > getNestedValue(key, b) ? 1 : -1;
    });

    return $.makeArray(sortedList);
};

// to check given text is html code or not
const isHTML = str => {
    var doc = new DOMParser().parseFromString(str, "text/html");
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
};

const getTextFromHtml = html => {
    var temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
};

const toString = data => {
    if (typeof data == "string") {
        return data;
    }
    return data.toString();
};

// to get text from html code or plain text
const getText = str => (isHTML(str) ? $(str).text() : str);

// to get text with length 70 from html code or text
const getFormattedMessage = data => {
    let text = getText(data);
    return shortText(text, 70);
};

// to get model name from 'Ds\Core\Models\Merchant'
const getModelClass = str => str.split("\\")[3];

// remove item from array by matching given item's id
const removeItem = (list, item, callback) => {
    if (!callback) {
        return list.filter(element =>
            item.id === element.id ? false : element
        );
    } else {
        return list.filter(element => callback(element));
    }
};

// for currency format like 100000 => 100,000 | 10000000 => 10,000,000
const currencyFormat = value => {
    if(!value){
        console.warn('currencyFormat => invalid value ', value);
        return "0";
    }
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 , ");
};

const getNormalPriceFormat = value => value.toString().replace(",", "");

const mergeArray = (arr1, arr2, key) => {
    let mergeList = arr1.concat(arr2);
    if(typeof mergeList[0] === 'object'){
        return uniqueObjectArray(mergeList, key);
    }
    return uniqueArray(mergeList);
};

const uniqueArray = array => Array.from(new Set(array));

const uniqueObjectArray = (list, key) => {
    return list.filter(
        (value, index, self) =>
            self.map(o => o[key]).indexOf(value[key]) === index
    );
};

const localeIndex = (num, messageList) => {
    let numArr = String(num).split("");
    numArr = numArr.map(i => messageList[i]);
    return numArr.join("");
};

const localeNumbering = (num, messageList) => {
    let currencyNumber = currencyFormat(num);
    return localeIndex(currencyNumber, messageList);
};

const getPhoneTag = data => {
    if (!data) {
        return [];
    }

    if (typeof data === "string") {
        data = JSON.parse(data);
    }

    return data.map(item => ({ key: "", value: item.trim() }));
};

const joinArray = arr => {
    if (!arr && typeof arr != "array") {
        console.warn("can't join array");
        return arr;
    }
    if (typeof arr == "string") {
        try {
            arr = JSON.parse(arr);
        } catch (e) {
            console.warn("can't parse json string to array");
        }
    }
    return arr.join(", ");
};

// getPhoneString([{key: "", value: "098765432"}, {key: "",value: "0949388733"}])
// @return "09876554432, 098776636673"
const getPhoneString = data => {
    if (!Array.isArray(data) || (Array.isArray(data) && data.length == 0)) {
        if (isJson(data)) {
            data = JSON.parse(data);
        } else {
            return undefined;
        }
    }

    if (data[0].value) {
        return data.map(item => item.value).join(" , ");
    } else {
        return data.join(",");
    }
};

const flashErrorMessage = (error, messageList) => {
    console.error(error);
    if (error.response) {
        let errors = error.response.data.errors;
        if (errors) {
            let key = Object.keys(errors)[0];
            window.toastr.error(errors[key][0]);
        } else {
            errors = error.response.data.message;
            window.toastr.error(errors);
        }
    } else {
        if(error && Array.isArray(error)){
            let errorKey = Object.keys(error);
    
            window.toastr.error(`${messageList[errorKey]} ${messageList[error[errorKey]]}`);
        } else {
            console.log('Me', error);
        }
    }
};

const transformToList = (data, callback) => {
    let list = {
        data: [],
        type: "lang",
        badge: false,
        bkey: "key",
        bvalue: "value"
    };
    Object.keys(data).map(item => {
        if (undefined != data[item]) {
            if (typeof data[item] == "object") {
                let nestedList = transformToList(data[item]);
                list.data = helper.mergeArray(list.data, nestedList.data);
            } else {
                if (callback) {
                    list.data.push(callback(data, item));
                } else {
                    list.data.push({
                        key: item,
                        value: data[item],
                        cssClass: "bgc-white"
                    });
                }
            }
        }
    });
    return list;
};

const transformToListTable = (data, callback) => {
    let list = {
        keys: ["key", "value"],
        header: {
            data: [],
            type: "lang",
            attr: []
        },
        body: {
            data: [],
            attr: {
                key: {
                    class: "fw-600"
                }
            },
            components: {}
        }
    };
    if (data) {
        Object.keys(data).map(item => {
            if (undefined != data[item]) {
                if (typeof data[item] == "object") {
                    let nestedList = transformToList(data[item]);
                    list.body.data = helper.mergeArray(
                        list.body.data,
                        nestedList.data
                    );
                } else {
                    if (callback) {
                        list.body.data.push(callback(data, item));
                    } else {
                        list.body.data.push({
                            key: item,
                            value: data[item]
                        });
                    }
                }
            }
        });
    }

    return list;
};

// to hide route for current user even though has permission for that route
const isExceptRoute = routeName => {
    if (!routeName) {
        console.warn("util.isExceptRoute => route name is invalid ", routeName);
        return false;
    }
    let user = store.state.auth.user;
    if (!user) {
        console.warn(
            "util.isExceptRoute => no active current user at store ",
            user
            );
            return false;
    }
    
    return except_route[user.role.slug] ? except_route[user.role.slug].includes(routeName.toLowerCase()) : false;
};

const isLowerSpecificRank = routeName => {
    if(!routeName) {
        console.warn('util.isLowerSpecificRank => route nams is undefined ', routeName);
        return false;
    }
    
    let user = store.state.auth.user;
    
    if (!user) {
        console.warn(
            "util.isExceptRoute => no active current user at store ",
            user
            );
            return false;
        }
        

    if(rank.highest_role_under_post_officer[routeName]){
        return user.role.id < rank.highest_role_under_post_officer[routeName];
    }

    return false;

};

const isUpperRank = role => {
    return store.state.auth.user.role.id < role.id;
};

const permissionCheckOverRouteList = current_route_list => {
    //return true;
   

    let result = false; //preset

    try {
        // loop route name list given by params
        current_route_list.forEach(route => {
            let routeName, permit;

            if(Array.isArray(route)){
                routeName = route[0];
                permit = route[1];
            }
            else{
                routeName = route;
            }

            if (isExceptRoute(routeName)) { // if except route denied
                return false;
            }
            
            if(isLowerSpecificRank(routeName)){
                return false;
            }

            result |= checkPermissionForRoute(routeName, permit); // allow access if permission is not set

            if (result) {
                throw BreakException;
            }
        });
    } catch (e) {}

    return result;
};

const isSuperAdmin = role => {
    return role.slug === rank.list.staff_deletable_rank;
};

const isLuxaryRank = user => {
    return !user.branch;
};

const hasPermissionOverList = permissionList => {
    let flag = true;

    permissionList.map(permission => {
        flag = flag & hasPermission(permission);
    });

    return flag;
};

const hasPermission = (permission) => {

    let user = store.state.auth.user;

    let current_user_permissions = user.role
        ? user.role.permissions
            ? user.role.permissions
            : []
        : [];

    return current_user_permissions.indexOf(permission) != -1;
};

const checkPermissionForRoute = (route, permit) => {
    let current_route_obj;

    if(typeof route === 'string'){ // route name
        current_route_obj = getRouteByName(route);
    }
    
    if(!current_route_obj){
        console.warn('no found route for ', route, permit);
        return false;
    }

    let permission = current_route_obj.meta.permissions;

    if(typeof permission === 'object'){ // page has with many tab
        if(permit){
            permission = permission[permit];
        }
        else{ // if no permit is set 
            let permissions = Object.values(permission);
            let BreakException = {};
            let result = false;
            try{
                 result = permissions.map(permission => {
                    if (permission) {
                        if(hasPermission(permission)){
                            throw BreakException;
                        }
                    }
                });
            }catch(e){
                result = true;
            }

            return result;
        }
    }

    if (permission) {
        return hasPermission(permission);
    }

    return undefined;
};

const getHomeRoute = user => {
    let homeList = ["dashboard", "officer-dashboard"];

    let result = "unauthorized";
    var BreakException = {};
    try {
        homeList.forEach(routeName => {
            let route = getRouteByName(routeName);

            let status = checkPermissionForRoute(route);

            if (status) {
                result = routeName;
                throw BreakException;
            }
        });
    } catch (e) {
        console.warn(e);
    }

    if (result == "unauthorized") {
        let suitableRoute;
        // find suitable route for current user
        try {
            suitableRoute = searchRouteByPermission(user.role.permissions[0]);
        } catch (e) {
            return "403";
        }

        if (suitableRoute) {
            result = suitableRoute.name;
        }
    }
    console.warn("forbidden by home route", result);
    return result;
};

const searchRouteByPermission = permission => {
    return findByKeyword(router.options.routes, "meta.permissions", permission);
};

const getRouteByName = routeName => {
    return findByKeyword(router.options.routes, "name", routeName);
};

const getStatus = (type, beforeStatus, currentStatus, times = 1) => {
    if (type && currentStatus) {
        // if required info for searching is ready

        let process_status_list = ConstantKeys.label_status_process_enum[type]; // get status list by shipping type

        if (process_status_list) {
            process_status_list = cloneJson(process_status_list);

            let index = process_status_list.indexOf(
                currentStatus.toUpperCase(),
                times
            );

            if (index != -1) {
                // beready for next
                let key_of_next_status = process_status_list[index + 1];

                let before_status = process_status_list[index - 1];

                let before_status2 = process_status_list[index - 2];

                if (
                    beforeStatus &&
                    beforeStatus.toUpperCase() == before_status
                ) {
                    let searchResult = {
                        next: key_of_next_status
                            ? ConstantKeys.label_status_enum[key_of_next_status]
                            : undefined,
                        current: currentStatus,
                        before: before_status
                            ? ConstantKeys.label_status_enum[before_status]
                            : undefined,
                        before2: before_status2
                            ? ConstantKeys.label_status_enum[before_status2]
                            : undefined,
                        index: index,
                        end: process_status_list.length - 1 == index
                    };

                    return searchResult;
                } else {
                    if (!beforeStatus) {
                        return {
                            next: key_of_next_status
                                ? ConstantKeys.label_status_enum[
                                      key_of_next_status
                                  ]
                                : undefined,
                            current: currentStatus,
                            before: undefined,
                            index: index,
                            end: process_status_list.length - 1 == index
                        };
                    } else {
                        return getStatus(
                            type,
                            beforeStatus,
                            currentStatus,
                            times + 1
                        );
                    }
                }
            } else {
                console.warn(
                    `util.getStatus => Can\'t find status for ${currentStatus} with before ${beforeStatus} in ${type}`
                );
            }
        } else {
            console.warn(
                "util.getStatus => Can't find process status list for ",
                type
            );
        }
    } else {
        console.warn("util.getStatus => Invalid params ", type, currentStatus);
    }
};

const isGlobalRoute = route =>
    route.matched.some(m => m.meta.auth) &&
    route.matched.some(m => m.meta.permissions == "global");

const isGuestRoute = route => route.matched.some(m => m.meta.guest);

const getTotal = (data, key) => {
    let total = 0;

    if (typeof data == "object") {
        let keys = Object.keys(data);

        keys.forEach(key => {
            try {
                total += Number(data[key]);
            } catch (e) {
                console.warn("Invalid Number Format");
                console.warn(e);
            }
        });
    } else {
        console.log(typeof data);
    }
    return total;
};

const acceptConfirmAction = configJson => {
    return new Promise((resolve, reject) => {
        Swal.fire(configJson).then(result => {
            if (result.value) {
                // user confirmed
                resolve(true);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // user refuse to confirm message
                resolve("denied");
            } else {
                // user close
                resolve(false);
            }
        });
    });
};

// get attr of obj by key and locale (if locale is not set, it will be used user's locale or default 'en')
const getLocaleAttr = (obj, key, locale) => {
    let localeKey = ["en", "mm"];

    if (!obj || !key) {
        console.warn("getLocaleAttr => invalid data ", obj, key);
        return "---";
    }

    let current_user = store.state.auth.user;

    let user_locale = current_user ? current_user.locale : "en";

    if (!locale) {
        locale = user_locale;
    }

    localeKey = removeItem(localeKey, locale, element => element === locale);

    if (key.indexOf(".") != -1) {
        key = key.split(".")[0];
    } else {
        key = key + "_";
    }

    let value = obj[`${key}${locale}`];

    if (!value) {
        value = obj[`${key}${localeKey[0]}`];
        return value ? value : "---";
    }

    return value;
};

const transformPayloadToFormData = (payload, formData) => {
    Object.keys(payload).forEach(key => {
        let item = payload[key];

        if (item) {
            if (item && typeof item == "object" && item.name) {
                formData.append(key, item, item.name);
            } else {
                formData.append(key, item);
            }
        }
    });
    return formData;
};

const transformToLocaleSelect = (key, value, list) => {
    let select = {
        list: [],
        bkey: "id",
        bvalue: "value"
    };

    if (!key || !value || !list || !Array.isArray(list)) {
        console.error("transformToLocaleSelect => invalid ", key, value, list);
        return select;
    }

    select = {
        list: list,
        bkey: key,
        bvalue: value
    };

    return select;
};

export default {
    objToArray,
    splitMultiple,
    getServiceFeeName,
    getServiceName,
    cloneJson,
    isJson,
    parseJson,
    search,
    gd,
    isHTML,
    castBool,
    getTextFromHtml,
    getText,
    toString,
    mergeArray,
    uniqueArray,
    uniqueObjectArray,
    isFunction,
    findByKeyword,
    findById,
    sortedByDate,
    sortedByKey,
    transformToList,
    removeItem,
    getModelClass,
    getFormattedMessage,
    toDate,
    avatarImg,
    loadImg,
    localeIndex,
    toTitle,
    shortText,
    getPhoneTag,
    joinArray,
    getPhoneString,
    getResponseError,
    getValidateError,
    getNestedValue,
    prepareForRevalidate,
    getTownShipById,
    isExceptRoute,
    checkPermissionForRoute,
    getRouteByName,
    getHomeRoute,
    isGlobalRoute,
    isGuestRoute,
    currencyFormat,
    getNormalPriceFormat,
    getTotal,
    getStatus,
    acceptConfirmAction,
    searchRouteByPermission,
    flashErrorMessage,
    getLocaleAttr,
    transformPayloadToFormData,
    permissionCheckOverRouteList,
    hasPermission,
    hasPermissionOverList,
    isUpperRank,
    isSuperAdmin,
    isLuxaryRank,
    localeNumbering,
    transformToLocaleSelect,
    transformToListTable,
    isLowerSpecificRank,
    castToString,
};
