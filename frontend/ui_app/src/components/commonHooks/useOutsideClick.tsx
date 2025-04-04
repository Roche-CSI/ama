import { useEffect } from 'react';

const useOutsideClick : (ref: any, callback: Function) => void 
    = (ref, callback) => {
    const handleClick = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClick)

        return () => {
            document.removeEventListener("click", handleClick)
        }
    })
}

export default useOutsideClick;