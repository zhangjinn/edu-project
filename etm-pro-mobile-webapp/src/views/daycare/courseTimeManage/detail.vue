<template>
  <div class="detail-wrap">
    <setting-title>
      课程详情
    </setting-title>

    <div class="detail-lists">
      <div class="detail-item">
        <p>课程名称</p>
        <span>{{ detail.courseName }}</span>
      </div>
      <div class="detail-item">
        <p>学员/容纳</p>
        <span>{{ detail.currentFormalChildNum + detail.currentExpChildNum }}/{{ detail.totalFormalChildNum + detail.totalExpChildNum }}</span>
      </div>
      <div class="detail-item">
        <p>上课班级</p>
        <span>{{ detail.clazzName }}</span>
      </div>
      <div class="detail-item">
        <p>班主任</p>
        <span>{{ detail.headTeacherName }}</span>
      </div>
      <div class="detail-item">
        <p>授课老师</p>
        <span>{{ detail.teacherName }}</span>
      </div>
      <div class="detail-item">
        <p>助教老师</p>
        <span>{{ (detail.helperTeacherList || []).join(',') }}</span>
      </div>
      <div class="detail-item">
        <p>上课教室</p>
        <span>{{ detail.classsroomName }}</span>
      </div>
      <div class="detail-item">
        <p>日期</p>
        <span>{{ detail.courseDate }}</span>
      </div>
      <div class="detail-item">
        <p>上课时段</p>
        <span>{{ detail.courseTimePeriod }}</span>
      </div>
    </div>

    <collapse v-model="activeNames">
      <collapse-item
        v-if="detail['expChildList']"
        :title="`学员/试听学位 ${detail.currentExpChildNum}/${detail.totalExpChildNum}`"
        name="1"
      >
        <div v-if="detail.expChildList.length" class="table">
          <div class="table-tr table-th">
            <div class="table-td">姓名</div>
            <div class="table-td">性别</div>
            <div class="table-td">考勤状态</div>
          </div>
          <div v-for="(item, index) in detail.expChildList" :key="index" class="table-tr">
            <div class="table-td">{{ item.name }}</div>
            <div class="table-td">{{ item.gender === 'MALE' ? '男' : '女' }}</div>
            <div class="table-td">
              <p :class="[`color${status[item.attendStatus].number}`, 'status']">{{
                status[item.attendStatus].text
              }}</p>
            </div>
          </div>
        </div>
        <no-content v-else />
      </collapse-item>
      <collapse-item
        v-if="detail['formalChildList']"
        :title="`学员/正式学位 ${detail.currentFormalChildNum}/${detail.totalFormalChildNum}`"
        name="2"
      >
        <div v-if="detail.formalChildList.length" class="table">
          <div class="table-tr table-th">
            <div class="table-td">姓名</div>
            <div class="table-td">性别</div>
            <div class="table-td">考勤状态</div>
          </div>
          <div v-for="(item, index) in detail.formalChildList" :key="index" class="table-tr">
            <div class="table-td">{{ item.name }}</div>
            <div class="table-td">{{ item.gender === 'MALE' ? '男' : '女' }}</div>
            <div class="table-td">
              <p :class="[`color${status[item.attendStatus].number}`, 'status']">{{
                status[item.attendStatus].text
              }}</p>
            </div>
          </div>
        </div>
        <no-content v-else />
      </collapse-item>

    </collapse>
  </div>

</template>

<script>
/**
 * detail create by Administrator
 * createTime 2020/10/20 16:05
 */
import settingTitle from '@/views/daycare/weekPlan/components/settingTitle'
import { Collapse, CollapseItem } from 'vant'
import { queryCourseDetail } from '@/service/daycare/courseTime'
import { DateFormat } from '@/js/rules'
import noContent from '@/components/common/noContent'

export default {
  name: 'Detail',
  components: {
    settingTitle,
    CollapseItem,
    Collapse,
    noContent
  },

  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeNames: [],
      detail: {},
      status: {
        '未考勤': {
          text: '未考勤',
          number: 1
        },
        '已入园': {
          text: '已入园',
          number: 1
        },
        '已离园': {
          text: '已离园',
          number: 1
        },
        '缺勤': {
          text: '缺勤',
          number: 1
        },
        '请假': {
          text: '请假',
          number: 1
        },
        '有效请假': {
          text: '有效请假',
          number: 1
        }
      }
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {
    // console.log(this.$route.query.id)
    this.getData({
      courseManagementType: this.$route.query.type,
      courseManagementId: this.$route.query.id
    })
  },
  methods: {
    getData(query) {
      queryCourseDetail(query).then(res => {
        console.log(res)
        res.data.data.courseDate = DateFormat(res.data.data.courseDate, 'yyyy-MM-dd')
        this.detail = res.data.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-wrap {
  ::v-deep{
    .settingTitle{
      color: #fff;
    }
  }
  .table {
    .table-tr {
      display: flex;
      align-items: center;
      height: 34px;
      color: #222;
      font-size: 14px;
      //text-align: left;

      &.table-th {
        color: #999999;
      }

      .table-td {
        flex: 1;

        .status {
          padding-left: 12px;
          position: relative;
          display: inline-block;

          &:before {
            content: '';
            display: block;
            width: 4px;
            height: 4px;
            position: absolute;
            border-radius: 50%;
            left: 0;
            top: 50%;
            transform: translate(0, -50%);
          }

          &.color1 {
            color: $theme;

            &:before {
              background: $theme;
            }
          }

          &.color2 {
            color: #46B642;

            &:before {
              background: #46B642;
            }
          }

          &.color3 {
            color: #FF5F45;

            &:before {
              background: #FF5F45;
            }
          }
        }
      }
    }
  }

  .detail-lists {
    margin: 12px;
    background: #fff;
    padding: 14px 20px;
    border-radius: 6px;

    .detail-item {
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      align-items: center;
      font-size: 14px;
      color: #999;

      span {
        color: #222;
      }
    }
  }

}
</style>
