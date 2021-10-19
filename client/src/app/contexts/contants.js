export const LOCAL_STORAGE_TOKEN_NAME = 'userChat';

export const URL_SOCKET = process.env.NODE_ENV !== 'production'
    ? 'http://localhost:9000'
    : 'https://chat-chill.herokuapp.com';
