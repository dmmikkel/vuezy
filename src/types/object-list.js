import { createMutationName } from '../helpers'

export default class ObjectList {
  constructor (vuexify, prop) {
    this.vuexify = vuexify
    this.prop = prop
  }

  get () {
    return this.vuexify.get(this.prop)
  }

  set (v) {
    if (!Array.isArray(v)) {
      throw new Error('Value must be an array')
    }
    this.vuexify.commit(createMutationName('set', this.prop), v)
  }
  
  add (item) {
    this.vuexify.commit(createMutationName('addItemTo', this.prop), item)
  }

  replaceIndex (newItem, index) {
    this.vuexify.commit(createMutationName('replaceIn', this.prop), { index, newItem })
  }

  replaceWhere (newItem, predicate) {
    const list = this.get()
    const index = list.findIndex(predicate)
    if (index > -1) {
      this.vuexify.commit(createMutationName('replaceIn', this.prop), { index, newItem })
    }
  }

  replaceById (newItem, prop = 'id') {
    const list = this.get()
    const index = list.findIndex(x => x[prop] === newItem[prop])
    if (index === -1) {
      throw new Error('Could not find item with matching id')
    }
    this.vuexify.commit(createMutationName('replaceIn', this.prop), { index, newItem })
  }

  getById (id, prop = 'id') {
    return this.vuexify.get(this.prop).find(x => x[prop] === id)
  }

  replaceOrAddById (newItem, prop = 'id') {
    const list = this.get()
    const index = list.findIndex(x => x[prop] === newItem[prop])
    if (index > -1) {
      this.vuexify.commit(createMutationName('replaceIn', this.prop), { index, newItem })
    } else {
      this.vuexify.commit(createMutationName('addItemTo', this.prop), newItem)
    }
  }

  static defaultValue (d) {
    if (typeof d === 'undefined') {
      return []
    }
    if (!Array.isArray(d)) {
      throw new Error('Default value must be an array')
    }
    return d
  }

  static createMutations (m, p) {
    m[createMutationName('set', p)] = (s, v) => s[p] = v
    m[createMutationName('addItemTo', p)] = (s, v) => s[p].push(v)
    m[createMutationName('replaceIn', p)] = (s, { index, newItem }) => {
      s[p].splice(index, 1, newItem)
    }
  }
}