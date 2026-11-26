export const ImageURL = "/media/images/"
export const WordPressURL = "https://blog.dolox.ir/wp-json/wp/v2/"

const isDev = process.env.NODE_ENV === "development"

// Use direct backend URL in development (both server & client)
// Backend must allow CORS from http://localhost:3000
// Browser will show cert warning for https://localhost:7165 - accept it
export const BackendURL = isDev ? "https://localhost:7165/" : "https://api.dolox.ir/"

export const ApiBaseURL = BackendURL.replace(/\/$/, "")
/** Proxied via next.config rewrites — same origin avoids CORS on negotiate */
export const ChatHubPath = "/chatHub"