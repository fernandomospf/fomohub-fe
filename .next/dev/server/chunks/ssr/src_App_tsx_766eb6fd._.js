module.exports = [
"[project]/src/App.tsx [ssr] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/src_606ca7aa._.js",
  "server/chunks/ssr/[root-of-the-server]__0bebaa22._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/App.tsx [ssr] (ecmascript, next/dynamic entry)");
    });
});
}),
];