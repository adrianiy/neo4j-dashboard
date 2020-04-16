export const cls = classNames => classNames.join(' ');

export const deepEquals = (x, y) => {
    if (x && y && typeof x === "object" && typeof y === "object") {
        if (Object.keys(x).length !== Object.keys(y).length) return false;
        return Object.keys(x).every((key) => deepEquals(x[key], y[key]));
    }
    if (typeof x === "function" && typeof y === "function") {
        return x.toString() === y.toString();
    }
    return x === y;
};

export const optionalToString = (v) =>
    ![null, undefined].includes(v) && typeof v.toString === "function" ? v.toString() : v;

export const hasReservedProp = (obj, propName) => Object.prototype.hasOwnProperty.call(obj, propName);

export const safetlyAddObjectProp = (obj, prop, val) => {
    obj = escapeReservedProps(obj, prop);
    obj[prop] = val;
    return obj;
};
const getEscapedObjectProp = (prop) => `\\${prop}`;
const getUnescapedObjectProp = prop =>
  prop.indexOf('\\') === 0 ? prop.substr(1) : prop // A bit weird because of escape chars

export const safetlyRemoveObjectProp = (obj, prop) => {
    if (!hasReservedProp(obj, prop)) {
        return obj;
    }
    delete obj[prop];
    obj = unEscapeReservedProps(obj, prop);
    return obj;
};

export const escapeReservedProps = (obj, prop) => {
    if (!hasReservedProp(obj, prop)) {
        return obj;
    }
    obj = safetlyAddObjectProp(obj, getEscapedObjectProp(prop), obj[prop]);
    delete obj[prop];
    return obj;
};

export const unEscapeReservedProps = (obj, prop) => {
    let propName = getEscapedObjectProp(prop);
    if (!hasReservedProp(obj, propName)) {
        return obj;
    }
    while (true) {
        if (!hasReservedProp(obj, propName)) {
            break;
        }
        obj[getUnescapedObjectProp(propName)] = obj[propName];
        delete obj[propName];
        propName = getEscapedObjectProp(propName);
    }
    return obj;
};
