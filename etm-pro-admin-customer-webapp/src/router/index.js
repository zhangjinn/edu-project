import customerRouters from './customerRouters'
import staticRouters from 'router/staticRouters'

export const routes = [
  ...staticRouters,
  ...customerRouters,
  {
    path: '*',
    name: '*',
    component: () => import('@/views/preview/preview')
  }
]
