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
        else props.navigation.pop();
    }
    return pop;
}

export function useOpenDrawer(props) {
    function openDrawer(drawerName) {
        if (props.navigate) props.navigate(drawerName || 'Drawer');
        else props.navigation.dispatch({ type: 'OPEN_DRAWER' });
    }
    return openDrawer;
}
