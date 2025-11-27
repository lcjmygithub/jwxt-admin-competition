/*
 * @Author: lcj
 * @Date: 2025-04-16 21:47:01
 * @LastEditTime: 2025-04-17 09:29:18
 * @LastEditors: lcj
 * @Description: 
 */

import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    presetWebFonts,
    transformerDirectives,
    transformerVariantGroup,
} from "unocss";

export default defineConfig({
    rules: [
        [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px` })],
        [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` })],
        [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` })],
        [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d}px` })],
        [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px` })],
        [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d}px` })],
        [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px` })],
        [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d}px` })],
        // 字体颜色规则
        [/^text-(\w+)$/, ([, color]) => ({ color })],

        // 背景颜色规则
        [/^bg-(\w+)$/, ([, color]) => ({
            backgroundColor: color,
            color: '#fff', // 默认文字颜色
        })],

        // 圆角规则
        [/^rounded-(\w+)$/, ([, size]) => {
            const sizes = { sm: '4px', md: '8px', lg: '16px' };
            return { borderRadius: sizes[size] || '0px' };
        }],
    ],
    shortcuts: {
        "flex-center": "flex justify-center items-center",
        "flex-x-center": "flex justify-center",
        "flex-y-center": "flex items-center",
        "wh-full": "w-full h-full",
        "flex-x-between": "flex items-center justify-between",
        "flex-x-end": "flex items-center justify-end",
        "absolute-lt": "absolute left-0 top-0",
        "absolute-rt": "absolute right-0 top-0 ",
        "fixed-lt": "fixed left-0 top-0",
    },
    theme: {
        colors: {
            primary: "var(--el-color-primary)",
            primary_dark: "var(--el-color-primary-light-5)",
        },
    },
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons(),
        presetTypography(),
        presetWebFonts({
            fonts: {
                // ...
            },
        }),
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()],
});
