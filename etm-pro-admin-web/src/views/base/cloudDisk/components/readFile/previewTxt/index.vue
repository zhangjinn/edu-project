<template>
  <div v-if="isShow" class="preview-txt">
    <div class="preview-box">{{ textContent }}</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PreviewTxt',
  props: {
    src: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      isShow: false,
      textContent: ''
    }
  },
  watch: {
    src: {
      immediate: true,
      deep: true,
      handler(n) {
        if (n) {
          console.log(n)
          this.getFile()
        }
      }
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    getFile() {
      axios({
        url: this.src,
        method: 'get'
      }).then(res => {
        this.textContent = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
.preview-txt{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3000;
  background: rgba(0,0,0,.5);
  font-size: 14px;
  color: #fff;
}
</style>
