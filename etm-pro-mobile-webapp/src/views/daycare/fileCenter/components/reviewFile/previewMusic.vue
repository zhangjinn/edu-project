<template>
  <div class="preview-music">
    <div style="width: 80%">
      <aplayer
        ref="music"
        :float="false"
        :music="dataLists"
      />
    </div>
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
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dataLists: {}
    }
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler(n) {
        if (Object.keys(n).length) {
          this.dataLists = {
            title: n.name,
            artist: ' ',
            src: n.url
          }

          this.$nextTick(() => {
            this.$refs.music.audio.play()
          })
        }
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.preview-music{

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

}
</style>
