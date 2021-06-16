<template>
  <div class="detail-wrap">
    <etm-drawer :visible.sync="isShow">
      <etm-layout-split>
        <etm-title
          border
          :show-line="false"
          size="big"
        >
          学位详情
        </etm-title>

        <div class="label">
          <etm-field-label
            label="日期"
            type="left"
          >
            {{ props.day }}
          </etm-field-label>
          <!--          <etm-field-label label="已排课" type="left">{{-->
          <!--            detailData.countPositionBO.arrangementPositionNum-->
          <!--          }}-->
          <!--          </etm-field-label>-->
          <etm-field-label
            label="出勤"
            type="left"
          >
            {{ detailData.countPositionBO.attendPositionNum }}
          </etm-field-label>
          <etm-field-label
            label="请假"
            type="left"
          >
            {{ detailData.countPositionBO.leavePositionNum }}
          </etm-field-label>
          <etm-field-label
            label="在册"
            type="left"
          >
            {{ detailData.countPositionBO.inBookPositionNum }}
          </etm-field-label>
          <etm-field-label
            label="总学位"
            type="left"
          >
            {{ detailData.countPositionBO.totalPositionNum }}
          </etm-field-label>
        </div>

        <div
          v-for="(item, index) in detailData.courseVOList"
          :key="index"
        >
          <etm-title
            show-toggle
            open-text="收起"
            close-text="展开"
            @toggle="toggle(index)"
          >
            <span>{{ item.courseName + ' 学员/学位 ' + item.currentChildNum + '/' + item.positionNum }}</span>
          </etm-title>

          <el-collapse-transition>
            <etm-table
              v-if="showFormal[index]"
              :columns="columns"
              :data="item.childVOList"
            >
              <el-table-column
                slot="left"
                label="姓名"
              >
                <template slot-scope="scoped">
                  <etm-text type="primary">
                    {{ scoped.row.childName }}
                  </etm-text>
                </template>
              </el-table-column>
            </etm-table>
          </el-collapse-transition>
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
/**
 * detail create by Administrator
 * createTime 2020/9/17 11:41
 */
import { queryDegreeDetail } from '@/api/newDaycare/nurseSchedule'

export default {
  name: 'Detail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    props: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isShow: false,
      showFormal: [],
      columns: [
        {
          label: '性别',
          prop: 'gender',
          width: '120'
        },
        {
          label: '考勤状态',
          prop: 'status'
        }
      ],
      status: {
        NOT_ATTENDANCE: '未考勤',
        IN_SCHOOL: '已入园',
        OUT_SCHOOL: '已离园',
        ABSENT_FROM_WORK: '缺勤',
        ASK_FOR_LEAVE: '请假',
        EFFECTIVE_ASK_FOR_LEAVE: '有效请假'
      },
      gender: {
        MALE: '男',
        FEMALE: '女'
      },
      detailData: {
        countPositionBO: {
          arrangementPositionNum: 0,
          attendPositionNum: 0,
          inBookPositionNum: 0,
          leavePositionNum: 0,
          totalPositionNum: 0
        },
        courseVOList: []
      }
    }
  },
  computed: {},
  watch: {
    props: {
      // immediate: true,
      deep: true,
      handler (n) {
        if (Object.keys(n).length) {
          this.init(n)
        }
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    toggle (index) {
      this.$set(this.showFormal, index, !this.showFormal[index])
    },
    init ({ day }) {
      queryDegreeDetail(day).then(res => {
        this.detailData = res.data

        const result = res.data
        result.courseVOList.forEach((cur, index) => {
          result.courseVOList[index].childVOList = cur.childVOList.map((c) => {
            c.gender = this.gender[c.gender]
            return c
          })
        })
        this.detailData = result
      })
    },
    update () {

    },
    show () {
      this.isShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-wrap {
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }
}
</style>
