<template>
  <div class="index-wrap">
    <el-cascader
      v-model="clazzValue"
      :props="prop"
      placeholder="请选择班级"
      clearable
      @change="select"
    />
  </div>

</template>

<script>
// import { getClazzList, getGradeList } from '@/api/guardcare/childManage/childManage'
import { getGrade } from '@/api/newDaycare/listEduGuardGradeManage'
import { getClazz } from '@/api/newDaycare/listEduGuardClazzManage'
/**
 * index create by Administrator
 * createTime 2020/9/8 11:10
 */
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {
    clear: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      clazzValue: [],
      prop: {
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.level === 0) {
            const param = {
              paged: false
            }
            getGrade(param).then(res => {
              const gradeList = res.data.map((value, i) => ({
                value: value.id,
                label: value.name,
                leaf: node.level >= 1
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(gradeList)
            })
          }
          if (node.level === 1) {
            const param = {
              gradeId: node.value,
              paged: false
            }
            getClazz(param).then(res => {
              const clazzList = res.data.map((value, i) => ({
                value: value.id,
                label: value.name,
                leaf: node.level >= 1
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(clazzList)
            })
          }
        }
      }
    }
  },
  computed: {},
  watch: {
    clear() {
      this.clazzValue = []
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    select(value) {
      this.$emit('change', value)
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

}
</style>
