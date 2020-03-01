

export function useNavigate(props) {
    function navigate(route, opts, params) {
        props.navigate(route, opts);
    }
    return navigate;
}


export function usePop(props) {
    function pop() {
        props.navigate('../', { replace: false });
    }
    return pop;
}
