import * as service from './neo.service';
import { getDBSchema } from './schema.service';

describe('schema service test suite', () => {

    beforeEach(() => {
        jest.spyOn(service, 'getQuery').mockImplementation(() => 'test');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('getDbSchema test', async () => {
        const result = await getDBSchema('sess');
        expect(result instanceof Object).toBeTruthy();
        expect(Object.keys(result).length).toBe(5);
    });
})
