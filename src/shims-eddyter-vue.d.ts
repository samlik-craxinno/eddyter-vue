declare module '@eddyter/vue' {
  import type { DefineComponent } from 'vue'
  import type {
    EddyterApiResponse,
    EddyterCurrentUser,
    EddyterEditorOptions,
    EddyterInstance,
    EddyterToolbarConfig,
  } from '@eddyter/core'

  export interface EddyterProps {
    modelValue?: string
    apiKey: string
    customVerifyKey?: (key: string) => Promise<EddyterApiResponse>
    user?: EddyterCurrentUser
    mode?: 'edit' | 'preview'
    darkMode?: boolean
    class?: string
    containerClass?: string
    contentClass?: string
    floatingToolbarClass?: string
    style?: Record<string, string | number>
    toolbar?: EddyterToolbarConfig
    editor?: EddyterEditorOptions
    defaultFontFamilies?: string[]
    mentionUserList?: string[]
    enableReactNativeBridge?: boolean
  }

  export interface EddyterExposed {
    getInstance(): EddyterInstance | null
  }

  export const Eddyter: DefineComponent<
    EddyterProps,
    EddyterExposed,
    unknown
  >

  const plugin: { install: (app: import('vue').App) => void }
  export default plugin
}
