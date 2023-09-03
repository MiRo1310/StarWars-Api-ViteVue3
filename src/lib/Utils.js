import { useStore } from "../store/store";
import { storeToRefs } from "pinia";
import dataJs from "./data";
import JediUtils from "./jedi";

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
};

export default Utils;
