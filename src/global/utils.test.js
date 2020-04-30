import { cls, optionalToString, concatUniqueStrings, debounce } from "./utils";

describe('cls test suite', () => {
    test('cls test', () => {
        const result = cls('test', 'test2');
        expect(result).toEqual('test test2')
    });
});

describe('optionalToString test suite', () => {
    test('ok test', () => {
        const result = optionalToString(1);
        expect(result).toBe('1')
    })

    test('ko test',() => {
        const result = optionalToString(null);
        expect(result).toBe(null);

        const result2 = optionalToString(() => 'test');
        expect(result2 instanceof String).toBeFalsy();
    });
});

describe('concatenateUniqueStrings test suite', () => {
    test('unique test', () => {
        const result = concatUniqueStrings('test', ['a', 'b']);
        expect(result).toEqual(['test', 'a', 'b']);
    });

    test("unique null test", () => {
        const result = concatUniqueStrings('test', ["a", null]);
        expect(result).toEqual(["test", "a", null]);
    });

    test("not unique test", () => {
        const result = concatUniqueStrings("test", ["a", "test"]);
        expect(result).toEqual(["test", "a"]);
    });
});

describe('debounce test suite', () => {
    test('debouce test', () => {
        const debounced = debounce(() => 'test', 300);
        const result = debounced();
        setTimeout(() => expect(result).toBe('test'), 301);
    });

    test("debouce ko test", () => {
        const debounced = debounce(() => "test", 300);
        const result = debounced();
        setTimeout(() => expect(result).toBe(null), 200);
    });

    test('debounce twice test', () => {
        const debounced = debounce((text) => text, 300);
        let result = debounced('a');
        debounced('test');
        setTimeout(() => expect(result).toBe("test"), 301);
    })
})
