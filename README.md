# Vuezy

Making Vuex fun and easy

## What does it do?

Vuezy is a layer on top of Vuex that creates mutations for you and makes it easier to commit them.

Before:

```
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

With Vuezy:

```
const state = {
  people: 'ObjectList'
}
```

Vuezt also makes mutating the store easier.

Before:

```
const index = this.people.findIndex(x => x.id === person.id)
this.$store.commit('replaceInPeople', { index, person })
```

With Vuezy:

```
people.replaceById(person)
```