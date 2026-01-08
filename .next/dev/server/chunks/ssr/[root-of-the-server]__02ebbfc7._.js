module.exports = [
"[project]/pages/login.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
function LoginPage() {
    // The SPA is mounted in `pages/_app.tsx` via a client-only dynamic import.
    // This page is intentionally empty on the server; the client app (BrowserRouter)
    // will render the actual login UI after hydration.
    return null;
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__02ebbfc7._.js.map