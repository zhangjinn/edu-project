<template>
  <etm-drawer
    :visible.sync="isShow"
    type="big"
  >
    <div class="chargeForm-wrap">
      <etm-layout-split>
        <etm-title
          :show-line="false"
          border
          size="big"
        >
          合同详情
        </etm-title>

        <component
          :is="components[isEdit ? 'edit' : 'text']"
          ref="component"
          :prop="prop"
        />
      </etm-layout-split>
    </div>
  </etm-drawer>
</template>

<script>

/**
 * chargeForm create by Administrator
 * createTime 2020/8/20 17:29
 */

import chargeDetailEdit from '@/views/newDaycare/contract/teachContract/components/chargeDetailEdit'
import chargeDetailText from '@/views/newDaycare/contract/teachContract/components/chargeDetailText'

export default {
  name: 'ChargeDetail',
  components: {
    chargeDetailText,
    chargeDetailEdit
  },
  filters: {},
  mixins: [],
  props: {
    prop: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      components: {
        text: chargeDetailText,
        edit: chargeDetailEdit
      },
      // contractType: 'PER_CHILD',
      isEdit: false,
      isShow: false
    }
  },
  computed: {},
  watch: {
    isShow: {
      handler (n) {
        if (!n) {
          const component = this.$refs.component
          if (component.cancelCache) {
            component.cancelCache()
          }
        }
      }
    },
    prop: {
      immediate: true,
      deep: true,
      handler (n) {
        this.isEdit = n.edit
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    save () {
      this.$refs.component.save().then(res => {
        this.$emit('update', {})
        this.isShow = false
      })
    },
    triggerShow () {
      this.isShow = true
    }

  }
}
</script>
<style lang="scss" scoped>
.chargeForm-wrap {
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }
}
</style>
