import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(({mode}) => {
    // @ts-ignore
    const env = loadEnv(mode, process.cwd(), '')
    return {
        base: env.VITE_BASE,
        plugins: [
            // tailwindcss(),
            react(),
            tsconfigPaths(),
        ],
        resolve: {
            alias: {
                "@/core": path.resolve(__dirname, "src/core"),
                "@/shared": path.resolve(__dirname, "src/shared"),
                "@/hooks": path.resolve(__dirname, "src/hooks"),
                "@/components": path.resolve(__dirname, "src/ui/components"),
                "@/features": path.resolve(__dirname, "src/ui/features"),
                "@/resource-icon": path.resolve(__dirname, "src/assets/icons/resources"),
                "@/process-icon": path.resolve(__dirname, "src/assets/icons/processes"),
                "@/icons": path.resolve(__dirname, "src/assets/icons"),
            }
        }
    }
})
