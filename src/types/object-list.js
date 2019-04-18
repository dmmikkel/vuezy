import { createMutationName } from '../helpers'

export default class ObjectList {
  constructor (vuezy, prop) {
    this.vuezy = vuezy
    this.prop = prop
  }

  get () {
    return this.vuezy.get(this.prop)
  }

  set (v) {
    if (!Array.isArray(v)) {
      throw new Error('Value must be an array')
    }
    this.vuezy.commit(createMutationName('set', this.prop), v)
  }
  
  add (item) {
    this.vuezy.commit(createMutationName('addItemTo', this.prop), item)
  }

  replaceIndex (newItem, index) {
    this.vuezy.commit(createMutationName('replaceIn', this.prop), { index, newItem })
  }

  replaceWhere (newItem, predicate) {
    const list = this.get()
    const index = list.findIndex(predicate)
    if (index > -1) {
      this.vuezy.commit(createMutationName('replaceIn', this.prop), { index, newItem })
    }
  }

  deleteAllWhere (predicate) {
    const list = this.get()
    const newList = list.filter(item => !predicate(item))
    this.vuezy.commit(createMutationName('set', this.prop), newList)
  } // TODO: Add to documentation and release

  replaceById (newItem, prop = 'id') {
    const list = this.get()
    const index = list.findIndex(x => x[prop] === newItem[prop])
    if (index === -1) {
      throw new Error('Could not find item with matching id')
    }
    this.vuezy.commit(createMutationName('replaceIn', this.prop), { index, newItem })
  }

  getById (id, prop = 'id') {
    return this.vuezy.get(this.prop).find(x => x[prop] === id)
  }

  deleteById (id, prop = 'id') {
    const index = this.vuezy.get(this.prop).findIndex(x => x[prop] === id)
    this.vuezy.commit(createMutationName('deleteFrom', this.prop), index)
  }

  addOrReplaceById (newItem, prop = 'id') {
    const items = Array.isArray(newItem) ? newItem : [newItem]
    const list = this.get()
    items.forEach(item => {
      const index = list.findIndex(x => x[prop] === item[prop])
      if (index > -1) {
        this.vuezy.commit(createMutationName('replaceIn', this.prop), { index, newItem: item })
      } else {
        this.vuezy.commit(createMutationName('addItemTo', this.prop), item)
      }
    })
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
    m[createMutationName('deleteFrom', p)] = (s, index) => {
      s[p].splice(index, 1)
    }
  }
}