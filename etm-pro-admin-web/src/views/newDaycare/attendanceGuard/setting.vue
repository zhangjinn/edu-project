<template>
  <div class="setting-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs v-model="tabsValue" tab-position="left" :show-toggle="false">
            <el-tab-pane label="病状类型" name="disease">
              <item-template
                :data.sync="dragData"
                btn-text="添加新类型"
                :no-slot="['color', 'unit']"
                @change="handleChange"
                @add="addItem"
                @delete="deleteItem"
                @focus="handleFocus"
                @blur="updateNew"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * setting create by Administrator
 * createTime 2021/1/15 15:05
 */
import itemTemplate from '@/views/newDaycare/childManage/components/itemTemplate'
import { queryIllnessList, updateIllnessItem, createIllnessItem, removeIllnessItem, sortIllnessItem } from '@/api/newDaycare/attendanceGuard'
export default {
  name: 'Setting',
  components: {
    itemTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      tabsValue: 'disease',
      dragData: [
        { text: '发烧' },
        { text: '头痛' },
        { text: '咳嗽' }
      ],
      oldText: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {
  },
  methods: {
    getData() {
      this.dragData = []
      queryIllnessList().then(res => {
        Array.isArray(res.data) && res.data.forEach(v => {
          this.dragData.push({
            text: v.illnessName,
            id: v.illnessId
          })
        })
        if (this.dragData.length) {
          this.dragData[0].editable = false
        }
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const leaveIllnessList = []
      this.dragData.forEach((v, i) => {
        leaveIllnessList.push({
          sortIndex: i,
          id: v.id
        })
      })
      sortIllnessItem(leaveIllnessList).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    addItem() {
      const data = this.dragData
      if (data.length) {
        if (data[data.length - 1] && !data[data.length - 1].text) {
          return this.$message.warning('请先填写前一项的内容')
        }
      }
      data.push({
        text: '',
        move: false
      })
    },
    deleteItem(e) {
      if (!this.dragData[e[0].index].text) {
        return this.dragData.splice(e[0].index, 1)
      }
      removeIllnessItem(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    updateNew(index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('病症类型内容不能为空')
      let p
      if (target.id) {
        // 存在id，修改
        p = updateIllnessItem({
          illnessId: target.id,
          illnessName: target.text
        })
      } else {
        // 不存在id，新增
        p = createIllnessItem(target.text)
      }
      p.then(res => {
        const result = res.data
        target.id = result.illnessId
        target.move = true
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    handleFocus(index) {
      this.oldText = this.dragData[index].text
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-wrap {
  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
