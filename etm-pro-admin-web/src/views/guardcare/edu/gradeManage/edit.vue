<template>
  <etm-form ref="form" :model="form" type="dialog">
    <el-form-item
      label="年级名称"
      prop="name"
      :rules="formValidate.nullValueRule(true,'请输入年级名称')"
    >
      <el-input
        v-model="form.name"
        maxlength="10"
        placeholder="请输入年级名称"
      />
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import {
  getGradeItem
} from '@/api/guardcare/edu/gradeManage'
export default {
  name: 'EditClass',
  props: {
    type: {
      type: String,
      default: 'add',
      validator(val) {
        return ['add', 'edit'].includes(val)
      }
    },
    itemId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formValidate,
      form: {
        name: ''
      }

    }
  },
  created() {
    if (this.type === 'edit') {
      this.getGradeItemData()
    }
  },
  methods: {
    getGradeItemData() {
      const id = this.itemId
      getGradeItem(id).then((res) => {
        const { data } = res

        this.form = {
          name: data.name
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
