<template>
  <div class="detailSchedule-wrap">
    <etm-drawer
      :visible.sync="isShow"
    >
      <etm-layout-split>
        <etm-title border size="big">
          日程详情
          <template slot="tool">
            <template v-if="!isEdit">
              <el-button plain size="mini" @click="isEdit = true">编辑</el-button>
            </template>
            <template v-else>
              <el-button plain size="mini" @click="isShow = false">取消</el-button>
              <el-button type="primary" size="mini" @click="save">保存</el-button>
            </template>
          </template>
        </etm-title>
        <template v-if="!isEdit">
          <div class="label-box">
            <etm-field-label label="日程内容" type="left">
              {{ detail.scheduleName }}
            </etm-field-label>
            <etm-field-label label="班主任" type="left">
              {{ detail.clazzTeacherName }}
            </etm-field-label>
            <etm-field-label label="授课老师" type="left">
              {{ detail.teachTeacherName }}
            </etm-field-label>
            <etm-field-label label="助教老师" type="left">
              <p v-for="(item, index) in detail.helpTeacherNameList" :key="index">{{ item }}</p>
            </etm-field-label>
            <etm-field-label label="日程日期" type="left">
              {{ detail.date }}
            </etm-field-label>
            <etm-field-label label="日程时段" type="left">
              {{ detail.timePeriodName }}
            </etm-field-label>
          </div>
        </template>

        <template v-else>
          <add-form ref="addForm" :props="props" />
        </template>

      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>
/**
 * detailSchedule create by Administrator
 * createTime 2020/9/22 13:33
 */
import { queryScheduleDate, updateScheduleDetail } from '@/api/newDaycare/nurseSchedule'
import addForm from '@/views/newDaycare/courseTimeMangeCare/schedule/components/addPop/addForm2'
import { parseTime } from '@/utils'

export default {
  name: 'DetailSchedule',
  components: {
    addForm
  },
  filters: {},
  mixins: [],
  props: {
    props: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isShow: false,
      isEdit: false,
      detail: {}
    }
  },
  computed: {},
  watch: {
    props: {
      deep: true,
      handler(n) {
        // console.log(n['id'], !this.isEdit)
        this.$nextTick(() => {
          if (n['id'] && !this.isEdit) {
            this.init(n.id)
          }
        })
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    save() {
      this.$refs['addForm'].validate().then(res => {
        const _result = Object.assign(res, this.form)
        _result.helpTeacherId = _result.helpTeacherId.join(',')
        updateScheduleDetail(_result).then(res => {
          this.$message.success('更新日程成功')
          this.$emit('update', {})
          this.isShow = false
        })
      })
    },
    init(id) {
      queryScheduleDate(id).then(res => {
        res.data.date = parseTime(res.data.date, '{y}-{m}-{d}')
        this.detail = res.data
      })
    },
    show() {
      this.isEdit = false
      this.isShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
.detailSchedule-wrap {

}
</style>
