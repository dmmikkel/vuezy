# Vuezy

Making Vuex fun and easy

## Installation

`npm i --save vuezy`

## What does it do?

Vuezy is a layer on top of Vuex that creates mutations for you and makes it easier to commit them.

__Before:__

```javascript
const state = {
  people: []
}

const mutations = {
  setPeople (state, people) {
    state.people = people
  },
  replaceInPeople (state, { index, person }) {
    state.people.splice(index, 1, person)
  }
  // etc...
}
```

__With Vuezy:__

```javascript
const state = {
  people: 'ObjectList'
}
```

Vuezy also makes mutating the store easier:

__Before:__

```javascript
const index = this.people.findIndex(x => x.id === person.id)
this.$store.commit('replaceInPeople', { index, person })
```

__With Vuezy:__

```javascript
people.replaceById(person)
```

## How does it work?

Instead of configuring your store in Vuex, you do it in Vuezy. (Or a combination.)

You specify which data types you want your properties to be,
then Vuezy creates the needed mutations in Vuex,
as well as some handy wrappers that you can use in your actions, components, plugins, etc..

These wrappers are objects that expose convienient methods for mutating the data,
such as `add`, `replaceIndex`, `replaceWhere`, `replaceById`, `replaceOrAddById`, and many more.

All state mutation happen through Vuex commits,
so you don't lose any benefits of the devtool integration with Vuex.

## Getting started

Setting up Vuezy is easy. See the examples below.

### Simple store

#### store.js

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import Vuezy from 'vuezy'

Vue.use(Vuex)

const vuezy = new Vuezy({
  state: {
    firstFlag: { type: 'Bool', default: true },
    secondFlag: 'Bool',
  }
})

const vueStore = new Vuex.Store({
  state: vuezy.createState(),
  mutations: vuezy.createMutations(),
})

vuezy.bind(vueStore)

const wrappers = vuezy.getWrappers()

export default {
  ...wrappers,
  vueStore
}
```

#### in main.js

```javascript
import store from './store'

new Vue({
  router,
  store: store.vueStore,
  render: h => h(App)
}).$mount('#app')
```

#### in components

```javascript
import store from '@/store'

export default {
  name: 'MyComponent',
  
  methods: {
    toggleBoth () {
      store.firstFlag.toggle()
      store.secondFlag.toggle()
    },
    setBothTrue () {
      store.firstFlag.set(true)
      store.secondFlag.set(true)
    }
  }
}
```

### Using actions and getters

TODO

### Using modules

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import Vuezy from 'vuezy'

Vue.use(Vuex)

const vuezyA = new Vuezy({
  state: {
    flagOne: 'Bool',
    flagTwo: 'Bool',
  }
})

const moduleA = {
  namespaced: true,
  state: vuezyA.createState(),
  mutations: vuezyA.createMutations(),
}

const store = new Vuex.Store({
  modules: {
    a: moduleA
  }
})

vuezyA.bind(store, 'a')

export default {
  a: vuezyA.getWrappers(),
  store,
}
```