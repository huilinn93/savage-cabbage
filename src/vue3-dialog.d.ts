import { IDialog } from 'gitart-vue-dialog'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dialog: IDialog
  }
}