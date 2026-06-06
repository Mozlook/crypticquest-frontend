/// <reference types="vite/client" />

// Typed environment variables. Vite exposes only VITE_-prefixed vars to the
// client; declaring them here gives autocomplete and compile-time checks on
// import.meta.env.
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
