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
          <template slot="tool">
            <template v-if="isEdit">
              <el-button
                size="mini"
                plain
                @click="cancelDrawer"
              >
                取消
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="save"
              >
                保存
              </el-button>
            </template>
            <template v-else>
              <el-button
                v-if="prop.contractType === '新签约' || prop.contractType === '续约'"
                type="primary"
                size="mini"
                @click="printContract"
              >
                打印
              </el-button>
              <el-button
                v-if="prop.contractType !== '转课' && prop.contractStatusEnum !== '退费' && prop.contractStatusEnum !== '转课'"
                v-has="{authId: 'daycare.contractTeach.update'}"
                size="mini"
                plain
                @click="handleEdit"
              >
                编辑
              </el-button>
            </template>
          </template>
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
import { print } from '@/components/print/print'

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
    },
    drawerPath: {
      type: Boolean,
      default: false
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
    printContract () {
      const link = this.$router.resolve({
        path: '/print',
        query: {
          type: 'teach',
          props: { prop: { id: this.prop.id } }
        }
      })
      print(link)
    },
    save () {
      this.$refs.component.save().then(res => {
        this.$emit('update', {})
        // this.isShow = false
        this.isEdit = false
      })
    },
    triggerShow () {
      this.isShow = true
    },
    cancelDrawer () {
      if (this.drawerPath) {
        this.isShow = false
        return
      }
      this.isEdit = false
    },
    handleEdit () {
      this.isEdit = true
      this.$emit('handleEdit', false)
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
