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
  console.log("Data Saved");
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
function switchDarkLightMode(val, dark) {
  let darkMode = dark;
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

const Utils = {
  firstLetterToUpperCase,
  saveToLocalStorage,
  loadLocalStorage,
  getApiData,
  getDataFromApi,
  switchDarkLightMode,
};

export default Utils;
