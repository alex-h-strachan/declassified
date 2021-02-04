# declassified
## Motivation
A lot of libraries come in the form
```js
class MyThing {
  constructor(config) {
    // much around with this
    this.thing = config[thing]
  }

  method() {
    // subtly depend on values set during the configuration phase
    something(this.config)
  }
}
```

This has a few problems:
- The `this.X` properties are mutable throughout the code.
- The constructor is synchronous meaning that often times the class isn't usable until some methods have been called.

### What is preferable
What if, instead of a class, the authors had exported a library.  It might look something like:
```js
async function myThing (config) => {
  await doInitialization()
  return {
    method() {
      something(config)
    }
  }
}
```

This allows asynchronous set-up and protects the internals of the library (the configs, any other arguments) from imperative modification.

## The solution
```js
const declassified = require('declassified')
const MyClass = require('something')

const myLibrary = declassified(MyClassBasedLibrary, async (instance) => {
  // do imperative things to the instance here that you'd want to do as part of the setup
})

const myThing = await myLibrary(configs)
```

## API
The declassify function takes only two arguments
- The class-based library to be wrapped
- (optional) An init function for your class which will be called with a "newed" class instance.  The return value is used if supplied, otherwise it defaults to the class instance. Defaults to the identity function.

It returns an async function "config" that takes the same arguments as the original constructor.

When called the "config" function will return a frozen copy of the object returned by init

## Examples
### pg
Say you want to connect to a database like Postgres.  The node pg client requires you to
```js
const { Client } = require('pg')

const contructorArgs = { host: 'my-db' } //...
const client = new Client(contructorArgs)
await client.connect()

const res = await client.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
```

How might we declassified that?
```js
const declassified = require('declassified')
const { Client } = require('pg')

const contructorArgs = { host: 'my-db' } //...
const init = async (instance) => {
  await instance.connect()
  return instance
}

const client = await declassified(Client, init)(constructorArgs)

const res = await client.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
```

So you might ask: this looks like it's just extra lines to do the same thing, but it's not:
Say someone set `client.connection = something`.  Instead of being meaningless code, that has broken your client permanently.  It might not have even occurred during the handling of the request you're looking at due to the asynchronous nature of node.  In large code bases (particularly large test suites where people are mocking and meta-programming frequently) these are real bugs that can be avoided.
