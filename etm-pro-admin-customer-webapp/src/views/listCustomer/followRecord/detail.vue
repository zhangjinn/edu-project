<template>
  <div class="detail-wrap">
    <etm-drawer
      :visible.sync="isShow"
    >
      <etm-layout-split>
        <div>
          <etm-title
            :show-line="false"
            border
          >
            跟进详情
          </etm-title>

          <div>
            <etm-field-label label="跟进内容">
              {{ row.followContent }}
            </etm-field-label>
            <etm-field-label label="跟进方式">
              {{ row.followWay }}
            </etm-field-label>
            <etm-field-label label="跟进时间">
              {{ row.followTime }}
            </etm-field-label>
            <etm-field-label label="下次跟进时间">
              {{ row.nextFollowTime }}
            </etm-field-label>
            <etm-field-label label="操作人">
              {{ row.operator }}
            </etm-field-label>

            <div>
              <el-image
                v-for="(item, index) in row.followImg"
                :key="index"
                fit="cover"
                :src="item"
                style="width:100px; height:100px; margin-right:20px"
                :preview-src-list="row.followImg"
              />
            </div>
          </div>
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
// import nestingTable from '@/views/customer/listCustomer/myCustomer/components/pops/nestingTable3'
import {
  queryFollowDetail
} from '@/api/customer'
import { parseTime } from '@/utils'
export default {
  name: 'Detail',
  components: {
  //  nestingTable
  },
  filters: {
    toFixed (n) {
      return n.toFixed(2)
    }
  },
  props: {
    orderId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      templateData: [],
      isShow: false,
      row: {
        amount: 0,
        annex: []
      }
    }
  },
  watch: {
    isShow: {
      handler (n) {
        if (n) {
          this.$nextTick(() => {
            this.init()
          })
        }
      }
    }
  },
  methods: {
    // download(url) {
    //   const link = document.createElement('a')
    //   link.href = url
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    // },
    init () {
      queryFollowDetail(this.orderId).then(res => {
        res.data.followTime = res.data.followTime ? parseTime(res.data.followTime, '{y}-{m}-{d}') : ''
        res.data.nextFollowTime = res.data.nextFollowTime ? parseTime(res.data.nextFollowTime, '{y}-{m}-{d}') : ''
        // res.data.annex = res.data.annex || []
        res.data.followImg = res.data.followImg.map(cur => {
          return cur.url
        })
        this.row = res.data
        // this.templateData = res.data.orderItemList
      })
    },
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
    }

  }
}
</script>

<style scoped lang="scss">
::v-deep{
  .EtmText-wrap{
    margin-right: 8px;
  }
}
.detail-wrap{

}
</style>
