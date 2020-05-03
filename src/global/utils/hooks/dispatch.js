import { useDispatch } from "react-redux"

export const useAsyncDispatch = () => {
    const dispatch = useDispatch();

    return async (action, method) => {
        const result = await method;
        dispatch(action(result));
    }
}
