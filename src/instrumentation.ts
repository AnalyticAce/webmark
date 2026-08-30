// webmark:start — added by `npx webmark init`
export async function register() {
  if (process.env.NODE_ENV === "development" && process.env.NEXT_RUNTIME === "nodejs") {
    const { start } = await import("@dshalom/webmark/server");
    await start();
  }
}
// webmark:end
