export function useNavigate(props) {
    function navigate(route, pathname, opts, params) {
        // Reach Router
        if (props?.navigate) props.navigate(route, opts);
        // React Navigation
        else if (props?.navigation) props.navigation.navigate(route, params);
        // Next Router
        else if (props.router) {
            props.router.push(pathname, route);
        }
    }
    return navigate;
}

export function usePop(props) {
    function pop() {
        // Reach Router
        if (props?.navigate) props.navigate('../', { replace: false });
        // React Navigation
        else if (props?.navigation) props.navigation.pop();
        // Next Router
        else if (props.router) props.router.back();
    }
    return pop;
}

export function useOpenDrawer(props) {
    function openDrawer(drawerName) {
        if (props?.navigate) props.navigate(drawerName || 'Drawer');
        else if (props?.navigation) props.navigation.dispatch({ type: 'OPEN_DRAWER' });
    }
    return openDrawer;
}
