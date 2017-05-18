if (!Array.prototype.forEach) {
  Array.prototype.forEach = function forEach (callback, scope) {  // eslint-disable-line no-extend-native
    for (var array = this, index = 0, length = array.length; index < length; ++index) {
      callback.call(scope || window, array[index], index, array)
    }
  }
}

module.exports = {}
