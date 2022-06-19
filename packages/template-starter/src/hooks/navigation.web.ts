/*
This code activates if you run starter with rn-web engine (-p web -e engine-rn-web | -p tizen | -p webos...) 
*/
import { useNavigate as _useNavigate } from "react-router-dom";


export function useNavigate() {
    const _navigate = _useNavigate()
    function navigate(route) {
        _navigate(route);
    }
    return navigate;
}

export function usePop() {
    const _navigate = _useNavigate()

    function pop() {
        _navigate(-1)
    }
    return pop;
}

export function useOpenDrawer() {
    function openDrawer() {

    }
    return openDrawer;
}
