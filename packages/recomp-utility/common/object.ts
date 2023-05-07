/**
 * Joins two (possibly) nested objects, preferring values of the second argument.
 * It is similar to using `{..left, ...right}` but does it recursively. Also, values
 * of undefined values that are undefined do not have preference
 */
export const structureUnion = (left: any, right: any) => {
  const leftObj = left as any;
  const rightObj = right as any;

  if (rightObj === undefined) {
    return leftObj;
  }
  if (leftObj === undefined) {
    return rightObj;
  }

  let result: any = {};

  if (typeof leftObj === 'object' && leftObj !== null) {
    // Add all left values
    const leftKeys = Object.keys(leftObj);
    for (const lk of leftKeys) {
      result[lk] = structureUnion(leftObj[lk], undefined);
    }
  } else {
    result = leftObj;
  }

  // Add all right values, will override values
  if (typeof rightObj === 'object' && rightObj !== null) {
    const rightKeys = Object.keys(rightObj);
    for (const rk of rightKeys) {
      result[rk] = structureUnion(leftObj[rk], rightObj[rk]);
    }
  } else {
    result = rightObj;
  }

  return result;
};

export const isNullOrWhitespace = (value: any) => {
  if (!value) return true;
  if (typeof value === 'string') {
    if (!value.trim()) {
      return true;
    }
  }
};

const selectFn = {
  keySet: (obj: any) => Object.keys(obj),
  keyCheck: (obj: any, key: any) => obj[key],
  valueSet: (obj: any) => Object.values(obj),
  valueCheck: (_obj: any, key: any) => key,
};

const objectMap = (obj: any, map: any, objSetFn: any, objCheckFn: any) => {
  const res: { [key: string]: any } = {};
  const objKeys = objSetFn(obj);
  const mapKeys = Object.keys(map);
  objKeys.forEach((key: string) => {
    if (objCheckFn(obj, key)) {
      if (mapKeys.includes(key)) {
        res[key] = map[key];
      }
    }
  });
  return res;
};

export const selectAllFromKeys = (obj: any, map: any) => {
  return objectMap(obj, map, selectFn.keySet, selectFn.keyCheck);
};

export const selectAllFromValues = (obj: any, map: any) => {
  return objectMap(obj, map, selectFn.valueSet, selectFn.valueCheck);
};
