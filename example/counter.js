import { h, render } from 'preact'
import createStore from '../src/index'

let { Subscribe, mutate } = createStore({
  count: 0
})

function Counter() {
  return <TestComponent />
}

function TestComponent() {
  return (
    <Subscribe on={state => state.count}>
      {count => {
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
        return (
          <div>
            <button onClick={decrement}>-</button>
            <span>{count}</span>
            <button onClick={increment}>+</button>
          </div>
        )
      }}
    </Subscribe>
  )
}
let root
if (!root) {
  root = render(<Counter />, window.root)
} else {
  render(<Counter />, root)
}
