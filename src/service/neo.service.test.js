import * as service from './neo.service';

describe('neo service doLogin test suite', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('doLogin ok test', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({ json: () => 'test', ok: true }));
        const result = await service.doLogin();
        expect(result).toBe('test');
    });

    test("doLogin ko test", async () => {
        jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({ json: () => "test", ok: false }));
        const result = await service.doLogin();
        expect(result).toBe(null);
    });
});

describe('neo service doLogout test suite', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("doLogout ok test", async () => {
        jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({ json: () => "test", ok: true }));
        const result = await service.doLogout();
        expect(result).toBe("test");
    });

    test("doLogin ko test", async () => {
        jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({ json: () => "test", ok: false }));
        const result = await service.doLogout();
        expect(result).toBe(null);
    });
});

describe('neo service getQuery test suite', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("getQuery ok test", async () => {
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => ({
                    records: [
                        {
                            keys: [],
                            _fields: [
                                { segments: [] },
                                { properties: { prop: { low: 0, high: 1 } } },
                                null,
                            ],
                        },
                    ],
                    summary: "test",
                }),
                ok: true,
            })
        );
        const result = await service.getQuery();
        expect(result.summary).toBe("test");
        expect(result.records.length).toBe(1);
    });

    test("getQuery ko test", async () => {
        try {
            jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({ json: () => ({ message: 'test' }), ok: false }));
            await service.getQuery();
        } catch (err) {
            expect(err).toBe('test');
        }
    });
})
