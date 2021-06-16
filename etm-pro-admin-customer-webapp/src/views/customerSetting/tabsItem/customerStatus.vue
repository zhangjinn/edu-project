<template>
  <div class="customerStatus">
    <div>
      <etm-title
        :border="true"
        show-toggle
        open-text=""
        close-text=""
      >
        未成交客户状态
      </etm-title>
      <item-template
        :data.sync="notDealData"
        :no-slot="['color', 'handle']"
        btn-text="添加新类型"
        @change="(...arg) => {
          handleType = 'NOT_DEAL_STATE'
          handleChange(arg)
        }"
        @add="(...arg) => {
          handleType = 'NOT_DEAL_STATE'
          addItem(arg)
        }"
        @delete="(...arg) => {
          handleType = 'NOT_DEAL_STATE'
          deleteItem(arg)
        }"
        @focus="(...arg) => {
          handleType = 'NOT_DEAL_STATE'
          handleFocus(arg)
        }"
        @blur="(...arg) => {
          handleType = 'NOT_DEAL_STATE'
          updateNew(arg)
        }"
      />
    </div>

    <div>
      <etm-title
        :border="true"
        show-toggle
        open-text=""
        close-text=""
      >
        已成交客户状态
      </etm-title>
      <item-template
        :data.sync="dealData"
        :no-slot="['color', 'handle']"
        btn-text="添加新类型"
        @change="(...arg) => {
          handleType = 'DEAL_STATE'
          handleChange(arg)
        }"
        @add="(...arg) => {
          handleType = 'DEAL_STATE'
          addItem(arg)
        }"
        @delete="(...arg) => {
          handleType = 'DEAL_STATE'
          deleteItem(arg)
        }"
        @focus="(...arg) => {
          handleType = 'DEAL_STATE'
          handleFocus(arg)
        }"
        @blur="(...arg) => {
          handleType = 'DEAL_STATE'
          updateNew(arg)
        }"
      />
    </div>
  </div>
</template>
<script>
import itemTemplate from './itemTemplate'
import {
  alterMultiSetting,
  queryMultiSettingList,
  removeMultiSettingItem
} from '@/api/customerSettings'
export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      notDealData: [],
      dealData: [],
      handleType: '',
      oldText: ''
    }
  },
  computed: {
    target () {
      if (this.handleType === 'NOT_DEAL_STATE') {
        return this.notDealData
      } else if (this.handleType === 'DEAL_STATE') {
        return this.dealData
      } else {
        return []
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.notDealData = []
      this.dealData = []
      const types = ['NOT_DEAL_STATE', 'DEAL_STATE']
      types.forEach(type => {
        queryMultiSettingList({ settingType: type }).then(res => {
          const { options } = res.data
          Array.isArray(options) && options.forEach(v => {
            if (type === 'NOT_DEAL_STATE') {
              this.notDealData.push({
                text: v.label || '',
                id: v.id,
                editable: !v.init
              })
            } else if (type === 'DEAL_STATE') {
              this.dealData.push({
                text: v.label || '',
                id: v.id,
                editable: !v.init
              })
            }
          })
        }).catch(err => {
          console.log(err)
        })
      })
    },
    handleChange () {
      const ids = []
      this.target.data.forEach(v => {
        ids.push(v.id)
      })
      // TODO: 调用接口进行排序
      // sortChildState(ids).then(res => {
      //   this.$message.success('操作成功')
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    addItem () {
      const data = this.target
      if (data[data.length - 1] && !data[data.length - 1].text) return this.$message.warning('请先填写前一项的内容')
      data.push({
        text: '',
        move: false
      })
    },
    deleteItem ([e]) {
      if (!this.target[e[0].index].text) return this.target.splice(e[0].index, 1)
      removeMultiSettingItem({ id: this.target[e[0].index].id }).then(res => {
        this.target.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew ([index]) {
      const target = this.target[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('状态内容不能为空')
      const settingType = this.handleType
      const options = {
        label: target.text
      }
      if (target.id) {
        options.id = target.id
      }
      alterMultiSetting({
        options,
        settingType
      }).then(res => {
        const result = res.data
        target.id = result.id
        target.move = false
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
        this.target.pop()
      })
    },
    handleFocus ([index]) {
      this.oldText = this.target[index].text
    }
  }
}
</script>

<style scoped>
</style>
