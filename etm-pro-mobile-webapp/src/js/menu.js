import {getSolution, getSolutionRouter, setSolution, setSolutionButton} from "@/js/localStore";
import {getSolutionList} from "@/service/base/basic";
import {setAsyncRouter} from "@/utils/permiss";
import router from "@/router";

export const getMenuList = () => {
  const solution = getSolution()
  if (!solution) {
    const param = {
      terminalType: 'MOBILE'
    }
    getSolutionList(param).then(res => {
      const data = res.data.data
      let hasHomepage = false
      let homepageUrl = ''
      if (data.solutionList) {
        const buttonList = []
        data.solutionList.forEach(list => {
          if (list.type === 'BUSINESS' && list.resourceList.length) {
            list.resourceList.forEach(item => {
              if (item.identify) {
                const identify = JSON.parse(item.identify)
                if (identify.pageType === 'home') {
                  hasHomepage = true
                  homepageUrl = identify.name
                }
              }
              item.childList.forEach(child => {
                if (child.type === 'BUTTON') {
                  buttonList.push(child)
                }
              })
            })
          }
        })
        setSolution(data.solutionList)
        setSolutionButton(buttonList)
        setAsyncRouter()
        dealLastUrl(hasHomepage, homepageUrl)
      }
    })
  } else {
    let hasHomepage = false
    let homepageUrl = ''
    solution.forEach(list => {
      if (list.type === 'BUSINESS' && list.resourceList.length) {
        list.resourceList.forEach(item => {
          if (item.identify) {
            const identify = JSON.parse(item.identify)
            if (identify.pageType === 'home') {
              hasHomepage = true
              homepageUrl = identify.name
            }
          }
        })
      }
    })
    setAsyncRouter()
    dealLastUrl(hasHomepage, homepageUrl)
  }
}

function dealLastUrl(hasHomepage, homepageUrl) {
  const solutionRouter = getSolutionRouter()
  const lastUrl = sessionStorage.getItem('lastUrl')
  let flag = false
  if (solutionRouter && lastUrl) {
    solutionRouter.forEach(item => {
      if (item.path === lastUrl) {
        flag = true
        const query = JSON.parse(sessionStorage.getItem('lastUrlQuery'))
        for (const i in query) {
          query[i] = decodeURIComponent(query[i])
        }
        if (query) {
          router.replace({
            path: item.path,
            query: query
          })
        } else {
          router.replace(item.path)
        }
        sessionStorage.removeItem('lastUrl')
        sessionStorage.removeItem('lastUrlQuery')
      }
    })
  }
  if (!flag) {
    sessionStorage.removeItem('lastUrl')
    sessionStorage.removeItem('lastUrlQuery')
    if (hasHomepage) {
      router.replace({
        path: homepageUrl
      })
    } else {
      router.replace({
        path: '/workBench'
      })
    }
  }
}
