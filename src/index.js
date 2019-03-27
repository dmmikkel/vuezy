import types from './types'
import { mergeObjects } from './helpers'

export default class Vuezy {
  constructor ({ state, actions }) {
    this.state = state
    this.actions = actions
    this.store = null
    this.namespace = null
    this.wrappers = {}
  }

  getWrappers () {
    return this.wrappers
  }

  get (p) {
    if (this.namespace) {
      return this.store.state[this.namespace][p]
    } else {
      return this.store.state[p]
    }
  }

  bind (store, namespace) {
    if (this.store !== null) {
      throw new Error('Vuezy instance is already bound to a store')
    }

    this.store = store
    this.namespace = namespace

    for (const prop in this.state) {
      const def = this.state[prop]
      this.wrappers[prop] = new types[def.type](this, prop)
    }
  }

  commit (c, v) {
    if (this.namespace) {
      this.store.commit(this.namespace + '/' + c, v)
    } else {
      this.store.commit(c, v)
    }
  }

  createState () {
    const state = {}
    for (const prop in this.state) {
      const def = this.state[prop]
      state[prop] = types[def.type].defaultValue(def.default)
    }
    return state
  }

  createMutations () {
    const mutations = {}
    for (const prop in this.state) {
      const def = this.state[prop]
      types[def.type].createMutations(mutations, prop)
    }
    return mutations
  }

  createActions () {
    const actions = {}
    for (const actionName in this.actions) {
      actions[actionName] = (fromVuex, v) => this.actions[actionName](mergeObjects([fromVuex, { wrappers: this.wrappers }]), v)
    }
    return actions
  }
}