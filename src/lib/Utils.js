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

// const generatePaginationList = (category, page, itemsPerPageFromComponet) => {
//   if (itemsPerPageFromComponet) {
//     store.setPaginationData(itemsPerPageFromComponet, "itemsPerPage");
//     dataJs.saveToLocalStorage(response.value, "starwars");
//   }
//   // if (page) pagePagination.value = page;
//   paginationListtoShow.value = response.value.data[category].data.slice(
//     0 + (pagePagination.value - 1) * itemsPerPage.value,
//     itemsPerPage.value * pagePagination.value
//   );
// };

const Utils = {
  getDate,
  // generatePaginationList,
};

export default Utils;
