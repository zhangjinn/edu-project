<template>
  <div class="checkDetail-wrap">
    <etm-layout-split>
      <div>
        <etm-title :show-line="false" border :title="checkTitle" size="big">
          <template slot="tool">
            <el-button plain size="mini" @click.stop="exportExcel">导出Excel</el-button>
          </template>
        </etm-title>
      </div>
      <div>
        <etm-table :columns="columns" :data="tableData" border />
      </div>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * checkDetail create by Administrator
 * createTime 2020/09/18 14:18
 */
import {
  queryDetail,
  queryDetailExport
} from '@/api/newDaycare/bodyCheck'
import { downloadFileForUrl } from '@/utils/file'

export default {
  name: 'CheckDetail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    assignBatchId: {
      type: Number,
      default: 0
    },
    checkTitle: {
      type: String,
      default: ''
    },
    ovTime: {
      type: String,
      default: ''
    },
    examinationSettingsId: {
      type: [String, Number],
      required: true,
      default: ''
    }
  },
  data() {
    return {
      tab1: 'tab1',
      columns: [
        { label: '会员姓名', prop: 'childName' },
        { label: '检查类型', prop: 'checkTypeName' },
        { label: '体温', prop: 'bodyTemperatureStr' },
        { label: '症状', prop: 'checkSettingsNames' }
      ],
      tableData: []
    }
  },
  computed: {},
  watch: {
    assignBatchId: {
      handler() {
        this.getDetail()
      },
      deep: true
    }
  },
  created() {
    // console.log(this.assignBatchId)
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      queryDetail({
        date: this.ovTime,
        clazzId: this.assignBatchId,
        examinationSettingsId: this.examinationSettingsId
      }).then(res => {
        this.tableData = res.data
      })
    },
    exportExcel() {
      queryDetailExport({
        date: this.ovTime,
        clazzId: this.assignBatchId,
        examinationSettingsId: this.examinationSettingsId
      }).then(res => {
        downloadFileForUrl(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.checkDetail-wrap {
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }
}
</style>
