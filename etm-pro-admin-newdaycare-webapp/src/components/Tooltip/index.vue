<template>
  <el-tooltip
    class="comTooltip"
    effect="dark"
    :placement="placements"
  >
    <div
      slot="content"
      v-html="contents"
    />
    <i class="el-icon-question" />
  </el-tooltip>
</template>

<script>
export default {
  name: 'ToolTip',
  props: ['content', 'placement'],
  data () {
    return {
      replaceContent: this.content
    }
  },
  computed: {
    contents () {
      return this.content ? this.content : '这里是提示'
    },
    placements () {
      return this.placement ? this.placement : 'top'
    }
  }
}
</script>

<style lang="scss" scoped>
  .comTooltip {
    cursor: pointer;
  }

</style>
