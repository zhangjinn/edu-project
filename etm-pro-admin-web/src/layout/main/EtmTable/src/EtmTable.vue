<template>
  <el-table
    v-bind="attributes"
    v-on="elementTableEvents"
  >
    <el-table-column
      v-for="(c, index) in columnAttrs"
      :key="index"
      v-bind="c"
    >
      <template>
        <slot
          :name="c.prop"
        />
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'EtmTable',
  props: {
    elementTableAttributes: {
      type: Object
    },
    elementTableEvents: {
      type: Object
    },
    column: {
      type: Array
    }
  },
  computed: {
    attributes() {
      const defaultSetting = {
        border: true
      }
      return Object.assign({}, defaultSetting, this.elementTableAttributes)
    },
    columnAttrs() {
      const result = []
      const defaultSetting = {
        'align': 'left',
        'header-align': 'left',
        'show-overflow-tooltip': true
      }
      this.column.forEach((v, i, arr) => {
        result[i] = Object.assign({}, defaultSetting, v)
      })
      return result
    }
  }
}
</script>

<style lang="scss">
</style>

