'use strict';

function upperFirstChar (s) {
  return s[0].toUpperCase() + s.substr(1)
}

function createMutationName (action, prop) {
  return action + upperFirstChar(prop)
}

function mergeObjects (objs) {
  var result = {};
  objs.forEach(function (obj) {
    Object.keys(obj).forEach(function (key) { return result[key] = obj[key]; });
  });
  return result
}

var Bool = function Bool (vuexify, prop) {
  this.vuexify = vuexify;
  this.prop = prop;
};

Bool.prototype.get = function get () {
  return this.vuexify.get(this.prop)
};

Bool.prototype.set = function set (v) {
  if (typeof v !== 'boolean') {
    throw new Error('Value must be of type boolean')
  }
  this.vuexify.commit(createMutationName('set', this.prop), v);
};

Bool.prototype.toggle = function toggle () {
  this.vuexify.commit(createMutationName('set', this.prop), !this.get());
};

Bool.defaultValue = function defaultValue (d) {
  if (typeof d === 'undefined') {
    return false
  }
  if (typeof d !== 'boolean') {
    throw new Error('Default value must be of type boolean')
  }
  return d
};

Bool.createMutations = function createMutations (m, p) {
  m[createMutationName('set', p)] = function (s, v) { return s[p] = v; };
};

var ObjectList = function ObjectList (vuexify, prop) {
  this.vuexify = vuexify;
  this.prop = prop;
};

ObjectList.prototype.get = function get () {
  return this.vuexify.get(this.prop)
};

ObjectList.prototype.set = function set (v) {
  if (!Array.isArray(v)) {
    throw new Error('Value must be an array')
  }
  this.vuexify.commit(createMutationName('set', this.prop), v);
};
  
ObjectList.prototype.add = function add (item) {
  this.vuexify.commit(createMutationName('addItemTo', this.prop), item);
};

ObjectList.prototype.replaceIndex = function replaceIndex (newItem, index) {
  this.vuexify.commit(createMutationName('replaceIn', this.prop), { index: index, newItem: newItem });
};

ObjectList.prototype.replaceWhere = function replaceWhere (newItem, predicate) {
  var list = this.get();
  var index = list.findIndex(predicate);
  if (index > -1) {
    this.vuexify.commit(createMutationName('replaceIn', this.prop), { index: index, newItem: newItem });
  }
};

ObjectList.prototype.replaceById = function replaceById (newItem, prop) {
    if ( prop === void 0 ) prop = 'id';

  var list = this.get();
  var index = list.findIndex(function (x) { return x[prop] === newItem[prop]; });
  if (index === -1) {
    throw new Error('Could not find item with matching id')
  }
  this.vuexify.commit(createMutationName('replaceIn', this.prop), { index: index, newItem: newItem });
};

ObjectList.prototype.replaceOrAddById = function replaceOrAddById (newItem, prop) {
    if ( prop === void 0 ) prop = 'id';

  var list = this.get();
  var index = list.findIndex(function (x) { return x[prop] === newItem[prop]; });
  if (index > -1) {
    this.vuexify.commit(createMutationName('replaceIn', this.prop), { index: index, newItem: newItem });
  } else {
    this.vuexify.commit(createMutationName('addItemTo', this.prop), newItem);
  }
};

ObjectList.defaultValue = function defaultValue (d) {
  if (typeof d === 'undefined') {
    return []
  }
  if (!Array.isArray(d)) {
    throw new Error('Default value must be an array')
  }
  return d
};

ObjectList.createMutations = function createMutations (m, p) {
  m[createMutationName('set', p)] = function (s, v) { return s[p] = v; };
  m[createMutationName('addItemTo', p)] = function (s, v) { return s[p].push(v); };
  m[createMutationName('replaceIn', p)] = function (s, ref) {
      var index = ref.index;
      var newItem = ref.newItem;

    s[p].splice(index, 1, newItem);
  };
};

var types = {
  Bool: Bool,
  bool: Bool,
  boolean: Bool,
  Boolean: Bool,

  ObjectList: ObjectList,
  objectlist: ObjectList,
};

function normalizeStateConfig (stateConfig) {
  var newConfig = {};
  for (var key in stateConfig) {
    var propConfig = stateConfig[key];
    if (typeof propConfig === 'string') {
      newConfig[key] = { type: propConfig };
    } else {
      newConfig[key] = propConfig;
    }
  }
  return newConfig
}

var Vuezy = function Vuezy (ref) {
  var state = ref.state;
  var actions = ref.actions;

  this.state = normalizeStateConfig(state);
  this.actions = actions;
  this.store = null;
  this.namespace = null;
  this.wrappers = {};
};

Vuezy.prototype.getWrappers = function getWrappers () {
  return this.wrappers
};

Vuezy.prototype.get = function get (p) {
  if (this.namespace) {
    return this.store.state[this.namespace][p]
  } else {
    return this.store.state[p]
  }
};

Vuezy.prototype.bind = function bind (store, namespace) {
  if (this.store !== null) {
    throw new Error('Vuezy instance is already bound to a store')
  }

  this.store = store;
  this.namespace = namespace;

  for (var prop in this.state) {
    var def = this.state[prop];
    this.wrappers[prop] = new types[def.type](this, prop);
  }
};

Vuezy.prototype.commit = function commit (c, v) {
  if (this.namespace) {
    this.store.commit(this.namespace + '/' + c, v);
  } else {
    this.store.commit(c, v);
  }
};

Vuezy.prototype.createState = function createState () {
  var state = {};
  for (var prop in this.state) {
    var def = this.state[prop];
    state[prop] = types[def.type].defaultValue(def.default);
  }
  return state
};

Vuezy.prototype.createMutations = function createMutations () {
  var mutations = {};
  for (var prop in this.state) {
    var def = this.state[prop];
    types[def.type].createMutations(mutations, prop);
  }
  return mutations
};

Vuezy.prototype.createActions = function createActions () {
    var this$1 = this;

  var actions = {};
  var loop = function ( actionName ) {
    actions[actionName] = function (fromVuex, v) { return this$1.actions[actionName](mergeObjects([fromVuex, { wrappers: this$1.wrappers }]), v); };
  };

    for (var actionName in this$1.actions) loop( actionName );
  return actions
};

module.exports = Vuezy;
