if (typeof Array !== "undefined" && !Array.isArray) {
  // Array.isArray
  Array.isArray = function isArray(array) {
    return array && Object.prototype.toString.call(array) === '[object Array]';
  };
}
