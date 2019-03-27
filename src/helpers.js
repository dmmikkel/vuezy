function upperFirstChar (s) {
  return s[0].toUpperCase() + s.substr(1)
}

function createMutationName (action, prop) {
  return action + upperFirstChar(prop)
}

function mergeObjects (objs) {
  const result = {}
  objs.forEach(obj => {
    Object.keys(obj).forEach(key => result[key] = obj[key])
  })
  return result
}

export {
  createMutationName,
  mergeObjects
}