const saveCookie = (user, data) => {
    const expire = new Date()
    expire.setTime(expire.getTime() + 3600000);
    document.cookie = `${user}_langs=${JSON.stringify(data)}; expires=${expire.toUTCString()}; path=/${user}`;
}

const readCookie = user => {
    const result = document.cookie.match(new RegExp(user + '_langs=([^;]+)'));
    if (result) return JSON.parse(result[1]);
    else return null;
}

const clearCookie = user => {
    document.cookie = `${user}_langs=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

const getNickname = () => document.querySelector('.p-nickname').innerText.replace(' ', '');