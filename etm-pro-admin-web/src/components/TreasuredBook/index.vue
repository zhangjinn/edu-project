<template>
  <div class="index-wrap">
    <etm-pop
      v-if="showBook"
      :visible="showBook"
      pop="big"
      :title="bookData.treasuredBookName"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      confirm-btn="全屏显示"
      @close="popCloseBook"
    >
      <div class="treasuredPop">
        <el-row :gutter="60">
          <el-col v-for="(item, index) in bookData.treasuredBookItemList" :key="index" :span="6">
            <div class="list" @click="openVideo(item)">
              <div class="img">
                <video>
                  <source :src="item.content" type="video/mp4">
                  <source :src="item.content" type="video/ogg">
                  <source :src="item.content" type="video/webm">
                </video>
              </div>
              <div class="title">{{ item.itemName }}</div>
              <div class="introduction">{{ item.introduction || '暂无简介' }}</div>
              <div class="dataBox">
                <div class="playCount">
                  <i class="iconfont iconguankancishu" />
                  <span>{{ item.watchNumber || 0 }}</span>
                </div>
                <div class="likeCount">
                  <i class="iconfont icondianzan" />
                  <span>{{ item.likeNumber || 0 }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </etm-pop>
    <el-dialog
      v-if="showVideo"
      :visible="showVideo"
      class="videoPop"
      :append-to-body="true"
      @close="showVideo = false"
    >
      <div class="videoContent">
        <div class="video">
          <video controls autoplay controlsList="nodownload" :src="videoData.content">
            <source :src="videoData.content" type="video/mp4">
            <source :src="videoData.content" type="video/ogg">
            <source :src="videoData.content" type="video/webm">
          </video>
        </div>
        <div class="videoTitle">
          <div class="title">{{ videoData.itemName }}</div>
          <div class="count">
            <i class="iconfont icondianzan" @click="likeIt" />
            <span>{{ videoData.likeNumber || 0 }}</span>
          </div>
        </div>
        <div class="videoIntroduction">{{ videoData.introduction || '暂无简介' }}</div>
      </div>
    </el-dialog>
  </div>

</template>

<script>/**
 * index create by Administrator
 * createTime 2020/11/26 15:01
 */

import { createTreasuredBookLike } from '@/api/base/treasuredBook'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {
    showBook: {
      type: Boolean,
      default() {
        return false
      }
    },
    bookData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showVideo: false,
      videoData: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    popCloseBook() {
      this.$emit('close')
    },
    openVideo(data) {
      this.videoData = data
      this.showVideo = true
      const param = {
        treasuredBookItemId: this.videoData.treasuredBookItemId,
        status: 'WATCH'
      }
      createTreasuredBookLike(param).then(() => {
        this.videoData.watchNumber += 1
      })
    },
    closeVideo() {
      this.videoData = {}
      this.showVideo = false
    },
    likeIt() {
      const param = {
        treasuredBookItemId: this.videoData.treasuredBookItemId,
        status: 'LIKE'
      }
      createTreasuredBookLike(param).then(() => {
        this.videoData.likeNumber += 1
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

}

.treasuredPop {
  // padding: 0 26px;

  .el-row {
    margin: 0 !important;
    width: 100%;

    .el-col{
      padding: 0 0 0 16px !important;

      &:nth-of-type(1),
      &:nth-of-type(5n){
        padding: 0 !important;
      }
    }
  }
  .el-col {
    padding-left: 0!important;
  }

  .list {
    margin-bottom: 16px;
    border: 1px solid #eeeeee;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      box-shadow: 0px 8px 20px 0px rgba(85, 85, 85, 0.1);

      .title {
        @include etm-color();
      }
    }

    .img {
      height: 133px;
      background-color: #555;

      video {
        width: 100%;
        height: 100%;
      }
    }

    .title {
      padding: 12px 16px 4px;
      @include c_text_color();
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    .introduction {
      padding: 0 16px;
      font-size: 12px;
      height: 36px;
      @include c_secondary_color();
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .dataBox {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      @include c_text_color();
      font-size: 12px;

      .playCount {
        display: flex;
        align-items: center;

        .iconguankancishu {
          margin-right: 4px;
          width: 16px;
          color: #A7C0C0;
        }
      }

      .likeCount {
        display: flex;
        align-items: center;

        .icondianzan {
          margin-right: 4px;
          width: 16px;
          font-size: 14px;
          @include c_secondary_color();
        }
      }
    }
  }
}

.videoPop {

  .videoContent {
    padding: 0 13px;

    .video {
      width: 100%;
      height: 473px;

      video {
        width: 100%;
        height: 100%;
      }
    }

    .videoTitle {
      display: flex;
      justify-content: space-between;
      padding: 16px 0 12px;

      .title {
        font-size: 16px;
        @include c_white();
      }

      .count {
        display: flex;
        align-items: center;
        @include c_secondary_color();

        .iconfont {
          margin-right: 4px;
          width: 16px;
          @include c_secondary_color();
          cursor: pointer;
        }
      }
    }

    .videoIntroduction {
      margin-top: 12px;
      @include c_secondary_color();
    }
  }
}
</style>
