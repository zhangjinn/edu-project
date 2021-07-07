<template>
  <div class="addType-wrap">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="类型名称:" prop="courseCategoryName">
        <el-input v-model="form.courseCategoryName" placeholder="请输入类型名称" />
      </el-form-item>

      <el-form-item label="是否显示:" prop="enable">
        <el-switch v-model="form.enable" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
   *  2020/4/19 9:40
   *  haijinsha
   */
export default {
  name: 'AddType',
  filters: {},
  mixins: [],
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: this.value,
      rules: {
        courseCategoryName: { required: true, message: '请输入类型名称', trigger: 'blur' },
        enable: { required: false, message: '请选择是否显示', trigger: 'change' }
      }
    }
  },
  computed: {},
  watch: {
    value(val) {
      this.form = val
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    validator() {
      return this.$refs['form'].validate()
    },
    resetFields() {
      this.$refs['form'].resetFields()
      return this
    }
  }
}
</script>

<style lang="scss" scoped>
  .addType-wrap {

  }
</style>
