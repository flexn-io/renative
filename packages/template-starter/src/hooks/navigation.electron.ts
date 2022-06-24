/*
This code activates if you run starter with rn-electron engine (-p macos -e engine-rn-electron) 
*/
export function useNavigate(navigation) {
    function navigate(route, params?) {
        navigation.navigate(route, params);
    }
    return navigate;
}

export function usePop(navigation) {
    function pop() {
        navigation.pop();
    }
    return pop;
}

export function useOpenDrawer(navigation) {
    function openDrawer(_props: any) {
        navigation.dispatch({ type: 'OPEN_DRAWER' });
    }
    return openDrawer;
}
