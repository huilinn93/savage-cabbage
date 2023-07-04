import { IDialog } from 'gitart-vue-dialog'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >
  export default component
}


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dialog: IDialog
  }
}

declare module 'vue3-spinner'