export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2.12})?$/);
};

export const validateLength = (str, min, max) => {
  if (str.length > max || str.length < min) {
    return false;
  }
  return true;
};
