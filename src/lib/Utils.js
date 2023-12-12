import { useStore } from "../store/store";
import { storeToRefs } from "pinia";
import dataJs from "./data";
import JediUtils from "./jedi";

const searchForUserInput = () => {
  const store = useStore();
  const { response, search } = storeToRefs(store);
  store.showSearch();
  store.setSearchData([], "filteredElements");
  let searchedCategory = document.getElementById("selectItem").value;
  store.setSearchData(document.getElementById("searchedText").value, "searchedText");

  if (store.isSearchedText) {
    // Globale Abfrage
    if (searchedCategory === "global") {
      for (let element in response.value.data) {
        Utils.findItem(element, search.value.searchedText).forEach((element) => {
          store.filteredElementsPush(element);
        });
      }
    }
    // Abfrage eines bestimmten Items
    else {
      store.setSearchData(Utils.findItem(searchedCategory, search.value.searchedText), "filteredElements");
    }
  } else {
    store.hideSearch();
  }
};

const findItem = (category, text) => {
  const store = useStore();
  const { response, pageData } = storeToRefs(store);
  let filteredElements = [];
  response.value.data[category].data.forEach((element) => {
    const array = Object.entries(element);
    // Wenn das Element eine Array ist soll es als Text definert werden
    array.forEach((element) => {
      if (Array.isArray(element[1])) {
        let intermediateValue = [];
        element[1].forEach((element) => {
          intermediateValue.push(JediUtils.getNameOrTitle(element, pageData.value.apiURL, response.value.data));
        });
        array[array.indexOf(element)][1] = intermediateValue.join(" , ");
      } else if (element[1] != null && typeof element[1] !== "number" && element[1].includes("https")) {
        array[array.indexOf(element)] = JediUtils.getNameOrTitle(element[1], pageData.value.apiURL, response.value.data);
      } else if (["created", "edited", "release_date"].includes(element[0])) {
        array[array.indexOf(element)][1] = getDate(element[1]);
      }
    });
    array.forEach((element) => {
      if (Array.isArray(element)) array[array.indexOf(element)] = element.join(" : ");
    });
    let filteredElementsOfOneArray = array.filter((value) => {
      if (value) return value.toString().toLowerCase().indexOf(text.toLowerCase()) != -1;
    });
    if (filteredElementsOfOneArray.length != 0) {
      filteredElements.push({
        search: filteredElementsOfOneArray.join(" "),
        name: element.name || element.title,
        url: element.url,
        category: category,
      });
    }
  });
  return filteredElements;
};

const loadNav = (pName, pageNumber) => {
  const store = useStore();
  store.setValuePageData(pName, "actualCategory");
  store.setValuePageData(false, "isStarting");
  generatePaginationList(pName, pageNumber);
  store.setValuePageData(null, "itemInfoPage");
};

const loadInfo = (url) => {
  const store = useStore();
  const { pageData, response, paginationData } = storeToRefs(store);
  store.setValuePageData(false, "isStarting");
  const category = JediUtils.getCategory(url, pageData.value.apiURL);
  store.setValuePageData(
    response.value.data[category].data.find((element) => element.url == url),
    "itemInfoPage"
  );
  store.setValuePageData(pageData.value.itemInfoPage.name || pageData.value.itemInfoPage.title, "actualItem");
  store.setValuePageData(category, "actualCategory");
  let arrayOfItem = response.value.data[category].data;
  Utils.generatePaginationList(
    category,
    Math.ceil(
      (arrayOfItem.indexOf(arrayOfItem.find((element) => element.url == pageData.value.itemInfoPage.url)) + 1) /
        paginationData.value.itemsPerPage
    )
  );
};

const generatePaginationList = (category, page, itemsPerPageFromComponet) => {
  const store = useStore();
  const { response, pageData, paginationData } = storeToRefs(store);
  if (itemsPerPageFromComponet) {
    store.setPaginationData(itemsPerPageFromComponet, "itemsPerPage");
    dataJs.saveToLocalStorage(response.value, "starwars");
  }
  if (page) {
    store.setPaginationData(page, "pagePagination");
  }
  let start = 0 + (paginationData.value.pagePagination - 1) * paginationData.value.itemsPerPage;
  let end = paginationData.value.itemsPerPage * paginationData.value.pagePagination;

  if (!category) category = pageData.value.actualCategory;
  else store.setValuePageData(category, "actualCategory");
  store.setPaginationData(response.value.data[category].data.slice(start, end), "paginationListtoShow");
};
/**
 *
 * @param {string} value Date like 2014-12-20T21:17:50.311000Z convert to 20.12.2014 22:17:50
 * @returns Converted Date
 */
const getDate = (value) => {
  let date = new Date(value);
  if (value.includes("T")) return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  else return `${date.toLocaleDateString()}`;
};

const Utils = {
  getDate,
  generatePaginationList,
  loadInfo,
  loadNav,
  findItem,
  searchForUserInput,
};

export default Utils;
