<template>
  <div class="addPost-wrap">
    <el-form ref="addPost" :model="postData" :rules="postRule" label-width="100px">
      <el-form-item label="所属企业">
        <span>{{ currentOrganization.organizationName }}</span>
      </el-form-item>
      <el-form-item prop="positionName" label="岗位名称">
        <el-input v-model="postData.positionName" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>/**
   *  2020/4/6 13:54
   *  haijinsha
   */

import { getCurrentOrganizationObject } from '@/utils/auth'

export default {
  name: 'AddPost',
  filters: {},
  mixins: [],
  props: {
    post: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      postData: this.post,
      postRule: {
        positionName: [
          {
            required: true, message: '请输入岗位名称', trigger: 'blur'
          }
        ]
      },
      currentOrganization: getCurrentOrganizationObject()
    }
  },
  computed: {},
  watch: {
    post(val) {
      this.postData = val
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    validateForm() {
      let isValid = false
      this.$refs['addPost'].validate(valid => {
        isValid = valid
      })
      return isValid
    },
    resetFields() {
      this.$refs['addPost'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .addPost-wrap {

  }
</style>
