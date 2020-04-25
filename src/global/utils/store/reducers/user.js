const currentUser = (state = { loggedIn: false }, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                ...action.payload,
                loggedIn: true,
            };
        case "LOG_OUT":
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

export default currentUser;
