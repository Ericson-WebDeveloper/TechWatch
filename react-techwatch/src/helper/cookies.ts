import cookie from 'js-cookie';

export const setCookie = (name: string, value: string) => {
    cookie.set(name, value);
}

export const getCookie = (name: string) => {
    return cookie.get(name);
}


export const removeCookie = (name: string) => {
    cookie.remove(name);
}