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
 * @param {string} urlString The url which represents a star wars figure, this shoud be replaced by name or title
 * @param {string} apiURL The main apiUrl
 * @param {*} data The complete Data Object in which the name or title can be found
 * @returns Name or Title
 */
const getNameOrTitle = (urlString, apiURL, data) => {
  const item = data[getCategory(urlString, apiURL)].data.find(
    (element) => element.url == urlString
  );
  return item.name || item.title || "Not defined";
};
/**
 * @param {string} value Text to check if it is no number and contains searchedValue
 * @param {string} searchedValue Value to search for
 * @returns if true returns true
 */
const checkTextForCharacters = (value, searchedValue) => {
  if (typeof value != "number") {
    if (value && value.indexOf(searchedValue) >= 0) {
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
  getNameOrTitle,
  checkTextForCharacters,
  isArray,
};
export default JediUtils;
