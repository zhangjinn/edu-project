<template>
  <div class="index-wrap">
    <el-select
      v-model="value"
      multiple
      :popper-append-to-body="false"
      v-bind="$attrs"
      :style="{width: `${width}px`}"
      v-on="$listeners"
      @remove-tag="removeTag"
      @clear="clear"
    >
      <el-option
        value="0"
        style="height: auto"
      >
        <el-tree
          ref="tree"
          :data="treeData"
          :props="props"
          show-checkbox
          v-bind="$attrs"
          v-on="$listeners"
          @check-change="checkChange"
        />
      </el-option>
    </el-select>
  </div>
</template>

<script>
/**
   * index create by 油麦菜
   * createTime 2021/1/4 16:19
   */
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return []
      }
    },
    // 回显的keys
    echoedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    showParent: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: ''
    },
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          children: 'children'
        }
      }
    }
  },
  data() {
    return {
      options: [],
      value: [],
      copyValue: [],
      selectValue: []
    }
  },
  computed: {},
  watch: {
    echoedKeys(val) {
      this.handleEchoed(val)
    },
    treeData(val) {
      if (!val.length) {
        this.value = []
        this.$emit('change', this.value)
      }
    }

  },
  created() {
  },
  mounted() {
  },
  methods: {
    checkChange() {
      this.selectValue = this.$refs.tree.getCheckedNodes(true)
      this.$emit('change', this.selectValue)
      if (this.showParent) {
        this.handleShowParent()
      } else {
        this.value = this.selectValue.map(item => item[this.props.label])
      }
    },
    removeTag(tag) {
      const removeIndex = this.copyValue.indexOf(tag)
      const keys = this.$refs.tree.getCheckedKeys(true)
      keys.splice(removeIndex, 1)
      this.$refs.tree.setCheckedKeys(keys)
      this.checkChange() // 删除的时候需要执行一下该方法，不然会有bug
    },
    clear() {
      const keys = []
      this.$refs.tree.setCheckedKeys(keys)
    },
    handleEchoed(keys) {
      this.$refs.tree.setCheckedKeys(keys)
    },
    handleShowParent() {
      const selectKeys = this.$refs.tree.getCheckedKeys(true)
      // copyValue当删除（removeTag）某个标签时，需要知道删除的下标，因为删除的时候value已经没有该值了
      this.copyValue = this.value = selectKeys.map(key => {
        const node = this.$refs.tree.getNode(key)
        return this.recursion(node)
      })
    },
    // 递归显示父级的label
    recursion(node) {
      const label = node.data[this.props.label]
      if (node.parent) {
        return `${this.recursion(node.parent)}/${label}`.replace('undefined/', '')
      } else {
        return label
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    ::v-deep .el-select-dropdown__item {
      padding: 0;
    }
  }
</style>
