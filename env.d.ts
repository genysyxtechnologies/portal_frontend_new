/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/views/spinner/SpinningAnimation.vue' {
  import type { DefineComponent } from 'vue'
  interface Props {
    loading?: boolean
  }
  const component: DefineComponent<Props, {}, any>
  export default component
}
