// 解决微前端子应用的静态路由没有页签和刷新后没有激活子应用的bug
const subMicroRoutes = []
const micros = ['opc', 'daycare', 'guardcare', 'newdaycare', 'sacc', 'standardcare', 'neuroo', 'customer']

if (localStorage.getItem('subMicroStaticRoutes')) {
  const routes = JSON.parse(localStorage.getItem('subMicroStaticRoutes'))
  // 删除之前存储的静态路由（换个解决方案了）
  if (Array.isArray(routes)) {
    localStorage.removeItem('subMicroStaticRoutes')
  } else {
    subMicroRoutes.push(...handleSubMicroRoutes(routes))
  }
}

export function handleSubMicroRoutes(routes) {
  let microName
  try {
    microName = location.pathname.match(/^\/(.*?)\//)[1]
  } catch (e) {
    // 解决关闭浏览器后重新打开访问http://localhost:9528/会匹配失败报错进不入页面的bug
    localStorage.removeItem('subMicroStaticRoutes')
    return []
  }
  if (!micros.includes(microName)) console.warn(`${microName}：没有该微应用`)
  const staticRoutes = routes[microName] && routes[microName].map(item => {
    return {
      path: `/${microName}${item.path}`,
      name: item.name + Date.now(), // 随机数是为了避免子路由和主应用路由的name重复，不会影响子应用的路由
      meta: item.meta
    }
  })
  return staticRoutes || []
}

export default subMicroRoutes
