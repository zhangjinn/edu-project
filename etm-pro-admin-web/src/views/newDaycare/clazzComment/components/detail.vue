<template>
  <div class="detail-wrap">
    <etm-layout-split>
      <etm-title :title="drawerTitle" border size="big" />
      <etm-tabs v-model="tabsValue" :setting="false" :show-toggle="false">
        <el-tab-pane
          label="在园表现"
          name="IN_THE_PARK"
        />
        <el-tab-pane
          label="在家表现"
          name="AT_HOME"
        />
      </etm-tabs>
      <div>
        <div class="behaviorWrap">
          <!-- <tabs :value.sync="tabsValue" /> -->
          <ul v-if="behaviorList.length" class="score">
            <li v-for="(item, index) in behaviorList" :key="index">
              <span style="width:80px;">{{ item.whichPerformedName }}</span>
              <div>
                <img v-if="item.rate===1" src="../../../../assets/images/img-tbl-select.png" alt="">
                <img v-else src="../../../../assets/images/icon-tbl-normal.png" alt="">
              </div>
              <div>
                <img v-if="item.rate===2" src="../../../../assets/images/img-yjb-select.png" alt="">
                <img v-else src="../../../../assets/images/icon-yjb-normal.png" alt="">
              </div>
              <div>
                <img v-if="item.rate===3" src="../../../../assets/images/img-yjy-select.png" alt="">
                <img v-else src="../../../../assets/images/icon-yjy-normal.png" alt="">
              </div>
            </li>
          </ul>
          <etm-title :show-line="false" border>{{ tabsValue === 'AT_HOME' ? '家长寄语' : '老师寄语' }}</etm-title>
          <div class="commentText">
            {{ commentText }}
          </div>
          <div class="bImg">
            <div class="demo-image__preview">
              <el-image
                v-for="(item,index) in srcList"
                :key="index"
                style="width: 100px; height: 100px"
                :src="item"
                fit="cover"
                :preview-src-list="srcList"
              />
            </div>
          </div>
        </div>
      </div>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * detail create by Administrator
 * createTime 2021/01/13 17:57
 */
import { queryTeachDetails, queryCacDetails, queryToddler } from '@/api/newDaycare/clazzComment'

export default {
  name: 'Detail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    revId: {
      type: Number,
      default: null
    },
    setType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      drawerTitle: '',
      tabsValue: 'IN_THE_PARK',
      behaviorList: [],
      commentText: '',
      srcList: [],
      dataList: null
    }
  },
  computed: {},
  watch: {
    tabsValue: {
      handler() {
        this.getDetail()
      },
      deep: true
    }
  },
  created() {
    // console.log(this.revId)
    this.getDetail()
  },
  mounted() {
  },
  methods: {
    getDetail() {
      if (this.setType === 'teach') {
        queryTeachDetails({ reviewsId: this.revId }).then(res => {
          // console.log(res)
          const show = {
            'YOU_RE_GREAT': 1,
            'BETTER': 2,
            'MUST_WORK_HARD': 3
          }
          this.srcList = []
          this.behaviorList = []
          this.commentText = ''
          res.data.forEach(v => {
            if (v.whichPerformedType === this.tabsValue) {
              if (v.clazzName) {
                this.drawerTitle = v.childName + '(' + v.clazzName + ')'
              } else {
                this.drawerTitle = v.childName
              }
              this.commentText = v.teachersMessage
              v.tcReviewsWhichPerformeds.forEach(i => {
                this.behaviorList.push({
                  whichPerformedName: i.whichPerformedItemName,
                  rate: show[i.whichPerformedItemValue]
                })
              })
              v.imageList.forEach(i => {
                this.srcList.push(i.url)
              })
            }
          })
        })
      } else if (this.setType === 'care') {
        queryCacDetails({ reviewsId: this.revId }).then(res => {
          // console.log(res)
          const show = {
            'YOU_RE_GREAT': 1,
            'BETTER': 2,
            'MUST_WORK_HARD': 3
          }
          this.srcList = []
          this.behaviorList = []
          this.commentText = ''
          res.data.forEach(v => {
            if (v.whichPerformedType === this.tabsValue) {
              if (v.clazzName) {
                this.drawerTitle = v.childName + '(' + v.clazzName + ')'
              } else {
                this.drawerTitle = v.childName
              }
              this.commentText = v.teachersMessage
              v.caCreviews.forEach(i => {
                this.behaviorList.push({
                  whichPerformedName: i.whichPerformedItemName,
                  rate: show[i.whichPerformedItemValue]
                })
              })
              v.imageList.forEach(i => {
                this.srcList.push(i.url)
              })
            }
          })
        })
      } else if (this.setType === 'toddler') {
        queryToddler({ performanceId: this.revId }).then(res => {
          const data = res.data
          // console.log(data)
          this.srcList = []
          this.behaviorList = []
          this.commentText = ''
          this.drawerTitle = data.childName + '(' + data.clazzName + ')'
          this.dataList = null
          if (this.tabsValue === 'IN_THE_PARK') {
            this.dataList = data.guard
          } else {
            this.dataList = data.parent
          }
          this.commentText = this.dataList.message
          this.dataList.rateList.forEach(v => {
            this.behaviorList.push({
              whichPerformedName: v.itemName,
              rate: v.rate
            })
          })
          this.dataList.imageList.forEach(i => {
            this.srcList.push(i.url)
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-wrap {

  .behaviorWrap {
    .score {
      margin-bottom: 24px;

      li {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 54px;
        //padding: 0 24px;
        padding-right: 24px;
        //border-bottom: 1px solid $text-e;
        div {
          width: 54px;
          height: 54px;
        }

        img {
          width: 54px;
          height: 54px;
        }

        span {
          font-size: 13px;
        }
      }
    }
  }

  .commentText {
    margin-bottom: 8px;
  }

  .bImg {
    .demo-image__preview {
      display: flex;
      //justify-content: space-around;
      justify-content: left;
      flex-wrap: wrap;

      ::v-deep .el-image {
        margin: 8px 20px 0 0;
        width: 100px;
        height: 100px;
        border-radius: 4px;
      }
    }
  }
}
</style>
