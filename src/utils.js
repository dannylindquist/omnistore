// Bind an object/factory of actions to the store and wrap them.
export function mapActions(actions, store) {
  if (typeof actions === 'function') actions = actions(store)
  let mapped = {}
  for (let i in actions) {
    mapped[i] = store.action(actions[i])
  }
  return mapped
}

// select('foo,bar') creates a function of the form: ({ foo, bar }) => ({ foo, bar })
export function select(properties) {
  if (typeof properties === 'string') properties = properties.split(/\s*,\s*/)
  return state => {
    let selected = {}
    for (let i = 0; i < properties.length; i++) {
      selected[properties[i]] = state[properties[i]]
    }
    return selected
  }
}

// Lighter Object.assign stand-in
export function assign(obj, props) {
  for (let i in props) obj[i] = props[i]
  return obj
}

//preact compat
//https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
export function shallowDiffers(a, b) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}
