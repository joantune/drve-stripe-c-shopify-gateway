export const getRandomArbitrary = function (min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
};

export const areDatesEqual = function(d1: Date|undefined, d2: Date|undefined) : boolean {
  if(d1 == undefined && d2 != undefined || d1 != undefined && d2 == undefined) {
    return false;
  }
  if(d1 == undefined && d2 == undefined) {
    return true;
  }
  return d1!.getTime() == d2!.getTime();
}

export const tryXTimes = function <T>(maxTimesToTry: number, functionToExecute: Function, secondsSleepBetweenTries: number = 2): T | null {
  let timesTried = 0;
  while (timesTried < maxTimesToTry) {
    timesTried++;
    try {
      return functionToExecute();
    } catch (ex) {
      console.warn(`Tried to run ${functionToExecute} - got exception. 
            Ex message: ${ex.message} 
            Stack trace: ${ex.stacktrace}`);
      //TODO sleep secondsSleepBetweenTries seconds
    }
  }

  return null;

};

export const logErrorAndReject = function (message: string): Promise<any> {
  console.error(message);
  return Promise.reject(message);
};

export const errorToString = function (obj: Partial<Error>) {
  if (obj == null) {
    return "**null**";
  }
  return `Exception/err: ${obj.message}\n
    Stacktrace: ${obj.stack}`;
};

/* tslint:disable */
function stringify(val: any, depth: number, space?: number) {
  depth = isNaN(+depth) ? 1 : depth;

  function _build(key: string, val: any, depth: number, o?: any, a?: any) { // (JSON.stringify() has it's own rules, which we respect here by using it for property iteration)
    return !val || typeof val != 'object'
        ? val
        : (a = Array.isArray(val), JSON.stringify(val, function (k, v) {
          if (a || depth > 0) {
            if (!k) return (a = Array.isArray(v), val = v);
            !o && (o = a ? [] : {});
            o[k] =
                _build(k, v, a ? depth : depth - 1);
          }
        }), o || (a ? [] : {}));
  }

  return JSON.stringify(_build('', val, depth), null, space);
}

/* eslint-enable no-param-reassign */
export const prettyPrint = function (obj: any, depth ?: number) {
  if (depth != undefined) {
    return stringify(obj, depth, 2);
  }
  return JSON.stringify(obj, undefined, 2);
};
    