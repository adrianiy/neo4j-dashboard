import { parseProperties, createPath, createSegments, createSegment, createRel, createInteger, createNode, createRecord } from './utils';
import Record from "neo4j-driver/lib/record";
import { Path, Node, PathSegment, Relationship } from "neo4j-driver/lib/graph-types";
import Integer from "neo4j-driver/lib/integer";

describe('service/utils test suite', () => {
    const prop = { low: 0, high: 1 };
    const node = { properties: { prop }, identity: prop}
    const relationship = {
        identity: prop,
        start: node,
        end: node,
        properties: { prop }
    }
    const segment = { start: node, end: node, relationship };
    const path = {
        start: node,
        end: node,
        segments: [ segment ],
    };
    describe("parseProperties test suite", () => {
        test("parseProperties test", () => {
            const data = {
                test: prop,
                noObj: 1
            };
            const result = parseProperties(data);
            expect(result.test instanceof Integer).toBeTruthy();
            expect(result.noObj instanceof Integer).toBeFalsy();
        });
    });

    describe("createPath test suite", () => {
        test("createPath test", () => {
            const result = createPath(path);
            expect(result instanceof Path).toBeTruthy();
        });

        test("createPath with null Object", () => {
            try {
                createPath({});
            } catch (err) {
                expect(err.message).toBe('Cannot read property \'length\' of undefined')
            }
        });
    })

    describe("createSegments test suite", () => {
        test("createSegments test", () => {
            const data = [
                segment
            ];
            const result = createSegments(data);
            expect(result.length).toBe(1);
            expect(result[0] instanceof PathSegment).toBeTruthy();
        });

        test("createSegments empty data", () => {
            const data = [];
            const result = createSegments(data);
            expect(result.length).toBe(0);
        })
    });

    describe("createSegment test suite", () => {
        test("createSegment test", () => {
            const result = createSegment(segment);
            expect(result instanceof PathSegment).toBeTruthy();
        });

        test("createSegment with no data", () => {
            const result = createSegment({});
            expect(result instanceof PathSegment).toBeTruthy();
        })
    });

    describe("createRel test suite", () => {
        test("createRel test", () => {
            const result = createRel(relationship);
            expect(result instanceof Relationship).toBeTruthy();
        });

        test("createRel with no data", () => {
            const result = createRel({});
            expect(result instanceof Relationship).toBeTruthy();
        })
    });

    describe("createInteger test suite", () => {
        test("createInteger test", () => {
            const result = createInteger(prop);
            expect(result instanceof Integer).toBeTruthy();
        });

        test("create Integer with no data", () => {
            const result = createInteger({});
            expect(result instanceof Integer).toBeTruthy();
        });
    });

    describe("createNode test suite", () => {
        test("createNode test", () => {
            const result = createNode(node);
            expect(result instanceof Node).toBeTruthy();
        });

        test("createNode with no data", () => {
            const result = createNode({});
            expect(result instanceof Node).toBeTruthy();
        });
    });

    describe("createRecord test suite", () => {
        test("createRecord test", () => {
            const result = createRecord({
                keys: [],
                _fields: [
                    { segments: [segment] },
                    {relationship},
                    node,
                    { identity: prop, start: node, end: node },
                    { properties: { prop } },
                    null
                ]
            });
            expect(result instanceof Record).toBeTruthy();
        })
    })
})
