import Vuezy from '../../src/index'
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
Vue.use(Vuezy)

beforeEach(() => {
})

function setUp (config) {
  const vuezy = new Vuezy(config)
  const store = new Vuex.Store(vuezy.createStore())
  vuezy.bind(store)
  return {
    wrappers: vuezy.getWrappers(),
    store
  }
}

test('Initialize ObjectList with built-in default value', () => {
  const vuezy = new Vuezy({
    state: {
      myProp: 'ObjectList'
    }
  })
  const state = vuezy.createState()
  expect(state).toEqual({
    myProp: []
  })
})

test('Add items to ObjectList', () => {
  const { wrappers, store } = setUp({
    state: {
      myProp: 'ObjectList'
    }
  })
  wrappers.myProp.add({
    id: 'a',
    name: 'A'
  })
  expect(store.state.myProp).toEqual([
    {
      id: 'a',
      name: 'A'
    }
  ])
})

test('Delete items in ObjectList using deleteAllWhere', () => {
  const { wrappers: { myProp }, store } = setUp({
    state: {
      myProp: 'ObjectList'
    }
  })
  myProp.add({
    id: 'a',
    flag: true,
    name: 'A'
  })
  myProp.add({
    id: 'b',
    flag: false,
    name: 'B'
  })
  myProp.add({
    id: 'c',
    flag: true,
    name: 'C'
  })
  myProp.deleteAllWhere(x => x.flag)
  expect(store.state.myProp).toEqual([
    {
      id: 'b',
      flag: false,
      name: 'B'
    }
  ])
})