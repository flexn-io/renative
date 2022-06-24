/*
This code activates by default with engine-rn-next (-p web)
*/
import { useRouter } from 'next/router'

export function useNavigate() {
    const router = useRouter()

    function navigate(route) {
        router.push(route)
    }
    return navigate;
}

export function usePop() {
    const router = useRouter()

    function pop() {
        router.back()
    }
    return pop;
}

export function useOpenDrawer() {
    function openDrawer() {

    }
    return openDrawer;
}
