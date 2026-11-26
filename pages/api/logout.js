import { destroyCookie } from 'nookies';

export default function handler(req, res) {
    // Destroy cookies on the server-side
    destroyCookie({ res }, 'access');
    destroyCookie({ res }, 'refresh');

    // Redirect to the login page
    res.writeHead(302, { Location: '/' });
    res.end();
}