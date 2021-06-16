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
          <el-col
            v-for="(item, index) in bookData.treasuredBookItemList"
            :key="index"
            :span="8"
          >
            <div
              class="list"
              @click="openVideo(item)"
            >
              <div class="img">
                <video>
                  <source
                    :src="item.content"
                    type="video/mp4"
                  >
                  <source
                    :src="item.content"
                    type="video/ogg"
                  >
                  <source
                    :src="item.content"
                    type="video/webm"
                  >
                </video>
              </div>
              <div class="title">
                {{ item.itemName }}
              </div>
              <div class="introduction">
                {{ item.introduction || '暂无简介' }}
              </div>
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
          <video
            controls
            autoplay
            controlsList="nodownload"
            :src="videoData.content"
          >
            <source
              :src="videoData.content"
              type="video/mp4"
            >
            <source
              :src="videoData.content"
              type="video/ogg"
            >
            <source
              :src="videoData.content"
              type="video/webm"
            >
          </video>
        </div>
        <div class="videoTitle">
          <div class="title">
            {{ videoData.itemName }}
          </div>
          <div class="count">
            <i
              class="iconfont icondianzan"
              @click="likeIt"
            />
            <span>{{ videoData.likeNumber || 0 }}</span>
          </div>
        </div>
        <div class="videoIntroduction">
          {{ videoData.introduction || '暂无简介' }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
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
      default () {
        return false
      }
    },
    bookData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showVideo: false,
      videoData: {}
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    popCloseBook () {
      this.$emit('close')
    },
    openVideo (data) {
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
    closeVideo () {
      this.videoData = {}
      this.showVideo = false
    },
    likeIt () {
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

.treasuredPop {
  padding: 0 26px;

  .el-row {
    margin: 0 !important;
    width: 100%;
  }

  .list {
    border: 1px solid #eee;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 24px;
    overflow: hidden;

    &:hover {
      box-shadow: 0 8px 20px 0 rgba(85, 85, 85, 0.1);

      .title {
        @include etm-color();
      }
    }

    .img {
      background-color: #555;
      height: 133px;

      video {
        height: 100%;
        width: 100%;
      }
    }

    .title {
      @include c_text_color();
      padding: 12px 16px 4px;
    }

    .introduction {
      @include c_secondary_color();
      /*box-orient: vertical;*/
      /*display: box;*/
      font-size: 12px;
      -webkit-line-clamp: 2;
      overflow: hidden;
      padding: 0 16px;
      text-overflow: ellipsis;
    }

    .dataBox {
      @include c_text_color();
      display: flex;
      font-size: 12px;
      justify-content: space-between;
      padding: 12px 16px;

      .playCount {
        align-items: center;
        display: flex;

        .iconguankancishu {
          color: #a7c0c0;
          margin-right: 4px;
          width: 16px;
        }
      }

      .likeCount {
        align-items: center;
        display: flex;

        .icondianzan {
          @include c_secondary_color();
          font-size: 14px;
          margin-right: 4px;
          width: 16px;
        }
      }
    }
  }
}

.videoPop {
  .videoContent {
    padding: 0 13px;

    .video {
      height: 473px;
      width: 100%;

      video {
        height: 100%;
        width: 100%;
      }
    }

    .videoTitle {
      display: flex;
      justify-content: space-between;
      padding: 16px 0 12px;

      .title {
        @include c_white();
        font-size: 16px;
      }

      .count {
        @include c_secondary_color();
        align-items: center;
        display: flex;

        .iconfont {
          @include c_secondary_color();
          cursor: pointer;
          margin-right: 4px;
          width: 16px;
        }
      }
    }

    .videoIntroduction {
      @include c_secondary_color();
      margin-top: 12px;
    }
  }
}
</style>
