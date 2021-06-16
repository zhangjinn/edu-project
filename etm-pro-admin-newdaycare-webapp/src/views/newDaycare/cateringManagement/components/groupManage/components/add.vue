<template>
  <div class="add-wrap">
    <etm-form
      ref="form"
      :model="addForm"
      type="dialog"
    >
      <el-form-item label="人群名称">
        <el-input v-model="addForm.peopleName" />
      </el-form-item>
      <el-form-item label="是否清真">
        <el-radio-group v-model="addForm.isQZ">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="餐别组合">
        <el-checkbox-group v-model="addForm.canbieCombine">
          <el-checkbox label="复选框 A" />
          <el-checkbox label="复选框 B" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="人群范围">
        <el-input v-model="addForm.peopleName" />
      </el-form-item>
      <el-form-item label="平均年龄">
        <el-input v-model="addForm.peopleName" />
      </el-form-item>
      <el-form-item label="就餐人数">
        <el-input v-model="addForm.peopleName" />
      </el-form-item>
      <el-form-item label="男女比例">
        <el-input v-model="addForm.peopleName" />
      </el-form-item>
      <el-form-item label="周设置">
        <el-input v-model="addForm.peopleName" />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * add create by Administrator
 * createTime 2021/3/22 13:58
 */
export default {
  name: 'Add',
  components: {},
  filters: {},
  mixins: [],
  props: {
    addForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
