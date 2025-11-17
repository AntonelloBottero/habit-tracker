import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    dbName: 'HabiterDatabase',
    dbVersion: '1'
  }
};

export default nextConfig;
