<template>
  <div class="printTemplate-wrap">
    <div
      id="print-table"
    >
      <slot name="top" />
      <table
        class="print-table"
        style="width: 100%;"
        border="1"
        cellspacing="0"
        cellpadding="20"
      >
        <thead>
          <tr>
            <th
              v-for="item in columns"
              :key="item.prop"
            >
              {{ item.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="merge">
            <template v-for="(item, index) in tableData">
              <tr
                v-if="index !== tableData.length - 1"
                :key="index"
              >
                <td
                  v-for="(td, ind) in Object.values(item)"
                  :key="ind"
                >
                  {{ td }}
                </td>
              </tr>
              <tr
                v-else
                :key="index"
              >
                <template v-for="(td, tdIndex) in Object.values(item)">
                  <td
                    v-if="tdIndex === 0"
                    :key="tdIndex"
                    colspan="2"
                  >
                    {{ td }}
                  </td>
                  <td
                    v-else-if="tdIndex !== 1"
                    :key="tdIndex"
                  >
                    {{ td }}
                  </td>
                </template>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr
              v-for="(item, index) in tableData"
              :key="index"
            >
              <td
                v-for="(td, ind) in Object.values(item)"
                :key="ind"
              >
                {{ td }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/**
   * printTemplate create by 油麦菜
   * createTime 2021/3/25 16:10
   */
import { Print } from '@/utils/common'
export default {
  name: 'PrintTemplate',
  components: {},
  filters: {},
  mixins: [],
  props: {
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    merge: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {
  },
  created () {
  },
  mounted () {
    console.log(this.$slots)
  },
  methods: {
    printTable () {
      Print('#print-table', {
        style: `table {
          text-align: center;
        }`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .printTemplate-wrap {
    display: none;
  }
</style>
