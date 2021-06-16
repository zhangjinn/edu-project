<template>
  <div class="sourceWrap">
    <div class="addSourceType">
      <el-button
        type="primary"
        @click="editSource(-1, false, '')"
      >
        <i class="el-icon-plus" /> 添加新类型
      </el-button>
    </div>
    <div class="sourceShadow">
      <div class="sourceScroll">
        <div
          v-for="(item, index) in dragData"
          :key="item.id"
          class="sourceBox"
        >
          <etm-title
            border
            show-toggle
            open-text=" "
            close-text=" "
            @toggle="toggle(item, $event)"
          >
            {{ item.label }}
            <template slot="tool">
              <div @click="editSource(index, true,item.label)">
                <i class="iconfont iconedit-square1" /> 编辑类型
              </div>
              <div @click="deleteSource(item.id)">
                <i class="el-icon-minus" /> 删除
              </div>
            </template>
          </etm-title>

          <item-template
            v-if="!toggleValid(`box_${item.id}`)"
            :ref="`item_${index}`"
            :data.sync="item.child"
            group="source"
            :args="{parentIndex : index}"
            btn-text="添加新来源"
            :no-slot="['color']"
            @change="handleChange"
            @add="addItem"
            @delete="deleteItem"
            @focus="handleFocus"
            @blur="updateNew"
          />
        </div>
      </div>
    </div>

    <etm-pop
      :title="`${popConfig.edit ? '编辑' : '添加'}类型`"
      :visible="popConfig.show"
      close-btn="确定"
      @close="close"
      @cancel="close"
      @confirm="confirm"
    >
      <etm-form
        ref="form"
        type="dialog"
        :model="popConfig"
        :rules="formRules"
      >
        <el-form-item
          label="来源类型"
          prop="name"
        >
          <el-input
            v-model="popConfig.name"
            maxlength="30"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>
<script>
import itemTemplate from '../components/itemTemplate'
// import {
// // deleteChildSource,
// // updateChildSource
// // sortChildSource,
// // querySourceLists
// } from '@/api/newDaycare/childManageSettings'

import {
  alterMultiSetting,
  queryMultiSettingList, removeMultiSettingItem
  // removeMultiSettingItem
} from '@/api/customerSettings'

import { deepClone } from '@/views/listCustomer/myCustomer/common'
export default {
  components: {
    itemTemplate
  },
  filters: {

  },
  data () {
    return {
      formRules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ]
      },
      sourceToggle: [],
      popConfig: {
        name: '',
        edit: false,
        show: false,
        id: 0
      },
      dragDataCache: [],
      dragData: [],
      oldText: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    toggleValid (key) {
      return this.sourceToggle.includes(key)
    },
    editSource (index, edit, name = '') {
      this.popConfig = {
        name,
        edit,
        show: true,
        index
      }
    },
    confirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          let params
          if (this.popConfig.index === -1) {
            params = {
              options: {
                label: this.popConfig.name,
                child: null
              },
              settingType: 'SOURCE'
            }
          } else {
            params = {
              options: deepClone(this.dragData[this.popConfig.index]),
              settingType: 'SOURCE'
            }
            params.options.label = this.popConfig.name
          }
          alterMultiSetting(params).then(res => {
            this.$message.success(`${this.popConfig.edit ? '编辑' : '添加'}来源类型成功`)
            this.getData()
            this.close()
          })
        }
      })
    },
    close () {
      this.form = {
        name: ''
      }
      this.popConfig = {
        name: '',
        edit: false,
        show: false,
        id: 0
      }

      this.$refs.form.$children[0].resetFields()
    },
    deleteSource (id) {
      this.$etmTip.init({
        type: 'error',
        title: '确认要删除？',
        content: '该类型所关联的来源将一起删除',
        confirmBtn: '确定',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeMultiSettingItem({ id }).then(res => {
            this.getData()
            this.$message.success('操作成功')
          }).catch(err => {
            console.log(err)
          })
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    toggle (item, e) {
      const key = `box_${item.id}`
      if (this.toggleValid(key)) {
        const index = this.sourceToggle.indexOf(key)
        this.sourceToggle.splice(index, 1)
      } else {
        this.sourceToggle.push(key)
      }
    },
    getData () {
      const dragData = []
      queryMultiSettingList({ settingType: 'SOURCE' }).then(res => {
        (res.data.options || []).forEach(v => {
          const result = {
            id: v.id,
            label: v.label,
            sortIndex: v.sortIndex,
            color: v.color,
            child: []
          }
          result.child = (v.child || []).map(cur => {
            return {
              id: cur.id,
              sortIndex: cur.sortIndex || null,
              color: cur.color || null,
              label: cur.label,
              editable: true
            }
          })
          dragData.push(result)
        })
        console.log(dragData, 'dragData')
        this.dragData = dragData
        this.dragDataCache = deepClone(
          dragData
        )
      }).catch(err => {
        console.log(err)
      })
      // const dragData = []
      // queryMultiSettingList().then(res => {
      //   res.data.forEach(v => {
      //     const result = {
      //       id: v.childSourceId,
      //       text: v.childSourceName,
      //       children: []
      //     }
      //     result.children = (v.childSourceChildList || []).map(cur => {
      //       return {
      //         id: cur.childSourceId,
      //         text: cur.childSourceName,
      //         editable: true
      //       }
      //     })
      //     dragData.push(result)
      //   })
      //   this.dragData = dragData
      //   this.dragDataCache = deepClone(
      //     dragData
      //   )
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    handleChange ({ arg, parentIndex }) {
      // const ids = []
      const key = Object.keys(arg[0])[0]

      // this.dragData.forEach(v => {
      //   ids.push(v.id)
      //   v.children.forEach(i => {
      //     ids.push(i.id)
      //   })
      // })

      new Promise((resolve, reject) => {
        switch (key) {
          case 'moved':
            alterMultiSetting({
              options: this.dragData[parentIndex],
              settingType: 'SOURCE'
            }).then(res => {
              resolve()
            })
            break
          case 'added':
            alterMultiSetting({
              options: this.dragData[parentIndex],
              settingType: 'SOURCE'
            }).then(res => {
              resolve()
            })
            break
        }
      }).then(res => {
        // sortChildSource(ids).then(res => {
        this.$message.success('操作成功')
        // }).catch(err => {
        //   console.log(err)
        // })
      })
    },
    addItem ({ parentIndex }) {
      const data = this.dragData[parentIndex].child
      // console.log(data)
      if (data[data.length - 1] && !data[data.length - 1].label) {
        this.$message.warning('请先填写前一项的内容')
      } else {
        // this.dragData[parentIndex].children.push({
        //   id: 0,
        //   text: '',
        //   editable: true
        // })

        this.$refs[`item_${parentIndex}`][0].addItem({
          id: null,
          sortIndex: null,
          color: null,
          label: '',
          editable: true
        })
      }
    },
    deleteItem ({ arg, parentIndex }) {
      const item = this.dragData[parentIndex].child[arg[0].index]
      if (!item.label) return this.dragData[parentIndex].child.splice(arg[0].index, 1)
      removeMultiSettingItem({ id: item.id }).then(res => {
        this.dragData[parentIndex].child.splice(arg[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew ({ index, parentIndex }) {
      const target = this.dragData[parentIndex].child[index]
      if (target.label === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.label) return this.$message.warning('重要程度内容不能为空')

      alterMultiSetting({
        options: this.dragData[parentIndex],
        settingType: 'SOURCE'
      }).then(res => {
        const result = res.data
        target.id = result.childSourceId
        this.getData()
        // target.move = true
        this.$message.success('操作成功')
      }).catch(() => {
        if (target.id) {
          // 存在id，修改
          this.dragData[parentIndex].child[index].label = this.dragDataCache[parentIndex].child[index].label
        } else {
          this.dragData[parentIndex].child.pop()
        }
      })
    },
    handleFocus ({ index, parentIndex }) {
      this.oldText = this.dragData[parentIndex].child[index].label
    }
  }
}
</script>

<style scoped lang="scss">
.sourceWrap{

  .sourceScroll{
    overflow-x: hidden;
    padding-right: 16px;
    max-height: calc(100vh - 200px);

    .sourceBox{
      width: 580px;
    }
  }
  ::v-deep{
    .el-button--text{
      color: #555;
    }
  }

  .tool-btn {
    & > div {
      display: block;
      white-space:nowrap;
      margin-right: 16px !important;
      cursor: pointer;

      i{
        display: inline-block;
        width: 20px;
      }
    }
  }
  .sourceShadow{
    position: relative;
    overflow:hidden;
    padding-top: 8px;

    &:after{
      content: '';
      display: block;
      width: 580px;
      height: 1px;
      position: absolute;
      left: 0;
      top: 0;
      box-shadow: 0 0 10px rgba(0,0,0,.3);
    }
  }
  .addSourceType{

    margin-bottom: 8px;

  }
}
</style>
