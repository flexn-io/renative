

export function useNavigate(props) {
    function navigate(route, opts, params) {
        props.navigation.navigate(route, params);
    }
    return navigate;
}

export function usePop(props) {
    function pop() {
        props.navigation.pop();
    }
    return pop;
}
