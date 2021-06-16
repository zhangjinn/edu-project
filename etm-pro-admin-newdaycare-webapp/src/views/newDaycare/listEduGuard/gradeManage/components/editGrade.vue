<template>
  <div class="editSource-wrap">
    <etm-title>
      编辑年级
      <template slot="tool">
        <template>
          <el-button
            plain
            size="mini"
            @click="cancel"
          >
            取消
          </el-button>
          <el-button
            plain
            size="mini"
            @click="save"
          >
            保存
          </el-button>
        </template>
      </template>
    </etm-title>

    <etm-form
      ref="rechargeForm"
      type="dialog"
      :model="editGradeData"
    >
      <el-form-item
        label="年级名称"
        prop="name"
      >
        <el-input
          v-model="editGradeData.name"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * editSource create by Administrator
 * createTime 2021/1/4 10:19
 */
// import { querySourceList } from '@/api/base/dashboardSource'

export default {
  name: 'EditSource',
  components: {},
  filters: {},
  mixins: [],
  props: {
    editGradeData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      typeList: [
        {
          label: '数据卡片',
          value: 'DATA_CARD'
        },
        {
          label: '快捷入口',
          value: 'QUICK_OPERATION'
        },
        {
          label: '待办事项',
          value: 'TODO'
        },
        {
          label: '数据报表一区',
          value: 'STATISTIC_CHART_ONE'
        },
        {
          label: '数据报表二区',
          value: 'STATISTIC_CHART_TWO'
        },
        {
          label: '数据报表三区',
          value: 'STATISTIC_CHART_THREE'
        }
      ],
      statusList: [
        {
          label: '禁用',
          value: false
        },
        {
          label: '启用',
          value: true
        }
      ],
      applicationList: [
        {
          label: '移动端',
          value: 'MOBILE'
        },
        {
          label: '电脑端',
          value: 'PC'
        }
      ]
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
    },
    cancel () {
      this.$emit('editCancel')
    },
    save () {
      this.$emit('editConfirm')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
