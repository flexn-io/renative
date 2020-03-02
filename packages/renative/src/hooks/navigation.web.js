

export function useNavigate(props) {
    function navigate(route, opts, params) {
        if (props.navigate) props.navigate(route, opts);
        else props.navigation.navigate(route, params);
    }
    return navigate;
}


export function usePop(props) {
    function pop() {
        if (props.navigate) props.navigate('../', { replace: false });
        props.navigation.pop();
    }
    return pop;
}
