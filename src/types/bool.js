import { createMutationName } from '../helpers'

export default class Bool {
  constructor (vuezy, prop) {
    this.vuezy = vuezy
    this.prop = prop
  }

  get () {
    return this.vuezy.get(this.prop)
  }

  set (v) {
    if (typeof v !== 'boolean') {
      throw new Error('Value must be of type boolean')
    }
    this.vuezy.commit(createMutationName('set', this.prop), v)
  }

  toggle () {
    this.vuezy.commit(createMutationName('set', this.prop), !this.get())
  }

  static defaultValue (d) {
    if (typeof d === 'undefined') {
      return false
    }
    if (typeof d !== 'boolean') {
      throw new Error('Default value must be of type boolean')
    }
    return d
  }

  static createMutations (m, p) {
    m[createMutationName('set', p)] = (s, v) => s[p] = v
  }
}