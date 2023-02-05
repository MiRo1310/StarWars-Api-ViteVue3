// Special StarWWars Functions
/**
 * @param {string} url Url to filter a part
 * @param {string} apiURL
 * @returns Filtered Part
 */
const getCategory = (url, apiURL) => {
  let element = url.replace(apiURL, "");
  return element.slice(0, element.indexOf("/"));
};

/**
 *
 * @param {string} url
 * @param {string} apiURL
 * @param {*} response
 * @returns Name or Title
 */
const loadNameOrTitle = (url, apiURL, response) => {
  const item = response[getCategory(url, apiURL)].data.find(
    (element) => element.url == url
  );
  return item.name || item.title || "Not defined";
};
/**
 * @param {string} value Text to check if it is no number and contains https
 * @returns if true returns true
 */
const checkValue = (value) => {
  if (typeof value != "number") {
    if (value && value.indexOf("https") >= 0) {
      return true;
    }
  }
};
/**
 * @param {string} value
 * @returns if value is Array returns true
 */
const isArray = (value) => {
  return Array.isArray(value);
};

const JediUtils = {
  getCategory,
  loadNameOrTitle,
  checkValue,
  isArray,
};
export default JediUtils;
