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

import { getClazz } from '@/api/guardcare/edu/clazzManage'
import { getGrade } from '@/api/guardcare/edu/gradeManage'
export default {
  name: 'EtmSearchClass',
  mixins: [baseMixin],
  props: {

  },
  data () {
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
  created () {
    this.getGradeList('firstTrigger')
  },
  methods: {
    // 初始化班级
    initClazz () {
      if (this.gradeOptions.length > 0) {
        this.formDataSlot.value1 = this.gradeOptions[0].value
        this.formDataSlot.value1Label = this.gradeOptions[0].label
        this.changeGrade(this.formDataSlot.value1, 'firstTrigger')
      }
    },

    // 获取年级列表
    getGradeList (firstTrigger) {
      const param = {
        paged: false
      }
      getGrade(param).then((res) => {
        this.gradeOptions = this.convertDataToOptions(res.data, 'name', 'id')
        if (this.gradeOptions.length > 0) {
          this.formDataSlot.value1 = this.gradeOptions[0].value
          this.formDataSlot.value1Label = this.gradeOptions[0].label
          this.changeGrade(this.formDataSlot.value1, firstTrigger)
        }
      })
    },

    // 获取班级列表
    getClazzList (id, firstTrigger) {
      const param = {
        gradeId: id,
        paged: false
      }
      getClazz(param).then((res) => {
        this.clazzOptions = this.convertDataToOptions(res.data, 'name', 'id')
        if (this.clazzOptions.length > 0) {
          this.formDataSlot.value2 = this.clazzOptions[0].value
          this.formDataSlot.value2Label = this.clazzOptions[0].label
        }

        if (firstTrigger) {
          this.$emit('firstTrigger')
        }
      })
    },

    // 改变年级切换对应班级
    changeGrade (id, firstTrigger) {
      let name = ''
      this.gradeOptions.map((val, index) => {
        if (id === val.value) {
          name = val.label
        }
      })
      this.formDataSlot.value1Label = name

      this.formDataSlot.value2 = null
      this.formDataSlot.value2Label = null
      this.getClazzList(id, firstTrigger)
    },

    // 班级改变
    changeClazz (id) {
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
