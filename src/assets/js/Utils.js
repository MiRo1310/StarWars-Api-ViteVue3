const firstLetterToUpperCase = (name) => {
  return name.slice(0, 1).toLocaleUpperCase() + name.slice(1);
};

const Utils = {
  firstLetterToUpperCase,
};

export default Utils;
