import { createGlobalStyle } from 'styled-components';

const Reset = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-synthesis: none;
    }

    html, body, #root {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }

    body,
    h1,
    h2,
    h3,
    h4,
    p,
    figure,
    blockquote,
    dl,
    dd {
        margin: 0
    }

    ul, 
    ol {
        list-style: none;
    }

    /* ::-webkit-scrollbar {
        width: 5px;
        height:5px;
        border-radius: 10px;
    }
    ::-webkit-scrollbar-track {
        background: var(--color-islamicGreen);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: var(--color-primary);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: var(--color-nightRider);
    } */

    .PhoneInputInput {
        height: 40px;
        width: 100%;
        border: 1px solid var(--color-ebonyClay);
        border-radius: 6px;
        padding: 0 24px;
        font-size: 14px;
        outline: none;
    }
`;

export default Reset;
