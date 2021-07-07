<template>
  <div class="readList-wrap">
    <setting-title>
      {{ $route.query.course }}
    </setting-title>

    <div>
      <tabs v-model="active">
        <tab :title="`未读（${noReadNumber}）`">
          <template v-if="noReadList.length">
            <div v-for="(item, index) in noReadList" :key="index" class="readItem">
              <div class="readInner">
                <h3>{{ item.childName | stringsub }}</h3>
                <span>{{ item.childName }}</span>
              </div>
            </div>
          </template>
          <div v-else style="height:85vh; display: flex; justify-content: center; align-items: center">
            <no-content message="没有未读信息" />
          </div>
        </tab>
        <tab :title="`已读（${readNumber}）`">
          <template v-if="readList.length">
            <div v-for="(item, index) in readList" :key="index" class="readItem">
              <div class="readInner">
                <h3>{{ item.childName | stringsub }}</h3>
                <span>{{ item.childName }}</span>
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
import {
  queryReadDetail
} from '@/service/daycare/notice'
import { Tab, Tabs } from 'vant'
export default {
  name: 'ReadDetail',
  components: {
    settingTitle,
    Tab, Tabs,
    noContent
  },
  filters: {
    stringsub(value) {
      return value.substr(0, 2)
    }
  },
  data() {
    return {
      readList: [],
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
    queryReadDetail({
      id: this.$route.query.id,
      courseId: this.$route.query.courseId,
      teachOrCare: this.$route.query.teachOrCare
    }).then(res => {
      res.data.data.forEach(cur => {
        if (cur.start) {
          this.readList = cur.noticeChildVOList
          this.readNumber = cur.count
        } else {
          this.noReadList = cur.noticeChildVOList
          this.noReadNumber = cur.count
        }
      })
    })
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
      height: 66px;
      display: flex;
      font-size: 15px;
      color: #222;
      align-items: center;
      justify-content: flex-start;
      border-top: 1px solid #eee;

      h3 {
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $theme;
        border-radius: 50%;
        font-size: 13px;
        color: #FFFFFF;
        font-weight: 500;
        margin-right: 10px;
      }

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
