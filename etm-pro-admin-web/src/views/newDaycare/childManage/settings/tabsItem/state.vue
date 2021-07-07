<template>
  <div class="stateWrap">
    <div v-for="(list, index) in listArray" :key="list.state" class="stateList">
      <etm-title
        :border="true"
        show-toggle
        open-text=""
        close-text=""
        @toggle="t => {
          handleIndex = index
          toggle(t)
        }"
      >
        {{ list.title }}
      </etm-title>
      <item-template
        v-show="list.toggle"
        :data.sync="list.data"
        :no-slot="['color']"
        btn-text="添加新类型"
        @change="(...arg) => {
          handleIndex = index
          handleChange(arg)
        }"
        @add="(...arg) => {
          handleIndex = index
          addItem(arg)
        }"
        @delete="(...arg) => {
          handleIndex = index
          deleteItem(arg)
        }"
        @focus="(...arg) => {
          handleIndex = index
          handleFocus(arg)
        }"
        @blur="(...arg) => {
          handleIndex = index
          updateNew(arg)
        }"
      />
    </div>
  </div>
</template>
<script>
import itemTemplate from '../../components/itemTemplate'
import {
  getChildStateList,
  deleteChildState,
  addChildState,
  updateChildState,
  sortChildState
} from '@/api/newDaycare/childManageSettings'

export default {
  components: {
    itemTemplate
  },
  data() {
    return {
      dragDataCache: [
        {
          state: 'nodeal',
          title: '未成交学员状态',
          toggle: true,
          data: [
            { text: '新客户' },
            { text: '意向客户' },
            { text: '试听客户' },
            { text: '订金客户' },
            { text: '试听有效客户' },
            { text: '无效号码' }
          ]
        },
        {
          state: 'done',
          title: '已成交学员状态',
          toggle: true,
          data: [
            { text: '早教学员' },
            { text: '托班学员' },
            { text: '签约学员', editable: false }
          ]
        },
        {
          state: 'history',
          title: '历史学员状态',
          toggle: true,
          data: [
            { text: '退费学员', editable: false },
            { text: '结业学员' },
            { text: '毕业学员' },
            { text: '过期学员' }
          ]
        }
      ],
      listArray: [
        {
          state: 'nodeal',
          title: '未成交学员状态',
          toggle: true,
          data: [
            { text: '新客户' },
            { text: '意向客户' },
            { text: '试听客户' },
            { text: '订金客户' },
            { text: '试听有效客户' },
            { text: '无效号码' }
          ]
        },
        {
          state: 'done',
          title: '已成交学员状态',
          toggle: true,
          data: [
            { text: '早教学员' },
            { text: '托班学员' },
            { text: '签约学员', editable: false }
          ]
        },
        {
          state: 'history',
          title: '历史学员状态',
          toggle: true,
          data: [
            { text: '退费学员', editable: false },
            { text: '结业学员' },
            { text: '毕业学员' },
            { text: '过期学员' }
          ]
        }
      ],
      categoryList: ['UNSOLD', 'DEAL', 'HISTORY'],
      handleIndex: undefined,
      oldText: ''
    }
  },
  computed: {
    target() {
      return this.listArray[this.handleIndex]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.categoryList.forEach((v, i) => {
        const target = this.listArray[i].data = []
        this.dragDataCache[i].data = []
        getChildStateList(v).then(res => {
          res.data.forEach(state => {
            target.push({
              text: state.childStatusName,
              id: state.childStatusId,
              editable: state.modifyStatus
            })
            this.dragDataCache[i].data.push({
              text: state.childStatusName,
              id: state.childStatusId,
              editable: state.modifyStatus
            })
          })
        }).catch(err => {
          console.log(err)
        })
      })
    },
    toggle(t) {
      this.target.toggle = t
    },
    handleChange() {
      const ids = []
      this.target.data.forEach(v => {
        ids.push(v.id)
      })
      sortChildState(ids).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    addItem() {
      const data = this.target.data
      if (data[data.length - 1] && !data[data.length - 1].text) return this.$message.warning('请先填写前一项的内容')
      data.push({
        text: '',
        move: false
      })
    },
    deleteItem([e]) {
      if (!this.target.data[e[0].index].text) return this.target.data.splice(e[0].index, 1)
      deleteChildState(this.target.data[e[0].index].id).then(res => {
        this.target.data.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew([index]) {
      const target = this.target.data[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('状态内容不能为空')
      if (target.id) {
        // 存在id，修改
        updateChildState(target.id, { childStatusName: target.text })
          .then(res => {
            this.$message.success('修改成功')
          }).catch(err => {
            console.log(err)
            this.target.data[index].text = this.dragDataCache[this.handleIndex].data[index].text
          })
      } else {
        // 不存在id，新增
        addChildState({
          childStatusName: target.text,
          childCategory: this.categoryList[this.handleIndex]
        }).then(res => {
          const result = res.data
          target.id = result.childStatusId
          target.move = true
          this.$message.success('新增成功')
        }).catch(err => {
          console.log(err)
          this.target.data.pop()
        })
      }
    },
    handleFocus([index]) {
      this.oldText = this.target.data[index].text
    }
  }
}
</script>

<style lang="scss" scoped>
.stateWrap {
  .stateList {
    width: 564px;
    & + .stateList {
      margin-top: 16px;
    }
    ::v-deep .box {
      &.bdb{
        padding-bottom: 8px;
      }
    }
  }
}
</style>
