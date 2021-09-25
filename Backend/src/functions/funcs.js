const checkEmptyFields = (data) => {
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    if (data[keys[i]] === "" || data[keys[i]] === undefined) {
      return false;
    }
  }
  return true;
}

module.exports = {
  checkEmptyFields,
}