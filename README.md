# $tate

> A simple JS state management library - inspired by Redux and based on Immer

[![license](https://img.shields.io/github/license/panz3r/dollar-state.svg)](https://github.com/panz3r/dollar-state/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/dollar-state.svg)](https://www.npmjs.com/package/dollar-state)

[![Github Issues](https://img.shields.io/github/issues/panz3r/dollar-state.svg)](https://github.com/panz3r/dollar-state/issues)
[![Build Status](https://travis-ci.com/panz3r/dollar-state.svg?branch=master)](https://travis-ci.com/panz3r/dollar-state)
[![Coverage Status](https://coveralls.io/repos/github/panz3r/dollar-state/badge.svg?branch=master)](https://coveralls.io/github/panz3r/dollar-state?branch=master)

[![NPM downloads](https://img.shields.io/npm/dm/dollar-state.svg)](https://npmjs.com/package/dollar-state)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/dollar-state/badge?style=rounded)](https://www.jsdelivr.com/package/npm/dollar-state)

## Installation

Install `$tate` by running

```bash
npm install dollar-state
```

## Usage

### Setup

Create a store by running `createStore`

```js
import $tate from 'dollar-state';

const store = $tate.createStore();
```

`createStore` can be invoked with 2 arguments

- `initialState`, an object to initialize the state with
- `options`, an optional object with the following keys
  - `persistenceKey`, a string to be used to persist the store to `LocalStorage` on each update (if required)
  - `debug`, a flag to enable debug logging on `updateState` calls, default: `false`

### Update

To update the state you should call the `updateState` function passing a state modifier function

```js
store.updateState(function(currentState) {
  currentState.count = 1;
});
```

### Subscribe

To subscribe to state changes you simple set a state listener

```js
const _unsubscribeStore = store.subscribe(function(newState) {
  console.log({ newState });
});
```

**N.B:** Don't forget to call the returned method when you don't need updates anymore

```js
if (_unsubscribeStore) {
  _unsubscribeStore();
}
```

### Reset state

To reset a store to its initial state

```js
store.resetState();
```

---

## Demo

A demo using `jQuery` is available inside the `demo` folder.
To run the demo:

- build the library using

```sh
npm run dev
```

- copy (or symlink) `dollar-state.min.js` file from `dist` to `demo` folder

```sh
cp dist/dollar-state.min.js demo
```

- install `demo` npm dependencies

```sh
cd demo
npm install
```

- run demo app

```sh
npm run start
```

---

Made with :sparkles: & :heart: by [Mattia Panzeri](https://github.com/panz3r) and [contributors](https://github.com/panz3r/dollar-state/graphs/contributors)

If you found this project to be helpful, please consider buying me a coffee.

[![buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoff.ee/4f18nT0Nk)
