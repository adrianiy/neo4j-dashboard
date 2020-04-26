import { SETUSER, LOGOUT } from "../reducers/user"


const setUser = userObj => {
    return {
        type: SETUSER,
        userData: userObj
    }
}

const logOut = () => {
    return {
        type: LOGOUT
    }
}

export default {
    setUser,
    logOut
}
