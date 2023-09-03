import { useStore } from "../store/store";
import { storeToRefs } from "pinia";
import dataJs from "./data";
let response, store, pageData;

const generatePaginationList = (category, page, itemsPerPageFromComponet) => {
  store = useStore();
  response = storeToRefs(store).response;
  pageData = storeToRefs(store).pageData;
  let paginationData = storeToRefs(store).paginationData;
  if (itemsPerPageFromComponet) {
    store.setPaginationData(itemsPerPageFromComponet, "itemsPerPage");
    dataJs.saveToLocalStorage(response.value, "starwars");
  }
  if (page) {
    store.setPaginationData(page, "pagePagination");
  }
  console.log(paginationData.value.itemsPerPage);
  let start = 0 + (paginationData.value.pagePagination - 1) * paginationData.value.itemsPerPage;
  let end = paginationData.value.itemsPerPage * paginationData.value.pagePagination;

  console.log(start, end);
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
};

export default Utils;
