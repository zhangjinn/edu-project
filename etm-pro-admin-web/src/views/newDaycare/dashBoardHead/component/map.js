export default function loadBMap(ak) {
  return new Promise(function(resolve, reject) {
    if (typeof BMap !== 'undefined') {
      // eslint-disable-next-line no-undef
      resolve(BMap)
      return true
    }
    window.onBMapCallback = function() {
      // eslint-disable-next-line no-undef
      resolve(BMap)
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = '//api.map.baidu.com/api?v=3.0&ak=' + ak + '&callback=onBMapCallback'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
