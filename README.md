# $tate

> A simple JS state management library - inspired by Redux and based on Immer

## Installation

Install `$tate` by running

```bash
npm install dollar-state
```

## Usage

### Setup

Create a store by running `createStore`

```js
import $tate from "dollar-state";

const store = $state.createStore();
```

`createStore` support 3 arguments

- `initialState`, an object to initialize the state with
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

---

Made with :sparkles: & :heart: by [Mattia Panzeri](https://github.com/panz3r) and [contributors](https://github.com/panz3r/dollar-state/graphs/contributors)
