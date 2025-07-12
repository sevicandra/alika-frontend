export const snackToTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const snackToUpperCase = (str: string) => {
  return str.toUpperCase().split("_").join(" ");
};
