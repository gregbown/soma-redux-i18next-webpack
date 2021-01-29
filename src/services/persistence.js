const TIMEOUT = 1000;
export const localization = function() {
  return this;
};

localization.prototype = {
  translate: function(todo) {
    console.log(`localization translate ${todo}`)
    return new Promise( resolve => {
      setTimeout(() => resolve(todo), TIMEOUT)
    })
  }
}
