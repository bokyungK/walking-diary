import { atom } from 'recoil';

export const apiUrlState = atom({
    key: 'apiUrl',
    default: 'http://localhost:3001/',
});
// https://api.walking-diary-server.site/

export const opacityState = atom({
    key: 'backgroundOpacity',
    default: 0,
});

export const locationState = atom({
    key: 'checkLocation',
    default: false,
});

export const noticeState = atom({
    key: 'notice',
    default: '',
})

export const noticeIconState = atom({
    key: 'noticeIcon',
    default: '',
})

export const displayState = atom({
    key: 'display',
    default: 'none',
})

export const messageState = atom({
    key: 'checkMessage',
    default: { display: 'none' },
})

export const messageOptionState = atom({
    key: 'option',
    default: {
        cancel: '취소',
        submit: '확인',
    },
})