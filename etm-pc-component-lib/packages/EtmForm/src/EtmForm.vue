<template>
  <div class="EtmForm-wrap">
    <el-form
      v-bind="$attrs"
      :label-width="styleObject.labelWidth"
      :label-position="type === 'dialog' ? 'left': ''"
      :style="{...styleObject}"
      v-on="$listeners"
    >
      <slot />
    </el-form>
  </div>

</template>

<script>
/**
 * /EtmForm create by haijinsha
 * createTime 2020/5/22 16:21
 */
export default {
  name: 'EtmForm',
  components: {},
  filters: {},
  mixins: [],
  props: {
    type: {
      type: String,
      default: 'big'
    }
  },
  data() {
    return {}
  },
  computed: {
    styleObject() {
      const widthSet = {
        small: {
          labelWidth: '168px',
          width: '768px',
          maxWidth: '70%'
        },
        big: {
          labelWidth: '300px',
          width: '900px',
          maxWidth: '70%'
        },
        dialog: {
          labelWidth: '120px',
          width: '90%',
          maxWidth: '90%'
        }
      }
      return widthSet[this.type]
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss">
  @import "../../styles/src/etm/form";
</style>
