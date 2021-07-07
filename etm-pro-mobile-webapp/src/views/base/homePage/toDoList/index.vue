<template>
  <div class="index-wrap">
    <etm-mobile-title @reback="reback">待办提醒</etm-mobile-title>
    <!--    <div class="listBox">-->
    <!--      <van-cell is-link>-->
    <!--        <div class="list">-->
    <!--          <div class="tag approve">审批</div>-->
    <!--          <div class="content van-ellipsis">-->
    <!--            有<span class="approve">5</span>个请假申请需要审批-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </van-cell>-->
    <!--      <van-cell is-link>-->
    <!--        <div class="list">-->
    <!--          <div class="tag confirm">确认</div>-->
    <!--          <div class="content van-ellipsis">-->
    <!--            有<span class="confirm">5</span>名学员交待事宜需要确认-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </van-cell>-->
    <!--      <van-cell is-link>-->
    <!--        <div class="list">-->
    <!--          <div class="tag warn">提醒</div>-->
    <!--          <div class="content van-ellipsis">-->
    <!--            有<span class="warn">5</span>名学员交待事宜需要确认-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </van-cell>-->
    <!--    </div>-->
    <div class="noData">
      <no-content type="none" message="暂无提醒" />
    </div>
  </div>

</template>

<script>
import EtmMobileTitle from '@/components/EtmMobileTitle'
import { queryDashboardResource } from '@/service/base/basic'
import NoContent from '@/components/common/noContent'

/**
 * index create by Administrator
 * createTime 2020/11/24 9:41
 */
export default {
  name: 'Index',
  components: { NoContent, EtmMobileTitle },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      listData: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    reback() {
      this.$router.back(-1)
    },
    getData() {
      const param = {
        terminalType: 'MOBILE'
      }
      queryDashboardResource(param).then(res => {
        const resourceData = res.data.data
        this.listData = []
        resourceData.forEach(item => {
          if (item.type === 'TODO') {
            item.config = JSON.parse(item.config)
            this.listData.push(item)
          }
        })
        console.log(this.listData)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  min-height: 100%;
  background-color: $white;

  .listBox {
    padding: 0 12px;

    .van-cell {
      padding: 16px 0;

      .list {
        display: flex;

        .tag {
          width: 40px;
          font-size: 11px;
          text-align: center;
          border-radius: 4px;

          &.approve {
            color: $red;
            background-color: rgba(245, 57, 57, .08);
          }

          &.confirm {
            color: $blue;
            background-color: rgba(66, 143, 250, .08);
          }

          &.warn {
            color: #FFAD45;
            background-color: rgba(255, 113, 69, .08);
          }
        }

        .content {
          margin-left: 10px;
          font-size: 15px;

          .approve {
            color: $red;
          }

          .confirm {
            color: $blue;
          }

          .warn {
            color: #FFAD45;
          }
        }
      }
    }
  }
  .noData{
    padding-top: 120px;
  }
}
</style>
