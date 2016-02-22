# Node.js: catch-modules

`catch-modules` find already installed modules, either globally or in your project.

## Installation

npm install catch-modules --save

## Usage

```js
var findModule = require('catch-modules')

findModule.byName('abc', function(err, data) {
    if (err) return console.log(err)
    console.log('There is your data: ', data)
})
```

## Methods
- [byName](#byName)
- [byNameSync](#byNameSync)
- [byDependency](#byDependency)
- [byDependencySync](#byDependencySync)

### byName

**byName([global], hint, callback)**

Searches all modules by name.

Example:

```js
var findModule = require('catch-modules')

findModule.byName('async', function(err, data) {
    if (err) return console.log(err)
    console.log('There is your data: ', data)
}) // searches in project node_modules

findModule.byName(true, 'async', function(err, data) {
    if (err) return console.log(err)
    console.log('There is your data: ', data)
}) // searches in global node_modules
```

### byNameSync

**byNameSync([global], hint)**

Synchronously searches all modules by name.

Example:

```js
var findModule = require('catch-modules')


try {
    findModule.byNameSync('async') // searches in project node_modules
} catch (err) {
    console.error('Oh no, there was an error: ' + err.message)
}
```

### byDependency

**byDependency([global], hint, callback)**

Searches all modules by dependency.

Example:

```js
var findModule = require('catch-modules')

findModule.byDependency('async', function(err, data) {
    if (err) return console.log(err)
    console.log('There is your data: ', data)
}) // searches in dependencies of package.json in node_modules

findModule.byDependency(true, 'async', function(err, data) {
    if (err) return console.log(err)
    console.log('There is your data: ', data)
}) // searches in dependencies of package.json in global node_modules
```

### byDependencySync

**byDependencySync([global], hint)**

Synchronously searches all modules by dependency.

Example:

```js
var findModule = require('catch-modules')

try {
    findModule.byDependencySync('async') // searches in project node_modules
} catch (err) {
    console.error('Oh no, there was an error: ' + err.message)
}
```
