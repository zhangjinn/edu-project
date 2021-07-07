<template>
  <div class="earlyType">
    <etm-table-tool-bar>
      <el-input v-model.trim="keyword" placeholder="请输入套餐名称" @keyup.native.enter="getData">
        <i slot="suffix" class="el-icon-search el-input__icon" @click.stop="getData" />
      </el-input>
    </etm-table-tool-bar>
    <etm-table
      :columns="columns"
      :data="tableData"
      selection
      @selection-change="selection"
    />
  </div>
</template>
<script>
import { queryNurseSetMeal } from '@/api/newDaycare/courseManage'

export default {
  data() {
    return {
      selectionData: [],
      keyword: '',
      columns: [
        { label: '套餐名', prop: 'caeCoursePackageName' },
        { label: '总价', prop: 'totalPrice' }
      ],
      tableData: [{}]
    }
  },
  computed: {},
  methods: {
    selection(event) {
      this.selectionData = event
    },
    getSelectionData() {
      let emptyText = ''
      this.selectionData.forEach(cur => {
        if (cur.caeCoursePackageItemList && !cur.caeCoursePackageItemList.length) {
          emptyText += `${cur.caeCoursePackageName}套餐内容为空,`
        }
      })

      if (emptyText) {
        this.$message.warning(`${emptyText}，不可选择，请完善套餐内容。`)
        return {
          name: 'SET_MEAL',
          list: false
        }
      } else {
        return {
          name: 'SET_MEAL',
          list: this.selectionData
        }
      }
    },
    getData() {
      queryNurseSetMeal(this.keyword).then(res => {
        // console.log(res.data, 'tc')
        this.tableData = (res.data || []).map(cur => {
          if (cur['image'] && cur['image'].length) {
            cur.img = cur['image'][0].url
          } else {
            cur.img = ''
          }

          cur.caeCoursePackageItemList = cur.caeCoursePackageItemList.map(c => {
            if (c['image'] && c['image'].length) {
              c.img = c['image'][0].url
            } else {
              c.img = ''
            }
            return c
          })

          return cur
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.earlyType {
  .el-input__icon {
    cursor: pointer;
  }
}
</style>
