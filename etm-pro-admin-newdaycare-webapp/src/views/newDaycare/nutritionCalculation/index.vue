<template>
  <div class="calcNutrients-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="activeName"
          >
            <el-tab-pane
              v-for="item in formData"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            >
              <etm-tool-bar
                v-model="item.model"
                @search="search('tab1',item.model)"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <people-count v-show="activeName === 'repastCountRegister'" />
          <meal-use-register v-if="activeName === 'mealUseRegister'" />
        </div>
      </etm-layout-split>
      <etm-layout-split
        v-show="activeName === 'repastCountRegister'"
        class="bottom"
      >
        <div class="body">
          <meal-count />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * calcNutrients create by Administrator
 * createTime 2021/3/12 16:02
 */
import peopleCount from '@/views/newDaycare/nutritionCalculation/components/peopleCount'
import mealCount from '@/views/newDaycare/nutritionCalculation/components/mealCount'
import mealUseRegister from '@/views/newDaycare/nutritionCalculation/components/mealUseRegister'
export default {
  name: 'RepastCountRegister',
  components: {
    peopleCount,
    mealCount,
    mealUseRegister
  },
  filters: {},
  mixins: [],
  props: {
    date: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeName: 'repastCountRegister',
      formData: [
        {
          label: '就餐人数登记',
          name: 'repastCountRegister',
          model: [
            {
              label: '人群',
              type: 'select',
              prop: 'grade',
              value: '',
              props: {
                placeholder: '请选择人群'
              },
              options: []
            },
            {
              label: '日期',
              type: 'date',
              value: '',
              prop: 'time',
              default: Date.now(),
              props: {
                type: 'month',
                placeholder: '请选择日期'
              }
            }
          ]
        },
        {
          label: '食物用量登记',
          name: 'mealUseRegister',
          model: [
            {
              label: '人群',
              type: 'select',
              prop: 'grade',
              value: '',
              props: {
                placeholder: '请选择人群'
              },
              options: []
            },
            {
              label: '日期',
              type: 'date',
              value: '',
              prop: 'time',
              default: Date.now(),
              props: {
                type: 'month',
                placeholder: '请选择日期'
              }
            }
          ]
        }
      ],
      currentFormData: []
    }
  },
  computed: {},
  watch: {
    // date: {
    //   handler (val) {
    //     console.log(val)
    //     this.tipData[0].digit = val.substring(0, 7)
    //   },
    //   immediate: true
    // }
    activeName: {
      handler (val) {
        this.currentFormData = this.formData.find(item => item.name === val)
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .layout-body,
    .layout-default {
      padding-bottom: 16px !important;
    }
  }

  .bottom {
    margin-top: 24px;
  }
</style>
