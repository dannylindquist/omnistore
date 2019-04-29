# omnistore

> Immutable state for Preact using [Immer](https://github.com/mweststrate/immer)

- Heavily inspired (and highly plagarized from) by [react-copy-write](https://github.com/aweary/react-copy-write), [bey](https://github.com/jamiebuilds/bey), [unistore](https://github.com/developit/unistore)

## Purpose

Learning about constructing objects and creating js libraries. Its just another state management solution that may or may not be awful. I'm learning okay!.

I like the idea of having the mutation of the data in the same class/file that it is used for display. We will see how it goes. More of an experiment.

!!!API SUBJECT TO CHANGE!!!

## Install

```sh
yarn add omnistore
```

## Example

```js
import { h, render } from 'preact'
import createStore from 'omnistore'

let { Subscribe, mutate } = createStore({
  count: 0
})

function increment() {
  mutate(state => {
    state.count++
  })
}

function decrement() {
  mutate(state => {
    state.count--
  })
}

function Counter() {
  return (
    <Subscribe on={state => state.count}>
      {count => (
        <div>
          <button onClick={decrement}>-</button>
          <span>{count}</span>
          <button onClick={increment}>+</button>
        </div>
      )}
    </Subscribe>
  )
}

render(<Counter />, window.root)
```

## License

MIT License © Danny Lindquist
