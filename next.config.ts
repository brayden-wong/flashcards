/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from "next";
import "./src/env.js";

// /** @type {import("next").NextConfig} */
const config: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "dua11yl42q.ufs.sh" }],
  },
};

export default config;
