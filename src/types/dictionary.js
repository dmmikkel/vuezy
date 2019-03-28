import {
  createMutationName
} from '../helpers'

export default class Bool {
  constructor(vuexify, prop) {
    this.vuexify = vuexify
    this.prop = prop
  }

  get() {
    return this.vuexify.get(this.prop)
  }

  set(v) {
    if (typeof v !== 'object') {
      throw new Error('Value must be of type object')
    }
    this.vuexify.commit(createMutationName('set', this.prop), v)
  }

  getKey(key) {
    return this.vuexify.get(this.prop)[key]
  }

  add(key, value) {
    console.log('add', key, value)
    this.vuexify.commit(createMutationName('addTo', this.prop), { key, value })
  }

  clear() {
    this.vuexify.commit(createMutationName('clear', this.prop))
  }

  containsKey(key) {
    const value = this.getKey(key)
    if (typeof value !== 'undefined') {
      return true
    }
    return false
  }

  remove(key) {
    this.vuexify.commit(createMutationName('remove', this.prop), key)
  }

  static defaultValue(d) {
    if (typeof d === 'undefined') {
      return {}
    }
    if (typeof d !== 'object') {
      throw new Error('Default value must be of type boolean')
    }
    return d
  }

  static createMutations(m, p, Vue) {
    m[createMutationName('set', p)] = (s, v) => s[p] = v
    m[createMutationName('addTo', p)] = (s, { key, value }) => Vue.set(s[p], key, value)
    m[createMutationName('remove', p)] = (s, key) => Vue.delete(s[p], key)
    m[createMutationName('clear', p)] = (s) => s[p] = {}
  }
}