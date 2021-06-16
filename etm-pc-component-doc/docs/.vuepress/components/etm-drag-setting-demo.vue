<template>
  <div class="etm-form-demo-wrap">
    <high-code :code="code" :description="description">
      无
    </high-code>
    <params-table :table-data="tableData"/>
  </div>
</template>

<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";

/**
 * etm-form-demo create by haijinsha
 * createTime 2020/6/29 13:01
 */
export default {
  name: 'etm-drag-setting-demo',
  components: {HighCode, ParamsTable},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {

      tableData: [
        {
          param: 'data',
          description: '显示的数据',
          type: 'Array',
          option: '--',
          default: '--'
        },
        {
          param: 'addBtnText',
          description: '添加按钮文本',
          type: 'String',
          option: '--',
          default: '--'
        },
        {
          param: 'noSlot',
          description: '',
          type: 'Array',
          option: '--',
          default: '[]'
        },
        {
          param: 'handle',
          description: '',
          type: 'String',
          option: '--',
          default: '.handleWrap'
        },
        {
          param: 'change',
          description: '',
          type: 'Function',
          option: '--',
          default: '--'
        }
      ],
      code: `
     <template>
      <div class="itemWrap">
        <drag-item
          :data.sync="dragData"
          :add-btn-text="btnText"
          :change="handleChange"
          :no-slot="noSlot"
          @delete="handleDelete"
          @add="handleAdd"
        >
          <template v-slot:color="slotProps">
            <etm-color v-model="dragData[slotProps.index].color" @change="(arg) => handleColorChange(slotProps.index, ...arg)" />
          </template>
          <template v-slot:input="slotProps">

            // 一般只需要修改这里的内容即可满足设计需求
            <el-input
              v-model="dragData[slotProps.index].text"
              :disabled="dragData[slotProps.index].editable === false"
              @blur="handleInputBlur(slotProps.index)"
              @focus="handleInputFocus(slotProps.index)"
            />
          </template>
          <template v-slot:delete>
            <i class="iconshanchu1 iconfont" />
          </template>
          <template v-slot:handle>
            <i class="icontuozhuai iconfont" />
          </template>
        </drag-item>
      </div>
    </template>
    <script>
      import dragItem from '@/views/daycare/childManage/components/dragItem'
      import EtmColor from '@/views/daycare/courseTimeManageTeach/components/etmColor'

      export default {
        components: {
          EtmColor,
          dragItem
        },
        props: {
          data: {
            type: Array,
            required: true
          },
          noSlot: {
            type: Array,
            default() {
              return []
            }
          },
          btnText: {
            type: String,
            default: undefined
          },
          colorFormat: {
            type: String,
            default: 'rgb'
          }
        },
        data() {
          return {
            dragData: this.data
          }
        },
        watch: {
          dragData(v) {
            this.$emit('update:data', v)
          }
        },
        methods: {
          handleChange(...arg) {
            this.$emit('change', arg)
          },
          handleColorChange(...arg) {
            this.$emit('colorChange', arg)
          },
          handleAdd(...arg) {
            this.$emit('add', arg)
          },
          handleDelete(...arg) {
            this.$confirm('确定要删除该数据吗?', {
              type: 'error',
              confirmButtonClass: 'el-button--danger'
            }).then(() => {
              this.$emit('delete', arg)
            }).catch(() => {

            })
            this.$nextTick(() => {
              setTimeout(() => {
                document.activeElement.blur()
              }, 100)
            })
          },
          clickp() {
            const pickers = document.querySelectorAll('.colorPicker')
            Array.prototype.forEach.call(pickers, picker => {
              picker.querySelector('.el-color-dropdown__main-wrapper').style.display = 'none'
              picker.querySelector('.el-color-dropdown__value').style.display = 'none'
              picker.querySelector('.el-color-dropdown__link-btn').style.display = 'none'
            })
          },

          // 以上方法不需要变化，以下方法根据按需可改变
          handleInputBlur(index) {
            this.$emit('blur', index)
          },
          handleInputFocus(index) {
            this.$emit('focus', index)
          }
        }
      }
      `,
      description: '一般用于周日历模块（ 需要后端配合组织对应数据结构 ）'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    change(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.etm-form-demo-wrap {

}
</style>
