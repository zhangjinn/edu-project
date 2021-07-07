<template>
  <div class="preview-music">
    <!--    <i class="iconfont iconclose" @click="close" />-->
    <aplayer
      ref="music"
      :float="true"
      list-max-height="96px"
      :list="dataLists"
      :music="dataLists[0]"
    >
      <template slot="display">
        <div class="close" @click="close">关闭</div>
      </template>
    </aplayer>
  </div>
</template>
<script>
import aplayer from 'vue-aplayer'

export default {
  name: 'PreviewMusic',
  components: {
    aplayer
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dataLists: []
    }
  },
  watch: {
    list: {
      deep: true,
      immediate: true,
      handler(n) {
        this.dataLists = n.map(cur => {
          return {
            title: cur.name,
            artist: ' ',
            src: cur.url
          }
        })

        this.$nextTick(() => {
          this.$refs.music.audio.play()
        })
      }
    }
  },
  methods: {
    close() {
      this.$emit('close', {})
    }
  }
}
</script>

<style scoped lang="scss">
.preview-music{

  ::v-deep{
   .close{
     position: absolute;
     top: 6px;
     font-size: 12px;
     color: #999;
     cursor: pointer;
     right: 8px;
   }
  }

  width: 400px;
  height:0px;
  position: absolute;
  right: 0;
  z-index: 30;
  bottom: 140px;

  .iconclose {
    cursor: pointer;
    position: absolute;
    top: 8px;
    z-index: 20;
    right: 8px;

  }

}
</style>
