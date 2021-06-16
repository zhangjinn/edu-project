<template>
  <div class="page-collapse">
    <etm-title
      :border="true"
      show-toggle
      size="big"
      open-text="全部展开"
      close-text="全部折叠"
      @toggle="toggle"
    >
      餐次设置
    </etm-title>
    <el-collapse
      v-if="listArray.length>0"
      v-model="activeNames"
    >
      <div
        v-for="(list, index) in listArray"
        :key="index"
      >
        <el-collapse-item
          :name="index"
        >
          <template slot="title">
            <div class="titleBox">
              <div class="left">
                <span>{{ list.name }}</span>
                <i
                  class="el-icon-edit"
                  @click.stop="editCategory(index)"
                />
              </div>
              <div class="right">
                <span v-if="index===0">
                  <etm-font-icon
                    name="plus"
                    @click.native.stop="addCategory(index)"
                  />
                  <span class="categoryType">添加类别</span>
                </span>
                <span v-else>
                  <etm-font-icon
                    name="minus"
                    @click.native.stop="removeCategory(index)"
                  />
                  <span class="categoryType">删除类别</span>
                </span>
              </div>
            </div>
          </template>

          <item-template
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
        </el-collapse-item>
      </div>
    </el-collapse>
    <etm-pop
      :visible="popVisible"
      pop="simple"
      title="修改餐次名称"
      confirm-btn="确定"
      cancel-btn="取消"
      append-to-body
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="handleConfirm"
    >
      <div class="popContent">
        <etm-form
          ref="form"
          :model="form"
          type="dialog"
        >
          <el-form-item
            label="餐次名称"
            prop="name"
            :rules="formValidate.nullValueRule(true,'请输入餐次名称')"
          >
            <el-input
              v-model="form.name"
              maxlength="10"
              placeholder="餐次名称不能为空"
            />
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>
  </div>
</template>
<script>
import formValidate from '@/utils/rules'
import itemTemplate from '@/components/itemTemplate/itemTemplate'
import {
  queryTimeQuantumGroupList,
  removeTimeQuantumGroupType,
  addTimeQuantumGroupType,
  updateTimeQuantumGroupType,
  removeTimeQuantumType,
  addTimeQuantumType,
  updateTimeQuantumType,
  updateTimeQuantumSort
} from '@/api/standardcare/listFeatures/recipesManage'
export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      formValidate,
      popVisible: false,
      activeNames: [],
      listArray: [],
      handleIndex: undefined,
      form: {
        name: ''
      },
      oldText: '',
      mealsIndex: ''
    }
  },
  computed: {
    target () {
      return this.listArray[this.handleIndex]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    allUnfold (type) {
      this.activeNames = []
      if (type) {
        for (let i = 0; i < this.listArray.length; i++) {
          this.activeNames.push(i)
        }
      }
    },
    newItemUnfold () {
      this.activeNames.push(this.listArray.length - 1)
    },
    getData () {
      queryTimeQuantumGroupList().then(res => {
        const { data } = res
        this.listArray = []
        data.forEach((item, index) => {
          this.listArray.push({
            id: item.id,
            name: item.name,
            sortIndex: item.sortIndex,
            data: []
          })
          item.timeQuantumList.forEach(child => {
            this.listArray[index].data.push({
              id: child.id,
              groupId: child.groupId,
              text: child.name,
              sortIndex: child.sortIndex

            })
          })
        })
        this.allUnfold(true)
      }).catch(err => {
        console.log(err)
      })
    },
    toggle (t) {
      this.allUnfold(t)
    },
    handleChange () {
      const ids = []
      this.target.data.forEach((v, index) => {
        if (v.id) {
          ids.push({
            id: v.id,
            sortIndex: index
          })
        }
      })

      updateTimeQuantumSort({
        quantumSortIndexList: ids
      }).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    addItem () {
      const data = this.target.data
      if (data[data.length - 1] && !data[data.length - 1].text) return this.$message.warning('请先填写前一项的内容')
      data.push({
        id: '',
        groupId: this.target.id,
        text: '',
        sortIndex: ''
      })
    },
    deleteItem ([e]) {
      if (!this.target.data[e[0].index].text) return this.target.data.splice(e[0].index, 1)
      removeTimeQuantumType({ timeQuantumId: this.target.data[e[0].index].id }
      ).then(res => {
        this.target.data.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew ([index]) {
      const target = this.target.data[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('状态内容不能为空')
      if (target.id) {
        // 存在id，修改
        updateTimeQuantumType({
          timeQuantumId: target.id,
          timeQuantumName: target.text
        })
          .then(res => {
            this.$message.success('修改成功')
          }).catch(err => {
            console.log(err)
          })
      } else {
        // 不存在id，新增
        addTimeQuantumType({
          timeQuantumName: target.text,
          groupId: target.groupId
        }).then(res => {
          const result = res.data
          target.id = result.id
          this.$message.success('新增成功')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleFocus ([index]) {
      this.oldText = this.target.data[index].text
    },

    // 打开修改餐次组名称弹框
    editCategory (index, type) {
      this.mealsIndex = index
      this.form.name = this.listArray[index].name
      this.popVisible = true
    },
    // 新增餐次组
    addCategory (index) {
      addTimeQuantumGroupType({ timeQuantumGroupName: '餐次名称' }).then((res) => {
        const { data } = res
        console.log(data)
        this.listArray.push({
          id: data.id,
          name: data.name,
          sortIndex: data.sortIndex,
          data: []
        })
        this.newItemUnfold()
      })
    },
    // 删除餐次组
    removeCategory (index) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除所选数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          this.mealsIndex = index
          const target = this.listArray[this.mealsIndex]
          removeTimeQuantumGroupType({
            timeQuantumGroupId: target.id
          }).then(res => {
            this.listArray.splice(index, 1)
            this.$message.success('操作成功')
          }).catch(err => {
            console.log(err)
          })
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    // 修改餐次组
    handleConfirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const target = this.listArray[this.mealsIndex]
          const formData = this.form
          updateTimeQuantumGroupType({
            timeQuantumGroupId: target.id,
            timeQuantumGroupName: formData.name
          }).then((res) => {
            const { data } = res
            target.name = data.name
            this.popVisible = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

.page-collapse,
.el-tabs.el-tabs--left .page-collapse {
  width: 564px;

  .titleBox {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .categoryType {
      margin-left: 8px;
    }
  }

  ::v-deep .el-collapse {
    border-bottom-color: transparent;
    border-top-color: transparent;

    .is-active {
      background-color: transparent;
    }

    .el-collapse-item__header {
      border-bottom-color: $divide-color;
      //border-bottom-color: transparent;

    }

    .el-collapse-item__header.is-active {
      border-bottom-color: $divide-color;
      //border-bottom-color: transparent;

    }

    .el-collapse-item:last-child {
      margin-bottom: 0;
    }

    .el-collapse-item__wrap {
      border: 0;
      padding-top: 24px !important;
    }

    .el-icon-arrow-right::before {
      content: '\E6DF';
    }

    .el-collapse-item__arrow.is-active {
      transform: rotate(180deg);
      //transform: rotate(180deg);
    }

    .el-collapse-item__content {
      padding-bottom: 0;

    }
  }
}
</style>
