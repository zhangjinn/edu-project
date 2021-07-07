<template>
  <div class="preview-image">
    <img :src="item.url" alt="">
  </div>
</template>

<script>
export default {
  name: 'PreviewImage',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
.preview-image{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;

  img {
    display: block;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>

<!--<template>-->
<!--  &lt;!&ndash; 这段html代码，是用来显示图片弹出层的，是由photoswipe提供的 &ndash;&gt;-->
<!--  &lt;!&ndash; Root element of PhotoSwipe. Must have class pswp. &ndash;&gt;-->
<!--  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">-->

<!--    &lt;!&ndash; Background of PhotoSwipe.-->
<!--         It's a separate element as animating opacity is faster than rgba(). &ndash;&gt;-->
<!--    <div class="pswp__bg" />-->

<!--    &lt;!&ndash; Slides wrapper with overflow:hidden. &ndash;&gt;-->
<!--    <div class="pswp__scroll-wrap">-->

<!--      &lt;!&ndash; Container that holds slides.-->
<!--          PhotoSwipe keeps only 3 of them in the DOM to save memory.-->
<!--          Don't modify these 3 pswp__item elements, data is added later on. &ndash;&gt;-->
<!--      <div class="pswp__container">-->
<!--        <div class="pswp__item" />-->
<!--        <div class="pswp__item" />-->
<!--        <div class="pswp__item" />-->
<!--      </div>-->

<!--      &lt;!&ndash; Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. &ndash;&gt;-->
<!--      <div class="pswp__ui pswp__ui&#45;&#45;hidden">-->

<!--        <div class="pswp__top-bar">-->

<!--          &lt;!&ndash;  Controls are self-explanatory. Order can be changed. &ndash;&gt;-->

<!--          <div class="pswp__counter" />-->

<!--          <button class="pswp__button pswp__button&#45;&#45;close" title="Close (Esc)" />-->

<!--          &lt;!&ndash;          <button class="pswp__button pswp__button&#45;&#45;share" title="Share" />&ndash;&gt;-->

<!--          <button class="pswp__button pswp__button&#45;&#45;fs" title="Toggle fullscreen" />-->

<!--          <button class="pswp__button pswp__button&#45;&#45;zoom" title="Zoom in/out" />-->

<!--          &lt;!&ndash; Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR &ndash;&gt;-->
<!--          &lt;!&ndash; element will get class pswp__preloader&#45;&#45;active when preloader is running &ndash;&gt;-->
<!--          <div class="pswp__preloader">-->
<!--            <div class="pswp__preloader__icn">-->
<!--              <div class="pswp__preloader__cut">-->
<!--                <div class="pswp__preloader__donut" />-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="pswp__share-modal pswp__share-modal&#45;&#45;hidden pswp__single-tap">-->
<!--          <div class="pswp__share-tooltip" />-->
<!--        </div>-->

<!--        <button class="pswp__button pswp__button&#45;&#45;arrow&#45;&#45;left" title="Previous (arrow left)" />-->
<!--        <button class="pswp__button pswp__button&#45;&#45;arrow&#45;&#45;right" title="Next (arrow right)" />-->

<!--        <div class="pswp__caption">-->
<!--          <div class="pswp__caption__center" />-->
<!--        </div>-->

<!--      </div>-->

<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--// 引入photoswipe的js和css文件-->
<!--import PhotoSwipe from 'photoswipe/dist/photoswipe'-->
<!--import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'-->
<!--import 'photoswipe/dist/photoswipe.css'-->
<!--import 'photoswipe/dist/default-skin/default-skin.css'-->

<!--export default {-->
<!--  name: 'ZeroPhotoSwipe',-->
<!--  methods: {-->
<!--    /**-->
<!--     * 父组件调用初始化图片弹出层-->
<!--     * photoswipe提供的方法，这里没有做任何修改，直接拿来用了-->
<!--     * @param gallerySelector-->
<!--     */-->
<!--    initPhotoSwipeFromDOM(gallerySelector) {-->
<!--      // parse slide data (url, title, size ...) from DOM elements-->
<!--      // (children of gallerySelector)-->
<!--      const parseThumbnailElements = function(el) {-->
<!--        const thumbElements = document.querySelectorAll('.prevImg')-->
<!--        const numNodes = thumbElements.length-->
<!--        const items = []-->
<!--        let figureEl-->
<!--        let linkEl-->
<!--        let size-->
<!--        let item-->

<!--        for (let i = 0; i < numNodes; i++) {-->
<!--          figureEl = thumbElements[i] // <figure> element-->

<!--          // include only element nodes-->
<!--          if (figureEl.nodeType !== 1) {-->
<!--            continue-->
<!--          }-->

<!--          linkEl = figureEl.children[0] // <a> element-->

<!--          size = linkEl.getAttribute('data-size').split('x')-->

<!--          // create slide object-->
<!--          item = {-->
<!--            src: linkEl.getAttribute('href'),-->
<!--            w: parseInt(size[0], 10),-->
<!--            h: parseInt(size[1], 10)-->
<!--          }-->

<!--          // 图片信息-->
<!--          if (figureEl.children.length > 1) {-->
<!--            // <figcaption> content-->
<!--            item.title = figureEl.children[1].innerHTML-->
<!--          }-->

<!--          if (linkEl.children.length > 0) {-->
<!--            // <img> thumbnail element, retrieving thumbnail url-->
<!--            // item.msrc = linkEl.children[0].getAttribute('src')-->
<!--            item.msrc = linkEl.getAttribute('href')-->
<!--          }-->

<!--          item.el = figureEl // save link to element for getThumbBoundsFn-->
<!--          items.push(item)-->
<!--        }-->

<!--        return items-->
<!--      }-->

<!--      // find nearest parent element-->
<!--      const closest = function closest(el, fn) {-->
<!--        return el && (fn(el) ? el : closest(el.parentNode, fn))-->
<!--      }-->

<!--      // triggers when user clicks on thumbnail-->
<!--      const onThumbnailsClick = function(e) {-->
<!--        e = e || window.event-->
<!--        e.preventDefault ? e.preventDefault() : e.returnValue = false-->

<!--        const eTarget = e.target || e.srcElement-->

<!--        // find root element of slide-->
<!--        const clickedListItem = closest(eTarget, function(el) {-->
<!--          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE')-->
<!--        })-->

<!--        if (!clickedListItem) {-->
<!--          return-->
<!--        }-->

<!--        const j_item = closest(eTarget, function(el) {-->
<!--          return ((el.getAttribute('class') || ' ').split(' ').includes('fileItem'))-->
<!--        })-->

<!--        // find index of clicked item by looping through all child nodes-->
<!--        // alternatively, you may define index via data- attribute-->
<!--        const clickedGallery = j_item.parentNode-->
<!--        const childNodes = j_item.parentNode.childNodes-->
<!--        const numChildNodes = childNodes.length-->
<!--        let nodeIndex = 0-->
<!--        let index-->

<!--        for (let i = 0; i < numChildNodes; i++) {-->
<!--          if (childNodes[i].querySelector('figure')) {-->
<!--            if (childNodes[i].querySelector('figure').nodeType !== 1) {-->
<!--              continue-->
<!--            }-->

<!--            if (childNodes[i].querySelector('figure') === clickedListItem) {-->
<!--              index = nodeIndex-->
<!--              break-->
<!--            }-->
<!--            nodeIndex++-->
<!--          }-->
<!--        }-->
<!--        if (index >= 0) {-->
<!--          // open PhotoSwipe if valid index found-->
<!--          openPhotoSwipe(index, clickedGallery)-->
<!--        }-->
<!--        return false-->
<!--      }-->

<!--      // parse picture index and gallery index from URL (#&pid=1&gid=2)-->
<!--      const photoswipeParseHash = function() {-->
<!--        const hash = window.location.hash.substring(1)-->
<!--        const params = {}-->

<!--        if (hash.length < 5) {-->
<!--          return params-->
<!--        }-->

<!--        const vars = hash.split('&')-->
<!--        for (let i = 0; i < vars.length; i++) {-->
<!--          if (!vars[i]) {-->
<!--            continue-->
<!--          }-->
<!--          const pair = vars[i].split('=')-->
<!--          if (pair.length < 2) {-->
<!--            continue-->
<!--          }-->
<!--          params[pair[0]] = pair[1]-->
<!--        }-->

<!--        if (params.gid) {-->
<!--          params.gid = parseInt(params.gid, 10)-->
<!--        }-->

<!--        return params-->
<!--      }-->

<!--      const openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {-->
<!--        const pswpElement = document.querySelectorAll('.pswp')[0]-->
<!--        let gallery = null-->

<!--        const items = parseThumbnailElements(galleryElement)-->

<!--        // define options (if needed)-->
<!--        const options = {-->
<!--          bgOpacity: 1,-->
<!--          // define gallery index (for URL)-->
<!--          galleryUID: galleryElement.getAttribute('data-pswp-uid'),-->

<!--          getThumbBoundsFn: function(index) {-->
<!--            // See Options -> getThumbBoundsFn section of documentation for more info-->
<!--            const thumbnail = items[index].el.getElementsByTagName('img')[0] // find thumbnail-->
<!--            const pageYScroll = window.pageYOffset || document.documentElement.scrollTop-->
<!--            const rect = thumbnail.getBoundingClientRect()-->

<!--            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }-->
<!--          }-->
<!--        }-->

<!--        // PhotoSwipe opened from URL-->
<!--        if (fromURL) {-->
<!--          if (options.galleryPIDs) {-->
<!--            // parse real index when custom PIDs are used-->
<!--            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url-->
<!--            for (let j = 0; j < items.length; j++) {-->
<!--              if (items[j].pid === index) {-->
<!--                options.index = j-->
<!--                break-->
<!--              }-->
<!--            }-->
<!--          } else {-->
<!--            // in URL indexes start from 1-->
<!--            options.index = parseInt(index, 10) - 1-->
<!--          }-->
<!--        } else {-->
<!--          options.index = parseInt(index, 10)-->
<!--        }-->

<!--        // exit if index not found-->
<!--        if (isNaN(options.index)) {-->
<!--          return-->
<!--        }-->

<!--        if (disableAnimation) {-->
<!--          options.showAnimationDuration = 0-->
<!--        }-->

<!--        // Pass data to PhotoSwipe and initialize it-->
<!--        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)-->
<!--        gallery.init()-->
<!--      }-->

<!--      // loop through all gallery elements and bind events-->
<!--      const galleryElements = document.querySelectorAll(gallerySelector)-->

<!--      for (let i = 0, l = galleryElements.length; i < l; i++) {-->
<!--        galleryElements[i].setAttribute('data-pswp-uid', i + 1)-->
<!--        galleryElements[i].onclick = onThumbnailsClick-->
<!--      }-->

<!--      // Parse URL and open gallery if it contains #&pid=3&gid=1-->
<!--      const hashData = photoswipeParseHash()-->
<!--      if (hashData.pid && hashData.gid) {-->
<!--        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true)-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--//.pswp{-->
<!--//  .pswp__bg{-->
<!--//    //background: rgba(0,0,0,.8);-->
<!--//  }-->
<!--//}-->
<!--</style>-->
