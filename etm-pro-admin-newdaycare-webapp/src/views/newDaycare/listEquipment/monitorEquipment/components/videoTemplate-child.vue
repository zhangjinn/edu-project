<template>
  <div class="itemWrap">
    <h3>{{ title }}</h3>
    <div
      v-loading="loading"
      class="list"
    >
      <PlaceholderItem
        v-for="(video, index) in videoData"
        :key="index"
        :video-item="video"
        class="video"
        @deauthorize="handleDeauthorize"
        @click.native="handleOpenVideo(video, index)"
      />
      <el-button
        class="addBtn video"
        @click.stop="handleAdd"
      >
        <i class="iconvideocameraadd iconfont" />
      </el-button>
    </div>
  </div>
</template>
<script>
import PlaceholderItem from './placeholderItem-child'

export default {
  name: 'VideoTemplate',
  components: {
    PlaceholderItem
  },
  props: {
    videoData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  watch: {},
  methods: {
    handleAdd () {
      this.$emit('add')
    },
    handleOpenVideo (video, index) {
      if (video.open && video.online) {
        this.$emit('openVideo', { video, index })
      }
    },
    handleDeauthorize (v) {
      this.$emit('deauthorize', v)
    }
  }
}
</script>

<style lang="scss" scoped>
.itemWrap {
  h3 {
    margin-bottom: 23px;
  }

  .list {
    display: flex;
    flex-flow: row wrap;
    height: 100%;
    width: 100%;
    //justify-content: space-between;
    //margin-left: 16px;
  }

  .video {
    //box-shadow: 0px 0px 12px 0px #ccc;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 150px;
    margin-bottom: 53px;
    margin-right: 16px;
    width: 270px;

    ::v-deep .vjs-poster {
      background-color: #77839f;
      background-position: 0 bottom;
    }
  }

  .bottom {
    bottom: -30px;
    display: flex;
    height: 20px;
    justify-content: space-between;
    position: absolute;
    width: 100%;
  }
}

.addBtn {
  align-items: center;
  background-color: #f9f9f9;
  // margin-left: 56px;
  border-style: dashed;
  color: #bcbcbc;
  display: flex;
  justify-content: center;

  .iconvideocameraadd {
    //overflow: hidden;
    font-size: 60px;
    height: auto;
    width: auto;
    //margin-right: 8px;
  }
}
</style>
