const storeKey = 'subMicroStaticRoutes'

// 将子应用的静态路由保存在本地(该方法是用于刷新浏览器后静态路由没有的bug)
export function saveStaticRoutes (name, routes) {
  let subMicroStaticRoutes = {}
  if (localStorage.getItem(storeKey)) {
    subMicroStaticRoutes = JSON.parse(localStorage.getItem(storeKey))
    subMicroStaticRoutes[name] = routes
  } else {
    subMicroStaticRoutes[name] = routes
  }
  localStorage.setItem(storeKey, JSON.stringify(subMicroStaticRoutes))
}

// 将子应用的静态路由注册到主应用的路由中(该方法是直接跳转到静态路由，不是刷新浏览器)
export function registerRoutes (name, routes, props) {
  const { appRouter, Layout } = props
  const asyncResult = {
    path: '/',
    component: Layout,
    children: routes.map(item => {
      return {
        path: `/${name}${item.path}`,
        name: item.name,
        meta: item.meta
      }
    })
  }
  appRouter.addRoutes([asyncResult])
}
