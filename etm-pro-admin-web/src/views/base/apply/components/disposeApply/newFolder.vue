<template>
  <div class="newFolder">
    <el-form>
      <el-form-item label="文件夹名称:">
        <el-input v-model="fName" placeholder="请输入文件夹名称" @input="folderPut" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'NewFolder',
  props: ['folderName'],
  data() {
    return {
      fName: this.folderName
    }
  },
  methods: {
    folderPut() {
      this.$emit('getFolderName', this.fName)
    }

  }
}
</script>

<style scoped>

</style>
