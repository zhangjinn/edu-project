<template>
  <div class="addDep-wrap">
    <el-form ref="dep" :model="depData" :rules="depRule" label-width="100px">
      <el-form-item v-if="type === 'dep'" label="上级企业">
        <span>{{ currentNode.data.name }}</span>
      </el-form-item>
      <el-form-item v-if="type === 'subDep'" label="上级部门">
        <span>{{ currentNode.data.name }}</span>
      </el-form-item>

      <el-form-item label="部门名称" prop="name">
        <el-input v-model="depData.name" placeholder="请输入名称" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
   *  2020/4/8 19:01
   *  haijinsha
   */
export default {
  name: 'AddDep',
  filters: {},
  mixins: [],
  inject: ['topInfo', 'currentNode'],
  props: {
    type: {
      type: String,
      default: 'dep'
    },
    dep: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      depData: this.dep,
      depRule: {
        name: { required: true, message: '请输入部门名称', trigger: 'blur' }
      }
    }
  },
  computed: {},
  watch: {
    org(val) {
      this.depData = val
    },
    dep(val) {
      this.depData = val
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    validator() {
      return this.$refs['dep'].validate()
    },
    resetFields() {
      this.$refs['dep'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .addDep-wrap {

  }
</style>
