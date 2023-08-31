import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => {
    return { response: { data: {}, darkMode: true, itemsPerPage: 10, pageData: { start: true, isLoading: true } } };
  },
  actions: {
    setResponse(response) {
      this.response = response;
    },
    setValue(val, key) {
      this.response.pageData[key] = val;
      console.log(key, val);
    },
  },
});
