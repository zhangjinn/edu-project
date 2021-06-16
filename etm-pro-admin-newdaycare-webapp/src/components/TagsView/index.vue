<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
  >
    <!--<div class="el-icon-d-arrow-left" />-->
    <div
      ref="scrollPane"
      class="tags-view-wrapper"
    >
      <router-link
        v-for="tag in visitedViews"
        v-show="tag.title!='no-name'"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        <div class="wrapper">
          <span
            class="tagText"
            :title="tag.title"
          >{{ tag.title }}</span>
          <span
            v-if="!isAffix(tag)"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </div>
      </router-link>
    </div>
    <!--<div class="el-icon-d-arrow-right" />-->
    <!-- <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他标签页</li>
      <li @click="closeAllTags(selectedTag)">关闭所有标签页</li>
    </ul> -->
  </div>
</template>

<script>
// import ScrollPane from './ScrollPane'
import path from 'path'
import { asyncRouters } from '../../router'

export default {
  name: 'TagsView',
  // components: { ScrollPane },
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
    },
    routes () {
      return asyncRouters
    }
  },
  watch: {
    $route () {
      this.addTags()
      this.moveToCurrentTag()
      this.handleTagDivider()
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted () {
    this.initTags()
    this.addTags()
  },
  methods: {
    isActive (route) {
      return route.path === this.$route.path
    },
    isAffix (tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags (routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },

    // 处理要固定显示的路由标签页
    initTags () {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags () {
      this.$store.dispatch('tagsView/addView', this.$route)
    },
    moveToCurrentTag () {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            // this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag (view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag (view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
      this.handleTagDivider()
      window.localStorage.setItem('tagClose', true)
    },
    closeOthersTags () {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags (view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView (visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu (tag, e) {
      // const menuMinWidth = 0
      // const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      // const offsetWidth = this.$el.offsetWidth // container width
      // const maxLeft = offsetWidth - menuMinWidth // left boundary
      // const left = e.clientX - offsetLeft  // 15: margin right
      //
      // if (left > maxLeft) {
      //     this.left = maxLeft
      // } else {
      //     this.left = left
      // }
      //
      // this.top = e.clientY
      //
      // console.log(left)
      // this.visible = true
      // this.selectedTag = tag
    },
    closeMenu () {
      this.visible = false
    },
    // 处理标签页后面分割线的样式
    handleTagDivider () {
      this.$nextTick(() => {
        const tags = [...this.$refs.scrollPane.querySelectorAll('.tags-view-item')]
        for (let i = 0; i < tags.length; i++) {
          if (tags[i].className.includes('active')) {
            // if (i) {
            //   tags[i - 1].className = 'tags-view-item divide-free'
            // }
            (tags[i + 1]) && (tags[i + 1].className = 'tags-view-item divide-free')
            i++
          } else {
            tags[i].className = 'tags-view-item'
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  @include bgc_white();
  display: flex;
  height: 32px;
  width: 100%;

  .el-icon-d-arrow-left,
  .el-icon-d-arrow-right {
    @include c_secondary_color();
    cursor: pointer;
    font-size: $font-comment;
    line-height: 30px;
    text-align: center;
    width: 24px;
  }

  .el-icon-d-arrow-right {
    @include bc_divide_color();
    border-left: 1px solid;
  }

  .tags-view-wrapper {
    @include etm-bdc();
    border-bottom: 1px solid;
    display: flex;
    overflow: visible;
    padding: 0 16px;
    width: 100%;
    // & ::v-deep .el-scrollbar__wrap {
    //   width: 100%;
    //   overflow: visible;
    // }
    // & ::v-deep .el-scrollbar__bar {
    //   display: none;
    // }
    // & ::v-deep .el-scrollbar__view {
    //   display: flex;
    //   padding: 0 24px;
    //   height: 40px;
    //   border-bottom: 1px solid;
    //   @include etm-bdc();
    // }
    .tags-view-item {
      @include bgc_white();
      @include bc_divide_color();
      border-radius: 4px 4px 0 0;
      cursor: pointer;
      display: inline-block;
      font-size: $text-fontSize;
      height: 30px;
      line-height: 30px;
      min-width: 10px;
      position: relative;
      width: 120px;

      &:hover {
        z-index: 999;

        .tagText {
          @include etm-color();
        }
      }

      .wrapper {
        position: relative;
      }

      .tagText {
        @include c_secondary_color();
        display: inline-block;
        overflow: hidden;
        position: relative;
        // text-overflow: ellipsis;
        text-indent: 10px;
        vertical-align: middle;
        white-space: nowrap;
        width: calc(100% - 22px);

        &::after {
          background: #fff;
          bottom: 1px;
          content: '';
          display: block;
          left: 0;
          mask: linear-gradient(to right, transparent 64%, #fff 100%);
          position: absolute;
          top: 0;
          width: 100%;
        }

        &::before {
          background-color: #b0bdd1;
          content: '';
          display: block;
          height: 16px;
          left: 0;
          position: absolute;
          top: 7px;
          width: 1px;
        }
      }

      &.active {
        @include etm-bdc();
        background-color: #f0f2f5;
        border: 1px solid;
        border-bottom: 0;
        height: 32px;
        z-index: 1000;

        .tagText {
          @include etm-color();
          font-weight: bold;

          &::after {
            background: #f2f4f9;
            bottom: 1px;
            content: '';
            display: block;
            left: 0;
            mask: linear-gradient(to right, transparent 64%, #f2f4f9 100%);
            position: absolute;
            top: 0;
            width: 100%;
          }

          &::before {
            background-color: transparent;
          }
        }
      }
    }

    /*.tags-view-item.active {*/
    /*  .tagText {*/
    /*    &::before {*/
    /*      background-color: transparent;*/
    /*    }*/
    /*  }*/
    /*}*/

    .tags-view-item.divide-free {
      .tagText {
        &::before {
          background-color: transparent;
        }
      }
    }

    .el-icon-close {
      color: #999;
      font-size: 18px;
      font-weight: bold;
      height: 16px;
      position: absolute;
      right: 0;
      // border-right: 1px solid #b0bdd1;
      text-align: center;
      top: 8px;
      transform: translateY(1px);
      // transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      width: 22px;

      &::before {
        display: inline-block;
        font-size: 10px;
        transform: translate(-4px, -4px);
      }

      &:hover {
        @include c_error_color();
      }
    }
  }
}
</style>
