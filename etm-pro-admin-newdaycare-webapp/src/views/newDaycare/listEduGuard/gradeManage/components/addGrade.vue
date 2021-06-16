<template>
  <div class="addSource-wrap">
    <etm-form
      ref="rechargeForm"
      type="dialog"
      :model="addGradeData"
    >
      <el-form-item
        label="年级名称"
        prop="name"
        :rules="addRules.name"
      >
        <el-input
          v-model="addGradeData.name"
          placeholder="请输入年级名称"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * addSource create by Administrator
 * createTime 2021/1/15 10:33
 */
export default {
  name: 'AddSource',
  components: {},
  filters: {},
  mixins: [],
  props: {
    addGradeData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      addRules: {}
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
