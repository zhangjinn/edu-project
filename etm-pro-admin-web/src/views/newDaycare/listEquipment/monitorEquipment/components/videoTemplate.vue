<template>
  <div class="itemWrap">
    <h3>{{ title }}</h3>
    <div v-loading="loading" class="list">
      <PlaceholderItem
        v-for="(video, index) in videoData"
        :key="index"
        :video-item="video"
        class="video"
        @deauthorize="handleDeauthorize"
        @click.native.stop="handleOpenVideo(video, index)"
      />
      <el-button class="addBtn video" @click.stop="handleAdd">
        <i class="iconvideocameraadd iconfont" />
      </el-button>
    </div>
  </div>
</template>
<script>
import PlaceholderItem from './placeholderItem'

export default {
  name: 'VideTemplate',
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
      default: () => ''
    }
  },
  data() {
    return {}
  },
  watch: {},
  methods: {
    handleAdd() {
      this.$emit('add')
    },
    handleOpenVideo(v, index) {
      // console.log('open', v)
      this.$emit('openVideo', v, index)
    },
    handleDeauthorize(v) {
      // console.log('handleDeauthorize', v)
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
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    //justify-content: space-between;
    //margin-left: 16px;
  }

  .video {
    width: 270px;
    height: 150px;
    display: flex;
    //box-shadow: 0px 0px 12px 0px #ccc;
    box-sizing: border-box;
    flex-direction: column;
    margin-right: 16px;
    margin-bottom: 53px;

    & /deep/ .vjs-poster {
      background-color: #77839F;
      background-position: 0 bottom;
    }
  }

  .bottom {
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: space-between;
    bottom: -30px;
    height: 20px;
  }
}

.addBtn {
  // margin-left: 56px;
  border-style: dashed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  color: #BCBCBC;

  i.iconvideocameraadd {
    width: auto;
    height: auto;
    font-size: 60px;
  }
}

</style>
