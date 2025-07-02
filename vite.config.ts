import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        base: env.VITE_BASE,
        plugins: [
            // tailwindcss(),
            react(),
            tsconfigPaths(),
        ],
    }
})