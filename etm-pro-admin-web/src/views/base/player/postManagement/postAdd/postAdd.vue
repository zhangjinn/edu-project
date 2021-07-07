<template>
  <div>

    <el-form ref="addCustomerForm" :model="addCustomerForm" label-width="100px" :rules="rules" class="demo-addCustomerForm">
      <el-row style="height: 100px">
        <el-col :span="10">
          <el-form-item label="岗位名称：" prop="positionName">
            <el-input v-model="addCustomerForm.positionName" style="width: 250px" />
          </el-form-item>

        </el-col>
        <el-col :span="10">
          <el-form-item label="上级岗位：" prop="treeParentIds">
            <el-cascader
              ref="postCascader"
              v-model="addCustomerForm.treeParentIds"
              :options="postList"
              clearable
              placeholder="请选择岗位"
              :props="postProps"
              style="width: 250px"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getOrganizationTreeAll } from '@/api/organization'
import { addPosition, getPositionListByOrganizationId, getPositionListByPostId, updatePosition } from '@/api/post'
import { getOrganizationId } from '@/utils/auth'

export default {
  name: 'PostAdd',
  props: ['currentPost'],
  data() {
    const that = this
    return {
      radio: undefined,
      post: undefined,
      school: undefined,
      postList: undefined,
      organizationList: undefined,
      postProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'treeId',
        label: 'positionName',
        emitPath: false,
        lazy: true,
        lazyLoad(node, resolve) {
          that.getPostChild(node, resolve)
        },
        children: 'children',
        hasChildren: 'hasChildren'
      },
      addCustomerForm: {
        positionName: undefined,
        treeParentIds: undefined,
        organizationId: undefined,
        positionId: undefined
      },
      rules: {
        positionName: { required: true, message: '请输入岗位名称', trigger: 'blur' }
      }
    }
  },
  created() {
    console.log(this.currentPost)
    if (this.currentPost !== null && this.currentPost !== undefined) {
      console.log(this.currentPost)
      this.addCustomerForm.positionName = this.currentPost.positionName
      this.addCustomerForm.positionId = this.currentPost.positionId
      if (this.currentPost.treeParentIds != null) {
        this.addCustomerForm.treeParentIds = this.currentPost.treeParentIds
      }
    }
    this.getPositionList(getOrganizationId())
  },
  methods: {
    getOrganizations(id) {
      getOrganizationTreeAll(id).then(response => {
        const array = []
        array.push(response.data)

        this.organizationList = this.getCascad(array)
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
    getPositionList(id) {
      getPositionListByOrganizationId(id).then(response => {
        this.postList = response.data
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },

    getCascad(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined
        } else {
          this.getCascad(data[i].children)
        }
      }
      return data
    },

    addPost(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addCustomerForm.organizationId = getOrganizationId()
          const array = []
          debugger
          console.log(this.addCustomerForm.treeParentIds)
          if (this.addCustomerForm.treeParentIds !== undefined) {
            array.push(this.addCustomerForm.treeParentIds)
          }
          this.addCustomerForm.treeParentIds = array
          console.log(this.addCustomerForm.treeParentIds)
          if (this.addCustomerForm.positionId === undefined) {
            addPosition(this.addCustomerForm).then(response => {
              if (response.code === 0) {
                this.$emit('addSuccess')
              }
              setTimeout(() => {
              }, 1.5 * 1000)
            })
          } else {
            updatePosition(this.addCustomerForm).then(response => {
              if (response.code === 0) {
                this.$emit('addSuccess')
              }
              setTimeout(() => {
              }, 1.5 * 1000)
            })
          }
        } else {
          return false
        }
      })
    },
    getPostChild(node, resolve) {
      if (node.data !== undefined && node.children.length === 0 && node.data.hasChildren) {
        getPositionListByPostId(node.data.positionId).then(response => {
          resolve(response.data)
        })
      } else {
        resolve(node.children)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
