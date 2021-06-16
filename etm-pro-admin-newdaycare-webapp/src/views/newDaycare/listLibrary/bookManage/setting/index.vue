<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs
            v-model="activateName"
            :show-toggle="false"
            tab-position="left"
          >
            <el-tab-pane
              label="图书分类"
              name="libraryType"
            >
              <item-template
                :data="dragData"
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
 * createTime 2020/11/19 9:39
 */
import itemTemplate from './itemTemplate'
import {
  queryLibraryManageTypeList,
  createOrUpdateBookType,
  removeBookType,
  bookTypeSort
} from '@/api/newDaycare/listLibrary'

export default {
  name: 'Index',
  components: {
    itemTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      activateName: 'libraryType',
      dragData: [],
      oldVal: ''
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
      queryLibraryManageTypeList().then(res => {
        this.dragData.splice(0)
        // this.dragData = []

        res.data.forEach(item => {
          this.dragData.push({
            bookTypeId: item.bookTypeId,
            text: item.bookTypeName,
            editable: true,
            move: true
          })
        })
      })
    },
    handleAdd () {
      if (this.dragData.length === 0) {
        this.dragData.push({
          text: '',
          editable: true,
          move: false
        })
      } else if (!this.dragData[this.dragData.length - 1].move) {
        this.$message({
          type: 'warning',
          message: '请先填写前一项内容'
        })
      } else {
        this.dragData.push({
          text: '',
          editable: true,
          move: false
        })
      }
    },
    handleDelete (arg) {
      removeBookType({ bookTypeId: this.dragData[arg[0].index].bookTypeId }).then(res => {
        this.$message({
          type: 'success',
          message: '删除图书分类成功'
        })
        this.init()
      })
    },
    handleFocus (index) {
      this.oldVal = this.dragData[index].text.trim()
    },
    handleBlur (index) {
      const newVal = this.dragData[index].text.trim()
      if (this.oldVal === newVal) {
        return ''
      }
      const bookTypeId = this.dragData[index].bookTypeId || undefined
      createOrUpdateBookType({ id: bookTypeId, bookTypeName: newVal }).then(res => {
        this.$message({
          type: 'success',
          message: '更新图书分类成功'
        })
        this.init()
      })
    },
    handleChange (arg) {
      const { newIndex, oldIndex } = arg[0].moved
      const oldVal = this.dragData[oldIndex]
      this.dragData.splice(oldIndex, 1)
      this.dragData.splice(newIndex, 0, oldVal)
      const ids = this.dragData.map(item => item.bookTypeId)
      bookTypeSort({ ids }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.init()
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
