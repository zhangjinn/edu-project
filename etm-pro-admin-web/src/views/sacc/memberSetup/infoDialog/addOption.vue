<template>
  <div class="addOption">
    <el-button v-if="!editStatus" type="primary" @click="editStatus = true">{{ this.title }}</el-button>
    <el-input
      v-else
      v-model="inputValue"
      v-focus
      type="text"
      @blur="handleAddOption"
      @keyup.enter.native="handleAddOption"
    />
    <el-tag
      v-for="(tag, index) in option"
      :key="index"
      :disable-transitions="true"
      type="info"
      closable
      @close="handleTagClose(tag)"
    >
      {{ tag }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'AddOption',
  directives: {
    focus: {
      inserted: function(el) {
        el.querySelector('input').focus()
      }
    }
  },
  props: ['option', 'title'],
  data() {
    return {
      editStatus: false,
      inputValue: ''
    }
  },
  methods: {
    handleTagClose(tag) {
      this.option.splice(this.option.indexOf(tag), 1)
    },
    handleAddOption() {
      console.log(this.inputValue)
      if (this.inputValue.trim() && this.option.indexOf(this.inputValue) === -1) {
        this.option.push(this.inputValue)
      }
      this.editStatus = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped lang="scss">
  .addOption {
    display: inline;
    .el-input {
      width: 98px;
    }
    .el-tag {
      margin: 0 5px;
    }
  }
</style>
