import { defineConfig, presetAttributify, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  mergeSelectors: false,
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
