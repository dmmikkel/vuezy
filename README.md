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
this.$w.people.replaceById(person)
```

## How does it work?

Instead of configuring your store in Vuex, you do it in Vuezy. (Or a combination.)

You specify which data types you want your properties to be,
then Vuezy creates the needed mutations in Vuex,
as well as some handy wrappers that you can use in your actions, components, plugins, etc..

These wrappers are objects that expose convienient methods for mutating the data,
such as `add`, `replaceIndex`, `replaceWhere`, `replaceById`, `addOrReplaceById`, and many more.

All state mutation happen through Vuex commits,
so you don't lose any benefits of the devtool integration with Vuex.

## Getting started

Setting up Vuezy is easy. See the examples below.

### Simple store

#### store-config.js

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import Vuezy from 'vuezy'

Vue.use(Vuex)
Vue.use(Vuezy)

const vuezy = new Vuezy({
  state: {
    firstFlag: { type: 'Bool', default: true },
    secondFlag: 'Bool',
  }
})

const store = new Vuex.Store({
  state: vuezy.createState(),
  mutations: vuezy.createMutations(),
})

vuezy.bind(store)

const wrappers = vuezy.getWrappers()

export default {
  wrappers,
  store
}
```

#### in main.js

```javascript
import storeConfig from './store-config'

new Vue({
  ...storeConfig,
  render: h => h(App)
}).$mount('#app')
```

#### in components

```javascript
export default {
  name: 'MyComponent',
  
  methods: {
    toggleBoth () {
      this.$w.firstFlag.toggle()
      this.$w.secondFlag.toggle()
    },
    setBothTrue () {
      this.$w.firstFlag.set(true)
      this.$w.secondFlag.set(true)
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
Vue.use(Vuezy)

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
  wrappers: {
    a: vuezyA.getWrappers()
  },
  store,
}
```

Namespacing wrappers in the export is optional, regardless of Vuex namespacing.
You can create any structure you want on the wrappers object.

If you want to use modules without namespacing,
make sure you don't send in the namespace property in `.bind(store)`.

## Types

Types are essential in Vuezy as yhey provide the abstraction of Vuex.
Every state property that you define in Vuezy must have a type.

The type determines which underlying javascript type is used, which mutations
are created and which wrapper methods are available.

### Bool

A simple boolean type.

Javascript type: Boolean  
Default value: false

#### .set(value)

Sets the value. Value must be `true` or `false`.

#### .toggle()

Toggles the value between `true` and `false`.

### ObjectList

A list of objects.

Javascript type: Array  
Default value: []

#### .get()

Return the list as an array

#### .getById(id [, prop])

Gets the first record where property prop matches the value of id.
The default value of prop is 'id'.

#### .set(value)

Replace the entire list with a new javascript array.

#### .add(item)

Adds the item to the end of the list.

#### .replaceIndex(item, index)

Replaces item at a specific index in the list.

#### .replaceWhere(item, predicate)

Replaces the first item in the list matching the function in predicate.

#### .replaceById(item [, prop])

Replaces the first item in the list where the value of property 'prop'
matches that of the new item. Default property is 'id'.

#### .addOrReplaceById(item [, prop])

Same as replaceById, except that it will add the new item to the end of
the list if no match is found.

If item parameter is an array, it will be iterated and each object inside
it added separately to the list.

#### .deleteById (id [, prop])

Delete the first record where property prop matches id

### Dictionary

A dictionary of key-value pairs.

Javascript type: Object  
Default value: {}

#### .set(value)

Replace the entire dictionary with a new javascript object.

#### .getKey(key)

Returns the value of the given key.

#### .containsKey(key)

Returns true if the key exists in the dictionary, otherwise returns false.

#### .add(key, value)

Adds a new key-value pair to the dictionary. If the key already exists, its value is replaced.

#### .setKeysToValue(keys, value)

Set multiple keys to the same value. Keys parameter must be an array of keys.

#### .clear()

Removes all key-value pairs in the dictionary