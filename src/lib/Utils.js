/**
 * @param {boolean} val On Off
 * @param {*} response Response
 * @returns On Off
 */
function switchDarkLightMode(val, response) {
  const htmlTag = document.querySelector("html");
  if (val === undefined) {
    htmlTag.classList.toggle("dark");
    return !response.darkMode;
  } else {
    if (val) htmlTag.classList.add("dark");
    else htmlTag.classList.remove("dark");
    return val;
  }
}
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
  switchDarkLightMode,
  getDate,
};

export default Utils;
