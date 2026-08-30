// webmark:start — added by `npx webmark init`
if (process.env.NODE_ENV === "development") {
  import("@dshalom/webmark/client").then(({ webmark }) => webmark());
}
// webmark:end
