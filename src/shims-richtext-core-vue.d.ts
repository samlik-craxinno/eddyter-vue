declare module 'richtext-core-vue' {
  import type { DefineComponent } from 'vue'

  export const EddyterEditor: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >
}
