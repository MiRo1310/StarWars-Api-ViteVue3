/**
 * @param {string} key Text to replace _
 * @returns Text without any _
 */
const delUnderscore = (key) => {
  while (key.indexOf("_") > 0) {
    key = key.replace("_", " ");
  }
  return key;
};
/**
 * @param {string} name string in which the first letter should be capitalized
 * @returns the modified string
 */
const firstLetterToUpperCase = (name) => {
  return name.slice(0, 1).toLocaleUpperCase() + name.slice(1);
};

/**
 *
 * @param {string} text Text to search in
 * @param {string} searchFor Find this in the text
 * @returns Array with separating the searched Text
 */
const extractSearchFromText = (text, searchFor) => {
  let lengthOfSearch;
  let textToLowerCase;
  let array = [];
  if (text && searchFor) {
    lengthOfSearch = searchFor.length;
    textToLowerCase = text.toLowerCase();
    searchFor = searchFor.toLowerCase();
    let position;
    let positionBefor = 0;
    while (textToLowerCase.includes(searchFor)) {
      position = textToLowerCase.indexOf(searchFor);
      let placeholder = "/".repeat(lengthOfSearch);
      textToLowerCase = textToLowerCase.replace(searchFor, placeholder);
      if (text.slice(positionBefor, position) != "")
        array.push(text.slice(positionBefor, position));
      array.push(text.slice(position, position + lengthOfSearch));
      positionBefor = position + lengthOfSearch;
    }
    array.push(text.slice(positionBefor, text.length));
  }
  if (array.length > 0) return array;
  else return text;
};

const stringJs = {
  firstLetterToUpperCase,
  extractSearchFromText,
  delUnderscore,
};

export default stringJs;
