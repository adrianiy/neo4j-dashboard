import actions from "./actions"
import { store } from "./store"

describe('store test suite', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    })

    describe('db store test suite', () => {
        test('setProperties test', () => {
            store.dispatch(actions.db.setProperties({ test: 'test' }));
            expect(store.getState().dbSchema).toEqual({ test: 'test' });
        })
    });

    describe('graph store test suite', () => {
        test('updateStyle test', () => {
            store.dispatch(
                actions.graph.updateStyle({
                    relationship: {
                        "text-color-external": 'yellow',
                    },
                })
            );
            expect(store.getState().graph.rules[1].props['text-color-external']).toBe('yellow');
        });

        test('updateSelectorStyle test', () => {
            store.dispatch(actions.graph.updateSelector('relationship', { 'text-color-external': 'blue' }));
            expect(store.getState().graph.rules[2].props["text-color-external"]).toBe("blue");
        })
    });

    describe('theme store test suite', () => {
        test('setAutoTheme test before 20:00', () => {
            const mockDate = new Date("2020-04-07T15:20:30Z");
            jest.spyOn(global, "Date").mockImplementation(() => mockDate);
            store.dispatch(actions.theme.setAutoTheme());
            expect(store.getState().theme['_id']).toBe('auto');
            expect(store.getState().theme.id).toBe('light');
        });

        test("setAutoTheme test after 20:00", () => {
            const mockDate = new Date("2020-04-07T20:20:30Z");
            jest.spyOn(global, "Date").mockImplementation(() => mockDate);
            store.dispatch(actions.theme.setAutoTheme());
            expect(store.getState().theme["_id"]).toBe("auto");
            expect(store.getState().theme.id).toBe("dark");
        });

        test('setCustomTheme test', () => {
            store.dispatch(actions.theme.setCustomTheme('light'));
            expect(store.getState().theme['_id']).toBe('light');
        });

        test('setSize test', () => {
            store.dispatch(actions.theme.setSize('large'));
            expect(store.getState().theme.size).toBe('large');
        });

        test('toggleFullscreen test', () => {
            store.dispatch(actions.theme.toggleFullScreen());
            expect(store.getState().theme.fullscreen).toBeTruthy();
        });
    });

    describe('user store test suite', () => {
        test('setUser test', () => {
            store.dispatch(actions.user.setUser({ test: 'test' }));
            expect(store.getState().user.test).toBe('test');
            expect(store.getState().user.loggedIn).toBeTruthy();
        });

        test("logout test", () => {
            store.dispatch(actions.user.logOut());
            expect(store.getState().user.user).toBe(null);
            expect(store.getState().user.loggedIn).toBeFalsy();
        });
    })
})
