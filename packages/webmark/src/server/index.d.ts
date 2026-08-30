export interface StartOptions {
  /** Project directory holding `.webmark/comments.json`. Defaults to `process.cwd()`. */
  root?: string;
  /** Suppress the "review comments on :port" line. */
  silent?: boolean;
}

/**
 * Starts the local comment store. Dev only — never call this from a production server.
 * Resolves to the port it bound to, or `null` when every candidate port was taken.
 */
export declare function start(options?: StartOptions): Promise<number | null>;
