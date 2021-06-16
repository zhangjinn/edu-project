<template>
  <div class="EtmFormFoot-wrap">
    <div class="content" :style="{marginLeft: labelWidth}">
      <slot>
        <el-button type="primary" @click="save">{{ saveBtn }}</el-button>
        <el-button plain @click="cancel">{{ cancelBtn }}</el-button>
      </slot>
    </div>
  </div>
</template>

<script>
/**
 * /EtmFormFoot create by haijinsha
 * createTime 2020/5/25 9:34
 */
export default {
  name: 'EtmFormFoot',
  components: {},
  filters: {},
  mixins: [],
  props: {
    saveBtn: {
      type: String,
      default: '保存'
    },
    cancelBtn: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {}
  },
  computed: {
    labelWidth() {
      const result = this.$parent.$children.find(item => {
        return item.$options._componentTag === 'etm-form'
      })
      return result.styleObject.labelWidth || ''
    }
  },
  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    save() {
      this.$emit('save')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss">
@import "../../styles/src/etm/formFoot";
</style>
