import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
  }
})
//https://www.youtube.com/watch?v=Pk3ORvGarT0&list=PLB_Wd4-5SGAYsxD4JGaVdXll3PnoyI-AM&index=4 12.30