import { defineConfig } from "vite";
import MonacoEditorNlsPlugin, {
    esbuildPluginMonacoEditorNls,
    Languages,
} from 'vite-plugin-monaco-editor-nls';

import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': resolve('./src'),
        },
    },
    build: {
        sourcemap: true,
    },
    optimizeDeps: {
        /** vite >= 2.3.0 */
        esbuildOptions: {
            plugins: [
                esbuildPluginMonacoEditorNls({
                    locale: Languages.zh_hans,
                }),
            ],
        },
    },
    plugins: [
        MonacoEditorNlsPlugin({locale: Languages.zh_hans}),
    ],
});