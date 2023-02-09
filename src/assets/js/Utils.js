import axios from "axios";
/**
 * @param {string} name String
 * @returns String
 */
const firstLetterToUpperCase = (name) => {
  return name.slice(0, 1).toLocaleUpperCase() + name.slice(1);
};

/**
 * @param {*} response Value to Save
 * @param {string} name StorageKey
 */
const saveToLocalStorage = (response, name) => {
  localStorage.setItem(name, JSON.stringify(response));
};
/**
 * @param {*} name StorageKey
 * @returns Saved Value || null
 */
const loadLocalStorage = async (name) => {
  const savedValue = localStorage.getItem(name);
  if (savedValue) return JSON.parse(savedValue);
  else return null;
};
/**
 * @param {string} url Url
 * @param {boolean} getData If true you get.data else .data.results
 * @returns Data || by Error => null
 */
const getApiData = async (url, getData) => {
  try {
    const response = await axios.get(url);
    if (response.data.results && !getData) {
      return response.data.results;
    } else if (response.data) {
      return response.data;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
/**
 * @param {string} url URL
 * @returns Data
 */
const getDataFromApi = async (url) => {
  let newData = {};
  const result = await getApiData(url);
  if (result) {
    // Einmal durchlaufen um die erste Seite zu laden mit Count und nextPage
    for (let item in result) {
      let data = await getApiData(result[item], true);
      newData[item] = {
        data: data.results,
        count: data.count,
      };
      let nextPage = data.next;
      while (nextPage !== null) {
        let data = await getApiData(nextPage, true);
        data.results.forEach((element) => {
          newData[item].data.push(element);
        });
        nextPage = data.next;
      }
    }
    console.log(newData);
    return newData;
  } else {
    return null;
  }
};
/**
 * @param {boolean} val On Off
 * @param {*} response Response
 * @returns On Off
 */
function switchDarkLightMode(val, response) {
  let darkMode = response.darkMode;
  const htmlTag = document.querySelector("html");
  if (val == undefined) {
    darkMode = !darkMode;
    if (darkMode == true) htmlTag.classList.add("dark");
    else htmlTag.classList.remove("dark");
    return darkMode;
  } else {
    darkMode = val;
    if (val) htmlTag.classList.add("dark");
    else htmlTag.classList.remove("dark");
    return darkMode;
  }
}
/**
 * @param {string} key Text to replace _
 * @returns Text without any _
 */
const delUnderscore = (key) => {
  while (key.indexOf("_") > 0) {
    key = key.replace("_", " ");
  }
  return key;
};
/**
 *
 * @param {string} value Date like 2014-12-20T21:17:50.311000Z convert to 20.12.2014 22:17:50
 * @returns Converted Date
 */
const getDate = (value) => {
  let date = new Date(value);
  if (value.includes("T"))
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  else return `${date.toLocaleDateString()}`;
};
/**
 *
 * @param {string} text Text to search in
 * @param {string} searchFor Find this in the text
 * @returns Array with separating the searched Text
 */
const extractSearchFromText = (text, searchFor) => {
  let lengthOfSearch;
  let textToLowerCase;
  let array = [];
  if (text && searchFor) {
    lengthOfSearch = searchFor.length;
    textToLowerCase = text.toLowerCase();
    searchFor = searchFor.toLowerCase();
    let position;
    let positionBefor = 0;
    while (textToLowerCase.includes(searchFor)) {
      position = textToLowerCase.indexOf(searchFor);
      let placeholder = "/".repeat(lengthOfSearch);
      textToLowerCase = textToLowerCase.replace(searchFor, placeholder);
      if (text.slice(positionBefor, position) != "")
        array.push(text.slice(positionBefor, position));
      array.push(text.slice(position, position + lengthOfSearch));
      positionBefor = position + lengthOfSearch;
    }
    array.push(text.slice(positionBefor, text.length));
  }
  if (array.length > 0) return array;
  else return text;
};

const Utils = {
  firstLetterToUpperCase,
  saveToLocalStorage,
  loadLocalStorage,
  getApiData,
  getDataFromApi,
  switchDarkLightMode,
  delUnderscore,
  getDate,
  extractSearchFromText,
};

export default Utils;
