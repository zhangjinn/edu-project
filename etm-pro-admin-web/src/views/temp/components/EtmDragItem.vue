<template>
  <div class="EtmDragItemWrap">
    <slot />
  </div>
</template>
<script>
import Sortable from 'sortablejs'
export default {
  name: 'EtmDragItem',
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    events: {
      type: Object,
      default() {
        return {}
      }
    },
    dragClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultOptions: {
        handle: this.dragClass,
        animation: 150,
        swap: true,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        }
      },
      defaultEvents: {}
    }
  },
  computed: {
  },
  mounted() {
    this.setSort()
  },
  methods: {
    setSort() {
      const el = this.$el.children[0]
      const options = Object.assign({}, this.defaultOptions, this.options)
      const events = Object.assign({}, this.defaultEvents, this.events, { onEnd: this.onEnd })
      new Sortable(el, {
        ...options,
        ...events
      })
    },
    onEnd(evt) {
      this.events.onEnd && this.events.onEnd(evt)
      this.$emit('update', evt)
    }
  }
}
</script>

<style scoped lang="scss">
.EtmDragItemWrap {

}
</style>
