/**
 *
 * @param {constructor} Constructor The class constructor to be wrapped
 * @param {async function init(instance) { returns object }} init The set of steps to modify the instance
 * @returns {async function config(...constructorArguments)}
 */

module.exports = function declassified (Constructor, init = a => a) {
  return async function config (...constructorArguments) {
    const instance = new Constructor(...constructorArguments)
    const inited = await init(instance) || instance

    const stripped = Object.entries(inited)
      .filter(entry => {
        const [key] = entry
        return Object.prototype.hasOwnProperty.call(inited, key)
      })
      .map(entry => {
        const [key, value] = entry
        if (typeof value === 'function') {
          return [key, value.bind(inited)]
        }
        return [key, value]
      })
      .reduce((prev, entry) => {
        const [key, value] = entry
        return {
          ...prev,
          [key]: value
        }
      }, {})

    return Object.freeze(stripped)
  }
}
