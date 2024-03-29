import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => {
    return {
      response: { data: {} },
      pageData: {
        isStarting: true,
        isLoading: true,
        apiURL: "https://swapi.py4e.com/api/",
        darkMode: false,
        dropdown: false,
        actualCategory: "",
        errorLoadPage: false,
        showDialogConfirm: false,
        isReloading: false,
        itemInfoPage: null,
        actualItem: null,
        showMobilNav: false,
      },
      search: {
        showSearch: false,
        filteredElements: [],
        searchedText: "",
      },
      paginationData: { pagePagination: 1, itemsPerPage: 10, pagePagination: 1, paginationListtoShow: [] },
    };
  },
  actions: {
    setResponse(data, key) {
      console.log(key);
      if (!key) this.response = data;
      else {
        this.response[key] = data;
      }
    },
    setPaginationData(data, key) {
      this.paginationData[key] = data;
    },
    setValuePageData(val, key) {
      this.pageData[key] = val;
    },
    setSearchData(val, key) {
      this.search[key] = val;
    },
    toggleDarkMode() {
      this.pageData.darkMode = !this.pageData.darkMode;
    },
    showSearch() {
      this.search.showSearch = true;
    },
    hideSearch() {
      this.search.showSearch = false;
    },
    filteredElementsPush(element) {
      this.search.filteredElements.push(element);
    },
  },
  getters: {
    records: (state) => {
      if (!state.response.data[state.pageData.actualCategory]) return 0;
      return state.response.data[state.pageData.actualCategory].count;
    },
    itemsPerPage: (state) => {
      return state.paginationData.itemsPerPage;
    },

    pagePagination: (state) => {
      return state.paginationData.pagePagination;
    },
    isSearchedText: (state) => {
      if (state.search.searchedText !== "") return true;
    },
    searchedRecords: (state) => {
      console.log(state.search.filteredElements.length);
      return state.search.filteredElements.length;
    },
  },
});
