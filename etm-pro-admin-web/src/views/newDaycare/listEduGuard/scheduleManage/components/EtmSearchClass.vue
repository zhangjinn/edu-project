<template>
  <el-form-item label="班级:">
    <el-select
      ref="selection"
      v-model="formDataSlot.value1"
      filterable
      placeholder="请选择年级"
      @change="changeGrade"
    >
      <el-option
        v-for="item in gradeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="formDataSlot.value2"
      filterable
      placeholder="请选择班级"
      @change="changeClazz"
    >
      <el-option
        v-for="item in clazzOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { getClazz } from '@/api/newDaycare/listEduGuardClazzManage'
import { getGrade } from '@/api/newDaycare/listEduGuardGradeManage'
export default {
  name: 'EtmSearchClass',
  mixins: [baseMixin],
  props: {

  },
  data() {
    return {
      formDataSlot: {
        value1: null,
        value2: null,
        value1Label: null,
        value2Label: null
      },
      gradeOptions: [],
      clazzOptions: []
    }
  },

  methods: {
    // 获取年级列表
    async getGradeList() {
      const param = {
        paged: false,
        noLoadding: true
      }
      await getGrade(param).then((res) => {
        this.gradeOptions = this.convertDataToOptions(res.data, 'name', 'id')
        if (this.gradeOptions.length > 0) {
          this.formDataSlot.value1 = this.gradeOptions[0].value
          this.formDataSlot.value1Label = this.gradeOptions[0].label
        }
      })
      await this.changeGrade(this.formDataSlot.value1)
    },

    // 改变年级切换对应班级
    async changeGrade(id) {
      let name = ''
      this.gradeOptions.map((val, index) => {
        if (id === val.value) {
          name = val.label
        }
      })
      this.formDataSlot.value1Label = name
      this.formDataSlot.value2 = null
      this.formDataSlot.value2Label = null

      const param = {
        gradeId: id,
        paged: false,
        noLoadding: true
      }
      await getClazz(param).then((res) => {
        this.clazzOptions = this.convertDataToOptions(res.data, 'name', 'id')
        if (this.clazzOptions.length > 0) {
          this.formDataSlot.value2 = this.clazzOptions[0].value
          this.formDataSlot.value2Label = this.clazzOptions[0].label
        }
      })
    },

    // 班级改变
    changeClazz(id) {
      let name = ''
      this.clazzOptions.map((val, index) => {
        if (id === val.value) {
          name = val.label
        }
      })
      this.formDataSlot.value2Label = name
    }

  }
}
</script>

<style scoped>

</style>
