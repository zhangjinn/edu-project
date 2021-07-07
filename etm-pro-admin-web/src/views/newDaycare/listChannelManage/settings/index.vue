<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs
            v-model="activateName"
            tab-position="left"
            :show-toggle="false"
          >
            <el-tab-pane
              label="渠道类型设置"
              name="settings"
            >
              <item-template
                :data.sync="dragData"
                btn-text="添加新分类"
                @change="handleChange"
                @focus="handleFocus"
                @blur="handleBlur"
                @add="handleAdd"
                @delete="handleDelete"
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
   * index create by 油麦菜
   * createTime 2021/1/28 11:56
   */
import itemTemplate from '../components/itemTemplate'
import {
  queryChannelTypeList,
  createChannelType,
  updateChannelType,
  removeChannelType,
  sortChannelTypeList
} from '@/api/newDaycare/listChannelManage'

export default {
  name: 'Index',
  components: {
    itemTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activateName: 'settings',
      dragData: [],
      oldText: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  activated() {
    this.init()
  },
  methods: {
    init() {
      this.dragData.splice(0, this.dragData.length)
      queryChannelTypeList().then(res => {
        res.data.forEach(item => {
          this.dragData.push({
            editable: true,
            move: true,
            text: item.channelTypeName,
            channelTypeName: item.channelTypeName,
            channelTypeId: item.channelTypeId
          })
        })
      })
    },
    handleAdd() {
      let isAddAble = true
      this.dragData.forEach(item => {
        if (!item.text) {
          isAddAble = false
        }
      })
      if (isAddAble) {
        this.dragData.push({
          move: true,
          editable: true,
          text: ''
        })
        return ''
      }
      this.$message({
        type: 'warning',
        message: '请填写前一项的内容'
      })
    },
    handleFocus(index) {
      console.log(index)
      this.oldText = this.dragData[index].text
    },
    handleDelete(arg) {
      if (arg.channelTypeId) {
        removeChannelType({ channelTypeId: arg.channelTypeId }).then(_ => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }
    },
    handleBlur(index) {
      if (!this.dragData[index].text) {
        this.$message({
          type: 'warning',
          message: '内容不能为空'
        })
        return ''
      }
      if (this.oldText === this.dragData[index].text) return
      this.dragData[index].channelTypeName = this.dragData[index].text
      if (!this.dragData[index].channelTypeId) {
        createChannelType(this.dragData[index]).then(res => {
          this.dragData[index].channelTypeId = res.data.channelTypeId
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
      } else {
        updateChannelType(this.dragData[index]).then(_ => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
      }
    },
    handleChange(arg) {
      const ids = this.dragData.map(item => item.channelTypeId)
      sortChannelTypeList({ ids }).then(_ => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    .wrapper {
      padding-bottom: 16px;
    }
  }
</style>
