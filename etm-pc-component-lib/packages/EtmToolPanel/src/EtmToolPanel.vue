<template>
  <div class="EtmToolPanel-wrap" style="">
    <etm-title size="16" show-toggle :border="show" @toggle="toggle">应用名称</etm-title>
    <div v-show="show" class="content">
      <div class="tags" style=" ">
        <span style="" class="title">快速筛选:</span>
        <span
          v-for="(tag, index) of tags"
          :key="index"
          class="tag"
          :class="{active: tag.active}"
          @click="selected(tag)"
        >
          {{ tag.label }}
          <el-divider v-if="index !== tags.length-1" style="" direction="vertical" />
        </span>
      </div>
      <etm-tool-bar v-show="show" v-model="formData" @search="search" @reset="reset" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'EtmToolPanel',
  props: {
    tags: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: [Object, Array],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      show: true,
      formData: this.value
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.formData = newValue
    }
  },
  mounted() {
    this.tags.forEach(item => {
      item.active = false
    })
    this.tags[0].active = true
  },
  methods: {
    toggle() {
      this.show = !this.show
    },
    search(val) {
      console.log(val)
      this.change(val)
    },
    reset() {
      this.$emit('reset')
    },
    selected(tag) {
      this.tags.forEach(item => {
        item.active = false
      })
      tag.active = true
      this.$emit('selected', tag)
    },
    change(data) {
      this.$emit('search', data)
    }
  }
}
</script>

<style lang="scss">
  @import "~/styles/src/etm/toolPanel";
</style>
