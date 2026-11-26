// lib/auth.js
import { parseCookies, destroyCookie } from 'nookies';

export const PREVIEW_WITHOUT_LOGIN = false;

export function loginUrlFor(path) {
    if (!path || path === '/login') return '/login';
    return `/login?next=${encodeURIComponent(path)}`;
}

export async function withAuth(context) {
    const cookies = parseCookies(context);
    const token = cookies.access;

    if (!token && !PREVIEW_WITHOUT_LOGIN) {
        return {
            redirect: {
                destination: loginUrlFor(context?.resolvedUrl),
                permanent: false,
            },
        };
    }

    // You can also add token validation here

    // Return empty props or other data as needed
    return { };
}

export async function getToken(context) {
    const cookies = parseCookies(context);
    const token = cookies.access;
    return token
}



export async function logout(context) {
    // Remove all cookies by destroying them
    destroyCookie(context, 'access');
    destroyCookie(context, 'refresh');

    return {
        redirect: {
            destination: '/', // Redirect to login page after logout
            permanent: false,
        }
    };
}
