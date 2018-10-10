import { h, render } from 'preact'
import createStore from '../build/omnistore'

describe('createStore', () => {
  it('should be instantiable', () => {
    let { store, mutate } = createStore()
    expect(store).toMatchObject({
      get: expect.any(Function),
      on: expect.any(Function),
      off: expect.any(Function)
    })
    expect(mutate).toBeInstanceOf(Function)
  })
  it('should update state in-place', () => {
    let { store, mutate } = createStore()
    expect(store.get()).toMatchObject({})
    mutate(draft => {
      draft.a = 'b'
    })
    expect(store.get()).toMatchObject({ a: 'b' })
    mutate(draft => {
      draft.c = 'd'
    })
    expect(store.get()).toMatchObject({ a: 'b', c: 'd' })
    mutate(draft => {
      draft.a = 'x'
    })
    expect(store.get()).toMatchObject({ a: 'x', c: 'd' })
    mutate(draft => {
      draft.c = null
    })
    expect(store.get()).toMatchObject({ a: 'x', c: null })
    mutate(draft => {
      draft.c = undefined
    })
    expect(store.get()).toMatchObject({ a: 'x', c: undefined })
  })

  it('should invoke subscriptions', () => {
    let { store, mutate } = createStore()

    let sub1 = jest.fn()
    let sub2 = jest.fn()
    let action

    store.on(sub1)

    mutate(draft => {
      draft.a = 'b'
    })
    expect(sub1).toBeCalled()

    store.on(sub2)
    mutate(draft => {
      draft.c = 'd'
    })
    expect(sub1).toHaveBeenCalledTimes(2)
  })

  it('should remove subscriptions', () => {
    let { store, mutate } = createStore()

    let sub1 = jest.fn()

    store.on(sub1)
    mutate(draft => {
      draft.a = 'b'
    })
    expect(sub1).toBeCalledTimes(1)
    store.off(sub1)
    sub1.mockReset()
    mutate(draft => {
      draft.a = 'c'
    })
    expect(sub1).toBeCalledTimes(0)
  })
})

describe('integration (preact)', () => {
  it('without on prop', () => {
    let { store, Subscribe, mutate } = createStore({ count: 0 })
    let root = document.createElement('div')
    let onClick = () => {
      mutate(draft => {
        draft.count += 1
      })
    }
    render(
      <Subscribe>
        {state => <button onClick={onClick}>count: {state.count}</button>}
      </Subscribe>,
      root
    )
    expect(store.get()).toEqual({ count: 0 })
    root.firstElementChild.click()
    expect(store.get()).toEqual({ count: 1 })
  })
  it('with on prop', () => {
    let { store, Subscribe, mutate } = createStore({ count: 0 })
    let root = document.createElement('div')
    let onClick = () => {
      mutate(draft => {
        draft.count += 1
      })
    }
    render(
      <Subscribe on={state => state.count}>
        {count => <button onClick={onClick}>count: {count}</button>}
      </Subscribe>,
      root
    )
    expect(store.get()).toEqual({ count: 0 })
    root.firstElementChild.click()
    expect(store.get()).toEqual({ count: 1 })
  })
})
