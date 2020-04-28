export const SETUSER = "SET_USER";
export const LOGOUT = "LOG_OUT";

const userStore = (state = { loggedIn: false }, action) => {
    switch (action.type) {
        case SETUSER:
            return {
                ...state,
                ...action.userData,
                loggedIn: true,
            };
        case LOGOUT:
            return {
                ...state,
                ...{
                    user: null,
                    sessionId: null
                },
                loggedIn: false,
            };
        default:
            return state;
    }
};

export default userStore;
