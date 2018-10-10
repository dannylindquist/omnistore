// @flow
'use strict'
import produce from 'immer'
import { Component } from 'preact'
import shallowEquals from 'fbjs/lib/shallowEqual'

// from bey.js
// https://github.com/jamiebuilds/bey/blob/master/src/bey.js
function constructStore(initialState) {
  let listeners = []
  let currentState = initialState || {}
  return {
    store: {
      get() {
        return currentState
      },
      on(listener) {
        listeners.push(listener)
      },
      off(listener) {
        listeners = listeners.filter(fn => fn !== listener)
      },
      reset() {
        currentState = initialState
      }
    },
    mutate: function(updater) {
      let nextState = produce(currentState, updater)
      if (nextState !== currentState) currentState = nextState
      listeners.forEach(listener => listener())
    }
  }
}

function connect(store) {
  function Subscribe(props) {
    function getState() {
      return props.on ? props.on(store.get()) : store.get()
    }
    let _shouldUpdate = false
    let _state = getState()

    let onUpdate = () => {
      let prevState = _state
      let nextState = getState()
      _state = nextState
      if (!_shouldUpdate) return
      if (!shallowEquals(prevState, nextState)) this.setState({})
    }
    this.componentDidMount = () => {
      _shouldUpdate = true
      store.on(onUpdate)
    }
    this.componentWillUnmount = () => {
      _shouldUpdate = false
      store.off(onUpdate)
    }
    this.render = () => {
      return this.props.children[0](_state)
    }
  }
  return ((Subscribe.prototype = new Component()).constructor = Subscribe)
}

export default function create(initialState) {
  let { store, mutate } = constructStore(initialState)
  let Subscribe = connect(store)
  return {
    store,
    Subscribe,
    mutate
  }
}
