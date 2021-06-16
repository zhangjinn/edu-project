<template>
  <div class="edit-wrap">
    <etm-form
      ref="form"
      :model="form"
      type="dialog"
    >
      <el-form-item
        :rules="formValidate.nullValueRule(true,'请输入区域名称')"
        prop="organizationName"
        label="区域名称"
      >
        <el-input
          v-model="form.organizationName"
          maxlength="10"
          placeholder="请输入区域名称"
        />
      </el-form-item>
      <el-form-item
        :rules="formValidate.nullValueRule(true,'请选择总部企业')"
        prop="value"
        label="选择总部企业"
      >
        <el-cascader
          v-model="form.value"
          :options="options"
          :props="{ checkStrictly: true,children: 'childList', label:'name',value:'id' }"
          :clearable="false"
          @change="handleChange"
        />
      </el-form-item>
    </etm-form>
    <etm-title :show-line="false">
      区域子企业
    </etm-title>
    <etm-table
      :columns="columns"
      :data="tableData"
    />
  </div>
</template>

<script>
/**
 * edit create by Administrator
 * createTime 2021/01/28 16:06
 */
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryTree, querySonOrganization } from '@/api/newDaycare/areaSetHead'
import { deepClone } from '@/views/newDaycare/contract/common'

export default {
  name: 'Edit',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    editMsg: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      formValidate,
      form: {
        organizationName: null,
        value: null
      },
      options: [],
      columns: [
        { label: '企业名称', prop: 'organizationName' },
        { label: '面积(平方米)', prop: 'gardenArea' },
        { label: '员工数', prop: 'employeeNumber' },
        { label: '学员数', prop: 'childNumber' }
      ],
      tableData: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getOrganization()
    this.form.organizationName = this.editMsg.organizationName
    this.form.value = this.editMsg.organizationId
    this.getSon()
  },
  mounted () {
  },
  methods: {
    getOrganization () {
      queryTree().then(res => {
        const options = this.callBack(res.data.root.childList)
        // console.log(options)
        this.options = options
      })
    },
    callBack (arr) {
      const data = deepClone(arr)
      const result = []
      data.forEach(cur => {
        // if (cur['type'] !== 'ENTERPRISE') {
        //   return false
        // }
        if (cur.type === 'ENTERPRISE') {
          cur.childList = cur.childList.length ? this.callBack(cur.childList) : []
          result.push(cur)
        }
      })
      return result
    },
    getSon () {
      querySonOrganization({ organizationId: this.form.value }).then(res => {
        this.tableData = res.data
      })
    },
    handleChange () {
      querySonOrganization({ organizationId: this.form.value[this.form.value.length - 1] }).then(res => {
        this.tableData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
