import { useState } from "react";

export function useLocalStorageState(key, defaultValue) {
    const [state, setState] = useState(() => {
        let value = localStorage.getItem(key);
        if (value) return JSON.parse(value);
        else return defaultValue;
    });
    function setLocalStorageState(val) {
        if (typeof val === "function") val = val(state);
        if (val === null) localStorage.removeItem(key);
        else if (val === undefined) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(val));
        setState(val);
    }
    return [state, setLocalStorageState];
}