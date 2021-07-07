<template>
  <div class="notice-wrap">
    <setting-title>
      <van-dropdown-menu>
        <van-dropdown-item v-model="semester" :options="semesterList" @change="menuChange" />
      </van-dropdown-menu>
    </setting-title>

    <div class="searchWrap">
      <div>
        <i class="icon-search iconfont iconsearch" />
        <input type="text" placeholder="请输入要搜索内容" @keydown.enter="searchChange">
      </div>
    </div>

    <div v-if="list.length" class="noticeBox">
      <div v-for="(item, index) in list" :key="index" class="noticeItem" @click="go('/daycare_cmNoticeManage_datail', {id : item.id})">
        <div class="noticeTitle">
          <h3>{{ item.notificationTitle }}</h3>
          <span @click.stop="go('/daycare_cmNoticeManage_read', {id : item.id})">
            <van-image :src="require('@/assets/images/noEye.png')" :width="13" :height="13" />&nbsp;{{ item.unreadNumber }}人未读
          </span>
        </div>
        <div class="noticeBody" v-html="item.notificationContent" />
        <div class="noticeFooter">{{ item.createDateTime | parseTime }}</div>
      </div>
    </div>
    <div v-else style="height:86vh; display: flex; justify-content: center; align-items: center">
      <no-content message="当前班级没有通知哦~" />
    </div>
  </div>
</template>

<script>
import settingTitle from '@/views/daycare/weekPlan/components/settingTitle'
import noContent from '@/components/common/noContent'

import {
  queryTeachAllClazz,
  queryNoticeLists
} from '@/service/daycare/notice'

export default {
  name: 'NoticeWrap',
  components: {
    settingTitle,
    noContent
  },
  filters: {
    parseTime(value) {
      const time = new Date(value)
      return `${time.getFullYear()}-${time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1}-${time.getDate() < 10 ? '0' + time.getDate() : time.getDate()}`
    }
  },
  data() {
    return {
      // 头部
      list: [],
      keywords: '',
      semester: 0,
      semesterList: []
    }
  },
  created() {
    queryTeachAllClazz().then(res => {
      const _result = [{
        text: '全部课程',
        value: 0,
        type: null,
        id: null
      }]

      let _index = 1
      res.data.data.forEach(cur => {
        cur.courseDTOList.forEach(c => {
          _result.push({
            text: c.courseName,
            value: _index,
            id: c.courseId,
            type: cur.teachOrCare
          })
          ++_index
        })
      })

      this.semesterList = _result
      this.$nextTick(() => {
        this.getNotice()
      })
    })
  },
  methods: {
    searchChange(e) {
      this.keywords = e.target.value

      this.$nextTick(() => {
        this.getNotice()
      })
    },
    menuChange(e) {
      this.getNotice()
    },
    getNotice() {
      const clazz = this.semesterList[this.semester]
      const keywords = this.keywords

      queryNoticeLists({
        teachOrCare: clazz.type,
        courseId: clazz.id,
        notificationTitle: keywords,
        notificationContent: keywords
      }).then(res => {
        this.list = res.data.data
      })
    },
    go(path, query = {}, params = {}) {
      this.$router.push({ path, query, params })
    }
  }
}
</script>

<style scoped lang="scss">
.notice-wrap{
  .noticeBox{
     .noticeItem{
        margin: 12px 12px 0;
       background: #fff;
       padding: 0 12px 14px;
       border-radius: 4px;

       .noticeBody {
         margin: 20px 0 15px;
         font-size: 14px;
         color: #999;
         text-align: left;
         line-height: 28px;

         max-height: 56px;
         overflow: hidden;
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
       }

       .noticeFooter {
         font-size: 12px;
         color: #999999;
         text-align: left;
       }

       .noticeTitle {
         display: flex;
         align-items: center;
         font-size: 15px;
         color: #222;
         justify-content: space-between;
         border-bottom: 1px solid #eee;
         height: 52px;

         span {
           font-size: 12px;
           color: #fff;
           padding: 0 12px;
           line-height: 24px;
           height: 24px;
           background: linear-gradient(90deg, #FFD17D 0%, #FFA943 100%);
           border-radius: 20px;
           display: inline-flex;
           align-items: center;

         }
         h3 {
           font-size: 15px;
           color: #222;
           font-weight: 500;
         }
       }
     }
  }
  .searchWrap {
    height: 46px;
    background: #fff;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      width: 351px;
      border-radius: 3px;
      height: 32px;
      background: #F5F5F5;
      position: relative;
      padding: 0 0 0 30px;

      i {
        display: block;
        font-size: 10px;
        top: 50%;
        left: 10px;
        transform: translate(0, -46%);
        position: absolute;
      }

      input {
        display: block;
        width: 100%;
        height: 32px;
        font-size: 12px;
        color: #999999;
        background: transparent;
      }
    }
  }
  ::v-deep {
    .settingTitle {
      background: #fff;
      color: #222;

      i{
        color: #222;
      }

      .van-dropdown-menu.van-hairline--top-bottom {
        height: 100%;
        background: transparent;

        .van-ellipsis {
          color: #222;
        }

        .van-dropdown-menu__title {
          &:after {
            border-color: transparent transparent #999 #999
          }
        }
      }
    }
  }
}
</style>
