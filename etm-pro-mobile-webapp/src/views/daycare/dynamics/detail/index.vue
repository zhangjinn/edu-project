<template>
  <div class="dynamicsDetail">
    <div class="setting" no-setting @click="$router.back()">
      <span class="iconfont iconleft left" />
    </div>

    <swiper
      ref="mySwiper"
      class="swiper"
      :options="swiperOptions"
      @slideNextTransitionStart="nextTran"
      @slidePrevTransitionStart="prevTran"
    >
      <swiper-slide class="other" :class="{none:prevNone}" />
      <swiper-slide>
        <div class="swiper">
          <!--          如果type类型是图片的话-->
          <div v-if="dynamicsContent && dynamicsContent.dynamicType === 'IMAGE'" class="box">
            <van-swipe
              :loop="false"
              :height="375"
              :show-indicators="false"
              style="z-index: 9999"
            >
              <van-swipe-item v-for="(img, index) in dynamicsImage" :key="index">
                <img v-lazy="img.url" src="" alt="">
              </van-swipe-item>
            </van-swipe>
          </div>

          <!--          如果type类型是视频的话-->
          <div v-if="dynamicsContent && dynamicsContent.dynamicType === 'VIDEO'">
            <video
              ref="video"
              :src="dynamicsImage.length !== 0 && dynamicsImage[0].url || ''"
              autoplay
              class="video"
              loop
              @click="playControl"
            />
            <!--            <span :class="{showBtn:!showPauseBtn}" class="iconfont iconbofang pauseBtn" />-->
          </div>

          <div v-if="dynamicsContent" class="footer">
            <div class="footer-left">
              <div class="avatar">
                <van-image
                  :src="avatarImage"
                  round
                  width="36px"
                  height="36px"
                />
                <span>{{ dynamicsContent.createName }}</span>
                <span>{{ dynamicsContent.strCreateDate }}</span>
              </div>
              <div class="textContent">
                {{ dynamicsContent.content }}
              </div>
            </div>

            <div class="footer-right">
              <div class="right-item">
                <van-image
                  :src="likeIcon"
                  :class="{isLike:dynamicsContent.state}"
                  width="21px"
                  height="21px"
                  @click="DynamicsLikeorDislike(dynamicsContent.dynamicId,dynamicsContent.state)"
                />
                <span>{{ dynamicsContent.likeCount }}</span>
              </div>
              <div v-if="dynamicsContent.canComment === 'COMMENTABLE'" class="right-item">
                <van-image
                  :src="commentIcon"
                  width="21px"
                  height="21px"
                  @click="showCommentPopup"
                />
                <span>{{ dynamicsContent.commentCount || 0 }}</span>
              </div>
              <div v-if="dynamicsContent.del" class="right-item" @click="deleteDynamics">
                <van-image :src="deleteIcon" width="21px" height="21px" />
              </div>
            </div>
          </div>
        </div>

      </swiper-slide>

      <swiper-slide class="next" :class="{none:nextNone}" />
    </swiper>

    <van-popup
      v-model="showComment"
      class="commentPopup"
      position="bottom"
      :style="{height:'80%'}"
    >
      <div class="header">
        <span>{{ dynamicsContent.commentCount || 0 }}条评论</span>
        <span @click="showComment = false">X</span>
      </div>

      <!--      一级评论内容-->
      <div v-if="CommentList.length !== 0" class="comment" @click.self="reNewFirstComment">
        <div v-for="(firstComment) in CommentList" :key="firstComment.id" class="comment-item">
          <div class="comment-left">
            <van-image :src="avatarImage" round width="24px" height="24px" />
          </div>

          <div class="comment-content">
            <div class="comment-content-header">
              <span class="name">{{ firstComment.commentatorName }}</span>
            </div>

            <div class="comment-content-middle">
              {{ firstComment.commentContent }}
            </div>

            <div class="comment-content-footer">
              <span>{{ firstComment.createDateTime | parseTimeToDate(firstComment.createDateTime) }}</span>
              <span @click="showSecondReply(firstComment.commentatorName,firstComment.commentId)">回复</span>
              <span v-if="firstComment.del" @click="deleteComment(firstComment.commentId)">删除</span>
            </div>

            <!--            二级评论内容-->
            <div class="comment-reply">
              <div
                v-for="(secondComment) in firstComment.secondLevelComment"
                :key="secondComment.commentId"
                ref="loadItem"
                class="comment-reply-item"
                :class="{loadItem:!secondComment.load}"
                @click="showReply(secondComment.commentatorName,secondComment.commentId,firstComment.commentId)"
                @touchstart="touchStart(secondComment.commentId,secondComment.del)"
                @touchend="touchEnd"
              >

                <div v-if="secondComment.replyName" class="reply-header">
                  {{ secondComment.commentatorName }}
                  <span>回复</span>
                  {{ secondComment.replyName }}
                </div>

                <div v-else class="reply-header">
                  {{ secondComment.commentatorName }}:
                </div>

                <div class="reply-content">
                  {{ secondComment.commentContent }}
                </div>
              </div>

              <div v-if="firstComment.secondLevelComment.length > 1" class="moreComment">
                <div>
                  <span
                    class="more"
                    @click="loadMoreReply(firstComment,firstComment.expandReply)"
                  >{{ firstComment.expandReply ? '收起回复' : '展开更多回复' }}</span>
                  <span
                    class="more iconfont"
                    :class="{'iconarrow-down':!firstComment.expandReply,'iconarrow-up':firstComment.expandReply}"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
        <div class="noMoreComment">没有更多评论啦</div>
        <!--        一级评论框-->
        <div v-if="!isReply && !isReplyTo" class="Comment">
          <div class="Comment-left">
            <van-search
              v-model="firstCommentText"
              shape="round"
              background="#ffffff"
              placeholder="说点什么..."
              left-icon="none"
              :autofocus="autofocus"
            />
          </div>

          <div class="Comment-right">
            <!--            <span class="iconfont iconemoji" />-->
            <span @click="sendOneComment(firstCommentText,dynamicId)">发送</span>
          </div>
        </div>

        <!--        二级评论框-->
        <div v-if="isReply && !isReplyTo" class="Comment">
          <div class="Comment-left">
            <van-search
              v-model="secondCommentText"
              shape="round"
              background="#ffffff"
              :placeholder="secondLevelPlaceHolder"
              left-icon="none"
              :autofocus="autofocus"
            />
          </div>

          <div class="Comment-right">
            <!--            <span class="iconfont iconemoji" />-->
            <span @click="sendSecondComment(secondCommentText,dynamicId)">发送</span>
          </div>
        </div>

        <!--回复评论框-->
        <div v-if="isReplyTo && !isReply" class="Comment">
          <div class="Comment-left">
            <van-search
              v-model="replyCommentText"
              shape="round"
              background="#ffffff"
              :placeholder="secondLevelPlaceHolder"
              left-icon="none"
              :autofocus="autofocus"
            />
          </div>

          <div class="Comment-right">
            <!--            <span class="iconfont iconemoji" />-->
            <span @click="ReplySomeOne">发送</span>
          </div>
        </div>
      </div>

      <div v-else class="comment">
        <span class="noComment">暂无评论</span>

        <!--        一级评论框-->
        <div class="Comment">
          <div class="Comment-left">
            <van-search
              v-model="firstCommentText"
              shape="round"
              background="#ffffff"
              placeholder="说点什么..."
              left-icon="none"
              :autofocus="autofocus"
            />
          </div>

          <div class="Comment-right">
            <!--            <span class="iconfont iconemoji" />-->
            <span @click="sendOneComment(firstCommentText,dynamicId)">发送</span>
          </div>
        </div>
      </div>
    </van-popup>

    <!--    长按删除弹出层-->
    <van-popup v-model="deleteCommentPop" position="bottom" :style="{height:'13%'}">
      <van-cell @click="deleteComment(secondLevelCommentId)">删除评论</van-cell>
      <van-cell @click="deleteCommentPop = false">取消</van-cell>
    </van-popup>
  </div>

</template>

<script>
/**
 * index create by changqingteng
 * createTime 2020/10/30 17:22
 */

import { createDynamicsComment, queryCommentList, queryDynamicDetail, removeDynamics, removeDynamicsComment, updateDynamicsLike } from '@/service/daycare/dynamic'
import { Dialog, Toast } from 'vant'
import { directive, Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { parseTime } from '@/utils/date'
// import settingTitle from '../components/settingTitle'

export default {
  name: 'Index',
  components: {
    Swiper,
    SwiperSlide
    // settingTitle
  },
  directives: { swiper: directive },
  filters: {
    parseTimeToDate(value) {
      // console.log(value, 'value')
      if (value) {
        return parseTime(value, '{m}-{d} {h}:{i}:{s}')
      } else {
        return ''
      }
    }
  },
  mixins: [],
  props: {},
  data() {
    return {
      // swiper的配置
      swiperOptions: {
        direction: 'vertical',
        initialSlide: 1,
        pagination: {
          el: '.swiper-pagination'
        }
      },
      autofocus: true,
      dynamicsContent: {},
      dynamicsImage: [],
      dynamicId: null,
      prevDynamicsId: null, // 上一id
      nextDynamicsId: null, // 下一个id
      // likeIcon: require('@/assets/images/guardcare/like.png'),
      commentIcon: require('@/assets/images/guardcare/comment.png'),
      deleteIcon: require('@/assets/images/guardcare/delete.png'),
      showComment: false,
      firstCommentText: '', // 一级评论文本
      secondCommentText: '', // 二级评论文本
      replyCommentText: '',
      state: null, // 是否已经点赞
      CommentList: [], // 一级评论list
      isReply: false, // 二级评论是否回复评论状态
      isReplyTo: false, // 二级评论的回复
      secondLevelPlaceHolder: '',
      loadItem: true,
      lastSecondCommentListLen: 0,
      nextNone: false, // 判断向下切换是否到底flag
      prevNone: false, // 判断向上切换是否到顶flag
      // expandReply: false, // 展开更多回复flag
      showPauseBtn: false, // 显示暂停键flag
      secondLevelCommentId: '', // 二级评论id
      deleteCommentPop: false // 二级评论删除popup是否弹出flag
      // loadSecondCommentList: [],
    }
  },
  computed: {
    avatarImage() {
      return this.dynamicsContent.avatar ? require(this.dynamicsContent.avatar) : require('@/assets/images/defaultAvatar.png')
    },
    likeIcon() {
      return this.state ? require('@/assets/images/guardcare/active_like.png') : require('@/assets/images/guardcare/like.png')
    }
  },
  async mounted() {
    await this.init()
  },

  methods: {
    // 模拟长按事件start
    touchStart(commentId, canDel) {
      // 再次清空定时器，防止重复注册定时器
      clearTimeout(this.loop)

      this.loop = setTimeout(() => {
        if (!canDel) {
          return
        }
        this.deleteCommentPop = true
        // 二级评论id
        this.secondLevelCommentId = commentId
        // 显示删除二级评论的popup
      }, 500)
    },
    // 模拟长按事件end
    touchEnd() {
      clearTimeout(this.loop)// 清空定时器，防止重复注册定时器
    },
    reNewFirstComment() {
      // console.log('11111')
      this.isReply = false
      this.isReplyTo = false
    },
    // 向下切换下一个动态
    nextTran() {
      // console.log('1111')
      if (!this.nextDynamicsId) {
        this.nextNone = true
        Toast.fail({
          message: '已经到底咯...',
          duration: 500
        })
        return
      }
      this.$router.replace({
        path: `daycare_dynamicsDetail`,
        query: {
          dynamicId: this.nextDynamicsId,
          clazzId: this.clazzId,
          teachOrCare: this.teachOrCare,
          courseId: this.courseId
        }
      })
    },
    // 向上切换上一个动态
    prevTran() {
      if (!this.prevDynamicsId) {
        this.prevNone = true
        Toast.fail({
          message: '上面没有东西了...',
          duration: 500
        })
        return
      }
      this.$router.replace({
        path: `daycare_dynamicsDetail`,
        query: {
          dynamicId: this.prevDynamicsId,
          clazzId: this.clazzId,
          teachOrCare: this.teachOrCare,
          courseId: this.courseId
        }
      })
    },
    // 初始化动态详情
    async init() {
      // console.log(this.$route.query, 'query')
      this.dynamicId = this.$route.query.dynamicId
      this.clazzId = this.$route.query.clazzId
      this.courseId = this.$route.query.courseId
      this.teachOrCare = this.$route.query.teachOrCare
      const params = {}
      params.dynamicId = this.dynamicId
      if (this.clazzId !== 'null') {
        // console.log('1111')
        params.clazzId = this.clazzId
      } else {
        params.clazzId = null
      }
      params.courseId = this.courseId
      params.teachOrCare = this.teachOrCare
      // this.clazzId = this.$route.query.clazzId
      // console.log(params, 'params')
      await queryDynamicDetail(params).then(res => {
        this.dynamicsContent = res.data.data
        this.dynamicsImage = this.dynamicsContent.urlList
        this.state = this.dynamicsContent.state
        this.prevDynamicsId = this.dynamicsContent.previousDynamicsId
        this.nextDynamicsId = this.dynamicsContent.nextDynamicsId
      })
    },
    // 删除动态
    deleteDynamics() {
      Dialog.confirm({
        title: '确认删除?',
        message: '该动态将被删除,是否继续此操作?',
        confirmButtonColor: '#10C2C4'
      })
        .then(() => {
          removeDynamics({ dynamicId: this.dynamicId }).then(() => {
            Toast.success('删除成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 200)
          })
        }).catch(() => {
          console.log('取消删除操作')
        })
    },
    // 查询评论
    queryComment() {
      const params = {}
      params.dynamicId = this.dynamicId
      queryCommentList(params).then(res => {
        this.CommentList = res.data.data.firstLevelCommentList
        this.CommentList.forEach((item) => {
          item.expandReply = false
          // console.log(item, 'item')
          if (item.secondLevelComment[0]) {
            item.secondLevelComment[0].load = true
          }
          item.isExpand = true
        })
      })
    },
    // 显示弹出层 并且加载评论列表（需等待）
    async showCommentPopup() {
      this.showComment = true
      // this.expandReply = true
      this.isReplyTo = false
      this.isReply = false
      await this.queryComment()
    },

    // 点赞和取消点赞操作 完成还要init一次
    DynamicsLikeorDislike(dynamicId, isLike) {
      // console.log(!isLike, 'isLike')
      updateDynamicsLike({
        dynamicId: dynamicId,
        state: isLike
      }).then(async() => {
        await this.init()
      })
    },

    // 发布一级评论操作 只要动态id和内容content
    sendOneComment(commentText, dynamicId) {
      if (commentText.length === 0) {
        Toast.fail({
          message: '请输入内容...',
          duration: 500
        })
        return
      }
      const params = {}
      params.commentContent = commentText
      params.dynamicId = dynamicId
      createDynamicsComment(params).then(async() => {
        // console.log(res, '发送一级评论')
        this.firstCommentText = ''
        // this.expandReply = true
        this.init()
        this.queryComment()
      })
    },
    // 发布二级评论操作 要动态id\内容content\父评论id
    sendSecondComment(commentText, dynamicId) {
      if (commentText.length === 0) {
        Toast.fail({
          message: '请输入内容...',
          duration: 500
        })
        return
      }
      const params = {}
      params.dynamicId = dynamicId
      params.commentContent = commentText
      params.commentFatherId = this.commentFatherId
      // console.log(params, '二级评论params')
      createDynamicsComment(params).then(async() => {
        this.isReply = false
        // this.expandReply = true
        this.secondCommentText = ''
        await this.queryComment()
        await this.init()
      })
    },
    // 显示二级评论框
    showSecondReply(commentatorName, commentFatherId) {
      // 二级回复框打开，三级回复框消失
      this.isReply = true
      this.isReplyTo = false
      this.secondCommentText = ''
      this.secondLevelPlaceHolder = `回复${commentatorName}`
      this.commentFatherId = commentFatherId
    },

    // 删除评论
    deleteComment(commentId) {
      Dialog.confirm({
        title: '删除评论',
        message: '评论将会被删除,是否继续此操作?',
        confirmButtonColor: '#10C2C4'
      }).then(() => {
        const params = {}
        params.commentId = commentId
        removeDynamicsComment(params).then(res => {
          Toast.success('删除成功')
          this.deleteCommentPop = false
          this.init()
          this.queryComment()
        })
      }).catch(() => {
        console.log('您取消了删除操作')
      })
    },
    // 打开回复评论框
    showReply(commentatorName, replyToCommentId, commentFatherId) {
      // 三级回复框打开,二级回复框消失
      this.isReplyTo = true
      this.isReply = false
      this.secondLevelPlaceHolder = `回复${commentatorName}`
      this.replyToCommentId = replyToCommentId
      this.commentFatherId = commentFatherId
    },
    // 回復某人操作 獲取內容content\动态id\父评论id\回复评论id
    ReplySomeOne() {
      if (this.replyCommentText.length === 0) {
        Toast.fail({
          message: '请输入内容...',
          duration: 500
        })
        return
      }
      const params = {}
      params.commentContent = this.replyCommentText
      params.dynamicId = this.dynamicId
      // console.log(this.replyToCommentId, 'replay')
      params.commentFatherId = this.replyToCommentId
      // params.replyToCommentId = this.replyToCommentId
      // console.log(params, '回复来了')
      createDynamicsComment(params).then(() => {
        // console.log('评论成功')
        this.replyCommentText = ''
        // this.expandReply = true
        this.queryComment()
        this.init()
        Toast.success('评论成功')
      })
    },
    // 加載更多回復 获取二级评论列表,同时获取已经加载的二级评论的长度
    loadMoreReply(firstComment, expandReply) {
      // console.log(refsLoadList, 'refsLoadItem')

      for (const secondComment of firstComment.secondLevelComment) {
        secondComment.load = !expandReply
        firstComment.expandReply = !expandReply
        // this.expandReply = !expandReply
        firstComment.secondLevelComment[0].load = true
        this.$forceUpdate()
      }
    },
    // 视频控制
    playControl() {
      if (!this.$refs.video.paused) {
        this.$refs.video.pause()
        this.showPauseBtn = true
      } else {
        this.$refs.video.play()
        this.showPauseBtn = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.noMoreComment {
  font-size: 13px;
  margin-top: 10px;
  color: #999999
}

.noComment {
  font-size: 13px;
  color: #999999;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 82%;
}

.showBtn {
  opacity: 0;
}

.pauseBtn {
  z-index: 999;
  display: inline-block;
  font-size: 40px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}

.box {
  position: relative;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}

.loadItem {
  display: none !important;
}

.iconemoji {
  font-size: 20px;
}

// 主体
.dynamicsDetail {
  width: 100%;
  height: 100%;
  background: #111111;
  position: relative;

  .setting {
    width: 10%;
    height: 30px;
    display: inline-block;
    z-index: 999999;
    position: fixed;
    left: 0;
    top: 0.9%;

    .left {
      font-size: 20px;
      padding-left: 8px;
      padding-top: 4px;
      color: white !important;
    }
  }
}

// 图片轮播
.swiper {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
  }

  .video {
    width: 100%;
    height: 375px;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }

  .none {
    display: none;
  }
}

// 底部详情
.footer {
  display: flex;
  position: absolute;
  width: 100%;
  align-items: flex-end;
  bottom: 5%;

  .footer-left {
    display: flex;
    flex-direction: column;
    flex-basis: 95%;
    color: #FFFFFF;
    z-index: 99;
    font-size: 13px;
    text-align: left;
    padding: 0 10px 0 20px;
    align-self: center;
    //margin-top: 20px;
    //margin-top: 10px;

    .avatar {
      margin-top: 5px;
      display: flex;
      align-items: center;
      font-size: 15px;

      span {
        margin-left: 10px;
      }

      span:last-child {
        font-size: 13px;
        display: inline-flex;
        margin-left: 20px;

      }
    }

    .textContent {
      margin-top: 10px;
      word-break: break-all;
    }
  }

  .footer-right {
    flex-basis: 15%;
    box-sizing: border-box;
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
    justify-content: end;
    height: 150px;
    @keyframes likeTran {
      0% {
        //transform: scale(3);
      }

      50% {
        transform: scale(3);
        //transform: rotate(-deg);
      }

      75% {
        transform: scale(1.5);
      }

      100% {
        transform: scale(1);
      }
    }

    .isLike {
      animation: likeTran 0.75s;
    }

    .right-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 15px;

      span {
        color: white;
        font-size: 13px;
        line-height: 19px;
        text-shadow: 1px 2px 3px rgba(34, 34, 34, 0.1);
      }
    }
  }
}

//评论弹出层
.commentPopup {
  border-radius: 10px 10px 0 0;

  .header {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    margin: 7px;
    align-items: flex-end;

    span:first-child {
      flex-basis: 100%;
      padding-left: 40px;

    }

    span {
      display: inline-block;
      padding: 0 5px;
    }

    span:last-child {
      font-size: 9px;
    }
  }

  //评论内容
  .comment {
    height: 82%;
    overflow: scroll;
    //搜索框
    .Comment {
      border-top: 1px solid #EEEEEE;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;

      .Comment-left {
        flex-basis: 84%;

        /deep/ .van-field__left-icon {
          display: none;
          margin-left: 0;
        }
      }

      .Comment-right {
        display: flex;
        align-items: center;

        span:last-child {
          margin-left: 10px;
          color: $theme
        }
      }
    }

    //每一个评论的item
    .comment-item {
      display: flex;
      box-sizing: border-box;
      padding: 3px 12px 4px 12px;
      //flex-basis: 100%;

      .moreComment {
        margin-top: 5px;

        .more {
          color: $theme;
          font-size: 12px;
          line-height: 12px;
        }

        .iconfont {
          margin-left: 5px;
        }
      }

      //回复评论item

      .comment-reply-item {
        margin-top: 10px;
        //display: none;

        .reply-header {
          margin-bottom: 5px;
          font-size: 13px;
          font-weight: 400;
          color: #666666;
        }

        .reply-content {
          word-break: break-all;
        }

      }

      .comment-content {
        text-align: left;
        box-sizing: border-box;
        font-size: 15px;
        font-weight: 400;
        color: #222222;
        line-height: 22px;
        padding: 6px;
        border-bottom: 1px solid #EEEEEE;
        flex-basis: 100%;
        z-index: 999;

        .comment-content-header {
          font-size: 14px;
          font-weight: 400;
          color: $theme;
          line-height: 12px;
          display: flex;
          justify-content: flex-start;
          margin-bottom: 10px;

          .name {
            align-self: center;
          }
        }

        .comment-content-middle {
          word-break: break-all;
        }

        .comment-content-footer {
          text-align: left;
          margin-top: 5px;

          span {
            font-size: 12px;
            font-weight: 400;
            color: #999999;
            line-height: 12px;
          }

          span:nth-child(2) {
            color: $theme;
            margin-left: 10px;
          }

          span:last-child {
            color: red;
            margin-left: 10px;
          }
        }
      }
    }
  }
}

///deep/ .van-swipe {
//  left: 50%;
//  top: 50%;
//  transform: translate(-50%, -50%);
//}

/deep/ .swiper-wrapper {
  height: 100% !important;
  transition: none
}

.swiper {
  height: 100% !important;
}

/deep/ .swiper-slide {
  height: 100% !important;
}

/deep/ .next {
  height: 0 !important;
}

/deep/ .van-cell__value--alone {
  text-align: center;
}
</style>
