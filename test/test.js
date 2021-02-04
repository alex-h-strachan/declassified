const declassify = require('../index')
const assert = require('assert')

describe('declassify', () => {
  it('Wraps our toy constructor and gives the expected properties and methods', async () => {
    const TEST_ARGS = ['a', 'test']
    const THING = 'thing'

    class MyClass {
      constructor (...args) {
        this.args = args
      }

      async aMethod (thing) {
        this.init = true
        this.thing = thing
      }
    }

    const declassified = await declassify(MyClass, async (instance) => {
      await instance.aMethod(THING)
    })(...TEST_ARGS)

    assert.deepStrictEqual(declassified, { args: TEST_ARGS, init: true, thing: THING })
  })

  it('Uses our return value from the init function', async () => {
    const TEST_ARGS = ['a', 'test']

    class MyClass {
      constructor (...args) {
        this.args = args
      }

      async aMethod (thing) {
        this.init = true
        this.thing = thing
      }
    }

    const declassified = await declassify(MyClass, async (instance) => {
      return { hello: 'world' }
    })(...TEST_ARGS)

    assert.deepStrictEqual(declassified, { hello: 'world' })
  })

  it('Uses a default init function', async () => {
    const TEST_ARGS = ['a', 'test']

    class MyClass {
      constructor (...args) {
        this.args = args
      }

      async aMethod (thing) {
        this.init = true
        this.thing = thing
      }
    }

    const declassified = await declassify(MyClass)(...TEST_ARGS)

    assert.deepStrictEqual(declassified, { args: TEST_ARGS })
  })

  it('Returns a frozen copy of the object', async () => {
    const TEST_ARGS = ['a', 'test']

    class MyClass {
      constructor (...args) {
        this.args = args
      }

      async aMethod (thing) {
        this.init = true
        this.thing = thing
      }
    }

    const declassified = await declassify(MyClass)(...TEST_ARGS)

    declassified.args = 'different'

    assert.deepStrictEqual(declassified, { args: TEST_ARGS })
  })
})
