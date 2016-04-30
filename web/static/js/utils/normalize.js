export function arrayToObjMap(array) {
  return array.reduce((objMap, e) => {
    objMap[e.id] = e;
    return objMap;
  }, {});
}

export function arrayToIds(array) {
  return array.map(e => e.id);
}

export default function normalize(array) {
  return {
    ids: arrayToIds(array),
    entities: arrayToObjMap(array),
  };
}
