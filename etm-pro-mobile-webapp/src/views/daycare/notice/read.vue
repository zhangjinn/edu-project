<template>
  <div class="readList-wrap">
    <setting-title>
      阅读统计
    </setting-title>

    <div>
      <tabs v-model="active">
        <tab :title="`未读（${noReadNumber}）`">
          <template v-if="noReadList.length">
            <div v-for="(item, index) in noReadList" :key="index" class="readItem" @click.stop="go('/daycare_cmNoticeManage_read_detail', {id : id, courseId : item.courseId, teachOrCare : item.teachOrCareEnum, course : item.courseName})">
              <div class="readInner">
                <span>{{ item.courseName }}</span>
                <p>{{ item.unreadNumber }}人未读 <i class="iconfont iconright" style="font-size: 12px" /></p>
              </div>
            </div>
          </template>
          <div v-else style="height:85vh; display: flex; justify-content: center; align-items: center">
            <no-content message="没有未读信息" />
          </div>
        </tab>
        <tab :title="`已读（${readNumber}）`">
          <template v-if="readList.length">
            <div v-for="(item, index) in readList" :key="index" class="readItem" @click.stop="go('/daycare_cmNoticeManage_read_detail')">
              <div class="readInner">
                <span>{{ item.courseName }}</span>
                <p>{{ item.unreadNumber }}人已读 <i class="iconfont iconright" /></p>
              </div>
            </div>
          </template>
          <div v-else style="height:85vh; display: flex; justify-content: center; align-items: center">
            <no-content message="没有已读信息" />
          </div>
        </tab>
      </tabs>
    </div>
  </div>
</template>

<script>
import noContent from '@/components/common/noContent'
import settingTitle from '@/views/daycare/weekPlan/components/settingTitle'
import { Tab, Tabs } from 'vant'
import {
  queryReadList
} from '@/service/daycare/notice'
export default {
  name: 'ReadList',
  components: {
    settingTitle,
    Tab,
    Tabs,
    noContent
  },
  data() {
    return {
      readList: [],
      id: 0,
      readNumber: 0,
      noReadList: [],
      noReadNumber: 0,
      active: 2,
      list: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  created() {
    const readId = this.$route.query.id
    this.id = readId
    queryReadList(readId).then(res => {
      res.data.data.forEach(cur => {
        if (cur.start) {
          this.readList = cur.courseList
          this.readNumber = cur.count
        } else {
          this.noReadList = cur.courseList
          this.noReadNumber = cur.count
        }
      })
    })
  },
  methods: {
    go(path, query = {}, params = {}) {
      this.$router.push({ path, query, params })
    }
  }
}
</script>

<style scoped lang="scss">
.readList-wrap{

  ::v-deep{
    .van-tabs__line{
      background-color: $theme;
    }
  }

  .readItem{
    background: #fff;
    padding: 0 12px;

    &:first-child{
      .readInner{
        border-top: none;
      }
    }
    .readInner {
      height: 54px;
      display: flex;
      font-size: 15px;
      color: #222;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #eee;

      p{
        color: #999;
      }
    }
  }
  ::v-deep {
    .settingTitle {
      color: #FFFFFF;
    }
  }
}
</style>
