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
      default () {
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
  data () {
    return {
      color: this.value
    }
  },
  computed: {},
  watch: {
    value: {
      handler (val) {
        if (val) {
          this.color = val
        } else {
          this.color = this.preDefineColors[0]
          this.handleChange(this.color)
        }
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    this.handleClick()
  },
  methods: {
    handleClick () {
      this.$nextTick(() => {
        document.querySelectorAll('.colorPicker').forEach(picker => {
          picker.querySelector('.el-color-dropdown__main-wrapper').style.display = 'none'
          picker.querySelector('.el-color-dropdown__value').style.display = 'none'
          picker.querySelector('button').style.display = 'none'
          picker.querySelector('.el-color-dropdown__link-btn').style.display = 'none'
        })
      })
    },
    handleChange (e) {
      this.$emit('input', e)
      this.$emit('change', e)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
