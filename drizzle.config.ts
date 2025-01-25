import { defineConfig, Config } from 'drizzle-kit'

interface DbCredentials {
  url: string
}

const config: Config = {
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  } as DbCredentials
}

export default defineConfig(config)
