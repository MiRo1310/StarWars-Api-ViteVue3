import axios from "axios";
import { useStore } from "../store/store";
import { storeToRefs } from "pinia";

const getData = async (url) => {
  const store = useStore();
  const { response } = storeToRefs(store);
  try {
    const result = await inizializeDataFetching(url);
    if (result) {
      store.setResponse(result, "data");
      saveToLocalStorage(response.value, "starwars");
    } else {
      store.setValuePageData(true, "errorLoadPage");
    }
    setTimeout(() => {
      store.setValuePageData(false, "isReloading");
    }, 3000);
    store.setValuePageData(false, "isLoading");
  } catch (e) {
    console.log(e);
  }
};
const reloadData = () => {
  const store = useStore();
  const { pageData } = storeToRefs(useStore());
  store.setValuePageData(true, "isReloading");
  getData(pageData.value.apiURL);
  console.log("Data will be reloaded!");
};

/**
 * @param {*} response Value to Save
 * @param {string} name StorageKey
 */
const saveToLocalStorage = (response, name) => {
  console.log("savetoLocalStorage");
  localStorage.setItem(name, JSON.stringify(response));
};
/**
 * @param {*} name StorageKey
 * @returns Saved Value || null
 */
const loadLocalStorage = (name) => {
  const savedValue = localStorage.getItem(name);
  if (savedValue) return JSON.parse(savedValue);
  return null;
};
/**
 * @param {string} url Url
 * @param {boolean} getData If true you get.data else .data.results
 * @returns Data || by Error => null
 */
const fetchDataFromServer = async (url, getData) => {
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
const inizializeDataFetching = async (url) => {
  let newData = {};
  const result = await fetchDataFromServer(url);
  if (result) {
    // Einmal durchlaufen um die erste Seite zu laden mit Count und nextPage
    for (let item in result) {
      let data = await fetchDataFromServer(result[item], true);
      newData[item] = {
        data: data.results,
        count: data.count,
      };
      let nextPage = data.next;
      while (nextPage !== null) {
        let data = await fetchDataFromServer(nextPage, true);
        data.results.forEach((element) => {
          newData[item].data.push(element);
        });
        nextPage = data.next;
      }
    }
    return newData;
  } else {
    return null;
  }
};

const dataJs = {
  saveToLocalStorage,
  loadLocalStorage,
  inizializeDataFetching,
  getData,
  reloadData,
};

export default dataJs;
