if (!Array.prototype.filter) {
  Array.prototype.filter = function filter (callback, scope) { // eslint-disable-line no-extend-native
    for (var array = this, arrayB = [], index = 0, length = array.length, element; index < length; ++index) {
      element = array[index]

      if (callback.call(scope || window, element, index, array)) {
        arrayB.push(element)
      }
    }

    return arrayB
  }
}

module.exports = {}
