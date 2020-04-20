export const cls = (...classNames) => classNames.join(' ');

export const optionalToString = (v) =>
    ![null, undefined].includes(v) && typeof v.toString === "function" ? v.toString() : v;

export const concatUniqueStrings = (value, accum) =>
    [value.trim()].concat(accum.filter(ac => (ac || '').trim() !== value.trim()));


