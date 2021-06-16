<template>
  <etm-form
    ref="etmForm"
    type="dialog"
    :model="resignData"
  >
    <el-form-item label="已选员工">
      <span>{{ resignData.employeeRecordName }}</span>
    </el-form-item>
    <el-form-item
      label="离职原因"
      required
    >
      <el-select
        v-model="resignData.headquartersSettingId"
        @change="handleTemplateChange"
      >
        <el-option
          v-for="(temp, i) of resignTemplates"
          :key="i"
          :label="temp.label"
          :value="temp.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="备注"
      prop="content"
    >
      <el-input
        v-model="resignData.remarks"
        type="textarea"
        :rows="4"
      />
    </el-form-item>
  </etm-form>
</template>

<script>
/**
 * resign create by Administrator
 * createTime 2021/1/30 13:34
 */
import { queryStaffSettingsList } from '@/api/newDaycare/staffFile'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'Resign',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    resignData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      resignTemplates: [],
      remarks: ''
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      queryStaffSettingsList({ type: 'RESIGN' }).then(res => {
        console.log(res, '离职原因列表')
        this.resignTemplates = this.convertDataToOptions(res.data, 'headquartersSettingName', 'headquartersSettingId')
      })
    },
    handleTemplateChange () {
      const find = this.resignTemplates.find(item => item.value === this.resignData.headquartersSettingId)
      console.log(find, 'din')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
