import type { NextConfig } from "next";

/**
 * DB versions
 * #2
 * - habits: manage_from field added
 */

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    dbName: 'HabiterDatabase',
    dbVersion: '2'
  }
};

export default nextConfig;
