if (typeof Date !== "undefined" && !Date.now) {
  // Date.now
  Date.now = function now() {
    return new Date().getTime();
  };
}
