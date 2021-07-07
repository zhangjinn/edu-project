<template>
  <div class="select-wrapper">
    <div class="select-title">
      {{ title }}
    </div>
    <div class="initInput">
      <el-button @click.stop="handlePopOpen">
        <i class="el-icon-plus" /> {{ addBtnText }}
      </el-button>
      <div v-if="checkedItems.length" class="selectedTags">
        <template v-if="checkedItems.length <= +maxTags">
          <el-tag
            v-for="(tag, index) in checkedItems"
            :key="tag.name"
            closable
            type="info"
            @close="handleDeleteCheckedItems(index)"
          >
            {{ tag.name }}
          </el-tag>
        </template>
        <template v-else>
          <el-tag
            v-for="index in +maxTags"
            :key="checkedItems[index - 1].name"
            closable
            type="info"
            @close="handleDeleteCheckedItems(index - 1)"
          >
            {{ checkedItems[index - 1].name }}
          </el-tag>
          <el-tag type="info">
            {{ `+${checkedItems.length - +maxTags}` }}
          </el-tag>
        </template>
      </div>
    </div>

    <etm-pop
      :visible="showPop"
      pop="complex"
      :title="title"
      confirm-btn="确定"
      cancel-btn="取消"
      class="queryPop"
      @open="showPop = true"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="leftContent">
        <el-select
          v-model="showCheckedItems"
          multiple
          filterable
          remote
          reserve-keyword
          class="queryInput"
          :placeholder="queryTitle"
          :remote-method="remoteMethod"
          :loading="loading"
          no-data-text="未找到匹配结果"
        >
          <i slot="prefix" class="el-icon-search" />
          <el-option
            v-for="item in queryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in departmentRoute"
            :key="item.name + item.id"
            :class="{active: index === departmentRoute.length - 1}"
          >
            <span style="font-size: 12px;" @click="jumpOut(index)">{{ item.name }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="selectItems">
          <el-checkbox :value="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="showCheckedItems">
            <el-checkbox v-for="item in menuList" :key="item.name + item.id" :label="JSON.stringify(item)">
              <div class="itemInfo">
                <i v-if="item.type === 'EMPLOYEE'" class="iconmorentouxiang iconfont" />
                <span>{{ item.name }}</span>
              </div>
              <div v-if="item.type === 'DEPARTMENT'" class="next" @click.stop="e => jumpIn(item, e)">
                <i class="iconxiaji iconfont" />
                下级
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="rightContent">
        <div class="title">
          {{ selectedText }}
        </div>
        <div class="selectedTags">
          <el-tag
            v-for="(item, index) in showCheckedItems"
            :key="JSON.parse(item).name + JSON.parse(item).id"
            closable
            type="info"
            @close="handleDeleteShowCheckedItems(index)"
          >
            {{ JSON.parse(item).name }}
          </el-tag>
        </div>
      </div>
    </etm-pop>
  </div>
</template>

<script>
import {
  queryStructureTree,
  queryEmployeeList
} from './api.js'
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: '选择员工'
    },
    addBtnText: {
      type: String,
      default: '添加'
    },
    selectedText: {
      type: String,
      default: '已选择的部门、成员'
    },
    queryTitle: {
      type: String,
      default: '搜索员工'
    },
    maxTags: {
      type: [Number, String],
      default: 8,
      validator(val) {
        return !isNaN(+val) && +val >= 1
      }
    }
  },
  data() {
    return {
      topDepartmentId: +window.localStorage.getItem('currentOrganizationId'), // 最顶层的部门的id
      showPop: false, // 控制弹窗的显隐
      querySelectedItems: [],
      departmentRoute: [], // 存放面包屑路径
      checkedItems: this.items, // 在初始输入框中显示的实际选中的项目
      showCheckedItems: [], // 弹窗中展示的选中的项目，其中的元素都是string格式的
      loading: false, // 控制搜索栏调用接口查询结果时候的加载遮罩
      queryOptions: [] // 搜索关键词得到的选项
    }
  },
  computed: {
    menuList() {
      if (!this.departmentRoute.length) return []
      return this.departmentRoute[this.departmentRoute.length - 1].children || []
    },
    notCurrentLevelSelectedItems() { // 不属于当前路径下的已经选中的项目
      if (!this.departmentRoute.length) return []
      const result = []
      for (let i = 0; i < this.showCheckedItems.length; i++) {
        const showItem = JSON.parse(this.showCheckedItems[i])
        let tag = false // 标示是否是当前路径下的项目
        for (var j = 0; j < this.menuList.length; j++) {
          const item = this.menuList[j]
          if (item.id === showItem.id && item.type === showItem.type) {
            tag = true
            break
          }
        }
        !tag && result.push(showItem)
      }
      return result
    },
    checkAll() { // 是否全选
      return this.showCheckedItems.length === this.menuList.length + this.notCurrentLevelSelectedItems.length
    },
    topDepartmentName() {
      const organizations = JSON.parse(window.localStorage.getItem('organizations') || '[]')
      for (let i = 0; i < organizations.length; i++) {
        if (organizations[i].enterpriseId === this.topDepartmentId) {
          return organizations[i].enterpriseName
        }
      }
      return ''
    }
  },
  watch: {
    checkedItems(v) {
      this.$emit('update:items', v)
    }
  },
  methods: {
    remoteMethod(query) { // 搜索框输入的时候触发
      query = query.trim()
      this.queryOptions = []
      if (query) {
        this.loading = true
        queryStructureTree({ name: query }).then(res => {
          Array.isArray(res.data) && res.data.forEach(item => {
            this.queryOptions.push({
              value: JSON.stringify(item),
              label: item.name
            })
          })
          this.loading = false
        }).catch(err => {
          this.loading = false
          console.log(err)
        })
      }
    },
    async handlePopOpen() { // 打开选择员工弹窗
      if (!this.departmentRoute.length) {
        await queryStructureTree({ organizationId: this.topDepartmentId })
          .then(res => {
            this.departmentRoute.push({
              id: this.topDepartmentId,
              name: this.topDepartmentName,
              type: 'DEPARTMENT',
              children: res.data
            })
          })
      }

      const copy = [...this.checkedItems]
      this.showCheckedItems = copy.map(item => JSON.stringify(item))

      this.showPop = true
    },
    handlePopClose() { // 关闭选择员工弹窗
      this.showPop = false
    },
    handlePopConfirm() {
      const copy = [...this.showCheckedItems].map(item => JSON.parse(item))
      const departmentIdList = []
      const employeeIdList = []
      copy.forEach(item => {
        const target = { 'EMPLOYEE': employeeIdList, 'DEPARTMENT': departmentIdList }[item.type]
        target.push(item.id)
      })
      queryEmployeeList({
        departmentIdList: departmentIdList.toString(),
        employeeIdList: employeeIdList.toString()
      }).then(res => {
        this.checkedItems = res.data
      })

      // 重置
      this.departmentRoute = []
      this.showCheckedItems = []
      this.showPop = false
    },
    handlePopCancel() {
      this.showPop = false
    },
    handleCheckAllChange(val) { // 点击全选
      const all = [...this.menuList].map(item => JSON.stringify(item))
      const copy = [...this.notCurrentLevelSelectedItems].map(item => JSON.stringify(item))
      this.showCheckedItems = val ? [...all, ...copy] : [...copy]
    },
    jumpIn(item, e) { // 进入下级树结构
      e.preventDefault()
      for (let i = 0; i < this.showCheckedItems.length; i++) {
        if (JSON.parse(this.showCheckedItems[i]).type === 'EMPLOYEE') continue
        if (JSON.parse(this.showCheckedItems[i]).id === item.id) return
      }
      queryStructureTree({ organizationId: item.id }).then(res => {
        this.departmentRoute.push({
          id: item.id,
          name: item.name,
          type: item.type,
          children: res.data
        })
      })
    },
    jumpOut(index) { // 点击路由导航
      if (index === this.departmentRoute.length - 1) return
      this.departmentRoute = this.departmentRoute.slice(0, index + 1)
    },
    handleDeleteShowCheckedItems(index) { // 处理弹窗中已选中的标签的删除事件
      this.showCheckedItems.splice(index, 1)
    },
    handleDeleteCheckedItems(i) { // 处理输入框已选中的标签的删除事件
      this.checkedItems.splice(i, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.select-wrapper {
  display: flex;
  align-items: center;
  .initInput {
    display: flex;
    align-items: center;
    border: 1px solid $control-color;
    border-radius: 2px;
    margin-left: 52px;
    padding-left: 9px;
    min-width: 400px;
    height: 32px;
    ::v-deep .el-button {
      width: 65px;
      height: 24px;
      padding: 0;
      @include c_main_color();
      @include bc_main_color();
      .el-icon-plus {
        font-weight: bold;
      }
    }
    .selectedTags {
      margin-left: 8px;
      ::v-deep .el-tag {
        @include bgc_hover_color();
        @include c_text_color();
        font-size: 14px;
        margin-right: 8px;
      }
    }
  }
}
.queryPop {
  ::v-deep .el-dialog.complex .el-dialog__body {
    max-height: 100vh;
  }
  ::v-deep .el-dialog__body {
    display: flex;
  }
  ::v-deep .el-dialog__footer {
    border-top: 1px solid;
    @include bc_divide_color();
  }
  .leftContent {
    width: 356px;
    height: 419px;
    border-right: 1px solid;
    @include bc_divide_color();
    .queryInput {
      width: 331px;
      margin-bottom: 17px;
      ::v-deep .el-select__input {
        margin-left: 30px;
      }
      ::v-deep .el-input__prefix {
        margin-left: 6px;
        line-height: 32px;
      }
      ::v-deep .el-input__suffix {
        display: none;
      }
      ::v-deep .el-select__tags {
        .el-tag {
          display: none;
        }
      }
    }
    ::v-deep .el-breadcrumb {
      .el-breadcrumb__item.active {
        .el-breadcrumb__inner {
          color: $info-color;
          &:hover {
            color: $info-color;
            cursor: default;
          }
        }
      }
      .el-breadcrumb__inner {
        font-size: 12px;
        @include c_text_color();
        &:hover {
          @include c_main_color();
          cursor: pointer;
        }
      }
      .el-breadcrumb__separator {
        font-size: 12px;
        margin: 0 4px;
      }
    }
    .selectItems {
      margin-top: 16px;
      ::v-deep .el-checkbox__inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        &::after {
          left: 5px;
          top: 2px;
        }
      }
      ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
        top: 6px;
      }
      ::v-deep .el-checkbox {
        display: flex;
        align-items: center;
        height: 40px;
        margin-right: 24px;
        &:hover {
          @include bgc_hover_color();
        }
        &.is-checked {
          .next {
            color: #ddd;
            cursor: default;
            &:hover {
              color: #ddd!important;
            }
          }
        }
        .iconmorentouxiang {
          color: #c1c4cc
        }
        .iconmorentouxiang, .iconxiaji {
          margin-top: 4px;
        }
        .next {
          color: $info-color;
          &:hover {
            @include c_main_color();
          }
        }
      }
      ::v-deep .el-checkbox__input {
        top: 2px;
      }
      ::v-deep .el-checkbox__label {
        display: flex;
        align-items: center;
        justify-content:space-between;
        width: 100%;
        padding-left: 8px;
      }
      ::v-deep .el-checkbox-group {
        top: 6px;
        max-height: 300px;
        overflow-y: auto;
      }
    }
  }
  .rightContent {
    width: 297px;
    height: 419px;
    @include bc_divide_color();
    padding-left: 17px;
    .title {
      line-height: 1;
      margin-bottom: 15px;
    }
    .selectedTags {
      ::v-deep .el-tag {
        @include bgc_hover_color();
        @include c_text_color();
        font-size: 14px;
        margin: 0 8px 8px 0;
      }
    }
  }
}
</style>
