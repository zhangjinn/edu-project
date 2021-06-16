<template>
  <div class="Form-wrap">
    <etm-form type="dialog" :model="model" :rules="rules">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="model.name" placeholder="必填星号在右侧" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="model.age" />
      </el-form-item>
    </etm-form>

    <etm-form type="small">
      <el-form-item label="测试测试测试的">
        <el-select v-model="value" />
      </el-form-item>
    </etm-form>

    <etm-form type="big">
      <el-form-item label="默认 click 触发子菜单" required>
        <div class="block">
          <el-cascader
            v-model="value"
            :options="options"
          />
        </div>
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>
/**
 * Form create by haijinsha
 * createTime 2020/9/28 19:58
 */
export default {
  name: 'Form',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      value: '',
      options: [],
      model: {
        name: '',
        age: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    }
  }
}
</script>
<style lang="scss" scoped>
  .Form-wrap {

  }
</style>
