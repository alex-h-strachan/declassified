const declassified = require('../index')
const assert = require('assert')

describe('declassified', () => {
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

    const output = await declassified(MyClass, async (instance) => {
      await instance.aMethod(THING)
    })(...TEST_ARGS)

    assert.deepStrictEqual(output, { args: TEST_ARGS, init: true, thing: THING })
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

    const output = await declassified(MyClass, async (instance) => {
      return { hello: 'world' }
    })(...TEST_ARGS)

    assert.deepStrictEqual(output, { hello: 'world' })
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

    const output = await declassified(MyClass)(...TEST_ARGS)

    assert.deepStrictEqual(output, { args: TEST_ARGS })
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

    const output = await declassified(MyClass)(...TEST_ARGS)

    output.args = 'different'

    assert.deepStrictEqual(output, { args: TEST_ARGS })
  })
})
