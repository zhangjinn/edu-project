<template>
  <div class="sourceWrap">
    <div class="addSourceType">
      <el-button
        type="primary"
        @click="editSource(null, false, '')"
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
            {{ item.text }}
            <template slot="tool">
              <div
                class="edit-class"
                @click="editSource(item.id, true,item.text)"
              >
                <i class="iconfont iconedit-square1" /> 编辑类型
              </div>
              <div
                class="del-class"
                @click="deleteSource(item.id)"
              >
                <i class="el-icon-minus" /> 删除
              </div>
            </template>
          </etm-title>

          <item-template
            v-if="!toggleValid(`box_${item.id}`)"
            :ref="`item_${index}`"
            :data.sync="item.children"
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
import itemTemplate from '@/views/newDaycare/childManage/components/dragItemGroup/itemTemplate'
import { deleteChildSource, updateChildSource, sortChildSource, querySourceLists } from '@/api/newDaycare/childManageSettings'
import { deepClone } from '@/views/newDaycare/contract/common'
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
    editSource (id, edit, name = '') {
      this.popConfig = {
        name,
        edit,
        show: true,
        id
      }
    },
    confirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          updateChildSource({
            childSourceId: this.popConfig.id,
            childSourceName: this.popConfig.name
          }).then(res => {
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
          deleteChildSource(id).then(res => {
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
      querySourceLists().then(res => {
        res.data.forEach(v => {
          const result = {
            id: v.childSourceId,
            text: v.childSourceName,
            children: []
          }
          result.children = (v.childSourceChildList || []).map(cur => {
            return {
              id: cur.childSourceId,
              text: cur.childSourceName,
              editable: true
            }
          })
          dragData.push(result)
        })
        this.dragData = dragData
        this.dragDataCache = deepClone(
          dragData
        )
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange ({ arg, parentIndex }) {
      const ids = []
      const key = Object.keys(arg[0])[0]

      this.dragData.forEach(v => {
        ids.push(v.id)
        v.children.forEach(i => {
          ids.push(i.id)
        })
      })

      new Promise((resolve, reject) => {
        switch (key) {
          case 'moved':
            resolve()
            break
          case 'added':
            updateChildSource({
              childSourceId: arg[0][key].element.id,
              childSourceName: arg[0][key].element.text,
              parentId: this.dragData[parentIndex].id
            }).then(res => {
              resolve()
            })
            break
        }
      }).then(res => {
        sortChildSource(ids).then(res => {
          this.$message.success('操作成功')
        }).catch(err => {
          console.log(err)
        })
      })
    },
    addItem ({ parentIndex }) {
      const data = this.dragData[parentIndex].children
      // console.log(data)
      if (data[data.length - 1] && !data[data.length - 1].text) {
        this.$message.warning('请先填写前一项的内容')
      } else {
        // this.dragData[parentIndex].children.push({
        //   id: 0,
        //   text: '',
        //   editable: true
        // })

        this.$refs[`item_${parentIndex}`][0].addItem({
          id: 0,
          text: '',
          editable: true
        })
      }
    },
    deleteItem ({ arg, parentIndex }) {
      const item = this.dragData[parentIndex].children[arg[0].index]
      if (!item.text) return this.dragData[parentIndex].children.splice(arg[0].index, 1)
      deleteChildSource(item.id).then(res => {
        this.dragData[parentIndex].children.splice(arg[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew ({ index, parentIndex }) {
      const target = this.dragData[parentIndex].children[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('重要程度内容不能为空')
      const data = {
        childSourceName: target.text,
        parentId: this.dragData[parentIndex].id
      }
      if (target.id) {
        // 存在id，修改
        data.childSourceId = target.id
      }
      updateChildSource(data).then(res => {
        const result = res.data
        target.id = result.childSourceId
        target.move = true
        this.$message.success('操作成功')
      }).catch(() => {
        if (target.id) {
          // 存在id，修改
          this.dragData[parentIndex].children[index].text = this.dragDataCache[parentIndex].children[index].text
        } else {
          this.dragData[parentIndex].children.pop()
        }
      })
    },
    handleFocus ({ index, parentIndex }) {
      this.oldText = this.dragData[parentIndex].children[index].text
    }
  }
}
</script>

<style scoped lang="scss">
.sourceWrap {
  .sourceScroll {
    max-height: calc(100vh - 200px);
    overflow-x: hidden;
    padding-right: 16px;

    .sourceBox {
      width: 580px;
    }
  }

  ::v-deep {
    .el-button--text {
      color: #555;
    }

    .EtmTitle-wrap {
      .edit-class {
        &:hover {
          @include etm-color();
        }
      }

      .del-class {
        &:hover {
          color: #f56c6c;
        }
      }
    }
  }

  .tool-btn {
    > div {
      cursor: pointer;
      display: block;
      margin-right: 16px !important;
      white-space: nowrap;

      i {
        display: inline-block;
        width: 20px;
      }
    }
  }

  .sourceShadow {
    overflow: hidden;
    padding-top: 8px;
    position: relative;

    &::after {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      content: '';
      display: block;
      height: 1px;
      left: 0;
      position: absolute;
      top: 0;
      width: 580px;
    }
  }

  .addSourceType {
    margin-bottom: 16px;
  }
}
</style>
