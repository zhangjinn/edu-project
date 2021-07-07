<template>
  <div class="adjustPop-wrap">
    <div class="clazzSel">
      <etm-clazz-cascader v-if="type === 'adjust'" @change="getClazz" />
      <el-select
        v-else-if="type === 'leave'"
        v-model="batchData.outReason"
        placeholder="选择退园原因"
      >
        <el-option
          v-for="item in reasinList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-transfer
      v-model="selValue"
      :titles="transferTitle"
      :button-texts="transferBtn"
      :data="childData"
      filterable
      filter-placeholder="输入班级或名字"
    />
  </div>

</template>

<script>/**
 * adjustPop create by Administrator
 * createTime 2020/8/21 10:23
 */

// import { getChildIn } from '@/api/guardcare/childManage/childManage'
import { getChildIn } from '@/api/newDaycare/listEduGuardChildManage'
import EtmClazzCascader from '@/components/EtmClazzCascader'

export default {
  name: 'AdjustPop',
  components: {
    EtmClazzCascader
  },
  filters: {},
  mixins: [],
  props: {
    batchData: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default() {
        return ''
      }
    },
    clazzId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      transferTitle: [],
      transferBtn: [],
      selValue: [],
      childData: [],
      clazzValue: [],
      reasinList: [
        {
          label: '毕业退园',
          value: 'GRADUATION'
        },
        {
          label: '转校退园',
          value: 'TRANSFER'
        },
        {
          label: '其他原因',
          value: 'OTHER'
        }
      ]
    }
  },
  computed: {},
  watch: {
    selValue() {
      this.batchData.value = []
      this.selValue.forEach(item => {
        this.batchData.value.push(this.childData[item])
      })
    }
  },
  created() {
    if (this.type === 'adjust') {
      this.transferTitle = ['调班前', '调班后']
      this.transferBtn = ['撤销', '调班']
    } else if (this.type === 'leave') {
      this.transferTitle = ['在园', '退园']
      this.transferBtn = ['撤销', '退园']
    }
  },
  mounted() {
    this.getChild()
  },
  methods: {
    getClazz(value) {
      this.batchData.clazz = value
    },
    getChild() { // 获取在园幼儿列表，不分页
      const param = {
        clazzId: this.clazzId
      }
      getChildIn(param).then(res => {
        this.childData = this.generateData(res.data)
      })
    },
    generateData(data) { // 处理幼儿数据，可以在穿梭框里显示
      const arr = []
      for (let i = 0; i < data.length; i++) {
        arr.push({
          key: i,
          label: data[i].clazzName + '-' + data[i].childName,
          childId: data[i].childId
        })
      }
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
.adjustPop-wrap {
  ::v-deep .el-transfer-panel {
    width: 250px;
  }

  .clazzSel {
    padding: 0 0 16px 374px;

    ::v-deep .el-cascader, .el-select {
      width: 250px;
    }
  }
}
</style>
