<template>
  <div class="EtmFieldLabel-wrap">
    <div
      :class="[
        'label',
        'label--type--'+type
      ]"
    >
      <template v-if="$slots.label">
        <slot name="label" />
      </template>
      <template v-else>{{ label }} </template>
      {{ type !== 'left' ? splitSymbol: '' }}
    </div>
    <div class="value">
      <slot />
    </div>
  </div>

</template>

<script>
/**
 * EtmFieldLabel create by haijinsha
 * createTime 2020/8/18 13:44
 */
export default {
  name: 'EtmFieldLabel',
  components: {},
  filters: {},
  mixins: [],
  props: {
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'normal',
      validator(val) {
        return ['left', 'normal', 'right'].includes(val)
      }
    },
    separator: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      splitSymbol: '：'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
  @import "../../styles/src/etm/fieldLabel";
</style>
