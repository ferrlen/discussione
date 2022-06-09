import lodashDeepClone from "lodash.clonedeep";

export default (() => ({
  // Shallow Clone
  clone: (obj) => JSON.parse(JSON.stringify(obj)),
  deepClone: (obj) => lodashDeepClone(obj),
  hasProp: (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop),
  toHtmlEntities: (rawStr) => rawStr.replace(/[\u00A0-\u9999<>&]/g, (i) => `&#${i.charCodeAt(0)};`),
  decodeHTMLEntities: (s) => {
    const element = document.createElement("div");
    let str = s;
    if (str && typeof str === "string") {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "");
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = "";
    }

    return str;
  },
}))();
