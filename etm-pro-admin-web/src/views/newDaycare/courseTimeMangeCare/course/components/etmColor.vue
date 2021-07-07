<template>
  <div class="etmColor-wrap">
    <el-color-picker
      v-model="color"
      popper-class="colorPicker"
      :color-format="colorFormat"
      :predefine="preDefineColors"
      v-bind="$attrs"
      @click.native="handleClick"
      @change="handleChange"
      v-on="$listeners"
    />
  </div>

</template>

<script>
/**
 * etmColor create by haijinsha
 * createTime 2020/9/15 17:46
 */
export default {
  name: 'EtmColor',
  components: {},
  filters: {},
  mixins: [],
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    colorFormat: {
      type: String,
      default: 'rgb'
    },
    preDefineColors: {
      type: Array,
      default() {
        return [
          'rgb(255,69,0)',
          'rgb(255,140,0)',
          'rgb(255,215,0)',
          'rgb(144,238,144)',
          'rgb(0,206,209)',
          'rgb(30,144,255)',
          'rgb(199,21,133)'
        ]
      }
    }
  },
  data() {
    return {
      color: this.value
    }
  },
  computed: {},
  watch: {
    value: {
      handler(val) {
        this.color = val
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    console.log('this.value: ', this.value)
  },
  methods: {
    handleClick() {
      document.querySelectorAll('.colorPicker').forEach(picker => {
        picker.querySelector('.el-color-dropdown__main-wrapper').style.display = 'none'
        picker.querySelector('.el-color-dropdown__value').style.display = 'none'
        picker.querySelector('.el-color-dropdown__link-btn').style.display = 'none'
      })
    },
    handleChange(e) {
      this.$emit('input', e)
    }
  }
}
</script>
<style lang="scss" scoped>
  .etmColor-wrap {

  }
</style>
