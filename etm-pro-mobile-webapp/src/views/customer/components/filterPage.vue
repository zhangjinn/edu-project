<template>
  <div class="filterPage">
    <div class="title">
      <div>筛选</div>
      <span class="iconfont iconout" @click="closeFilter" />
    </div>
    <div class="filterBox">
      <div class="filterList">
        <div v-for="(item,index) in filterItem" :key="index" class="filterItem">
          <div class="top textLeft">
            <span>筛选条件{{ index + 1 }}</span>
            <span v-if="index > 0" class="reduce right" @click="reduce(index)">删除条件</span>
          </div>
          <van-cell-group :border="false">
            <van-field
              v-model="item.condition"
              readonly
              right-icon="arrow"
              placeholder="请选择筛选条件"
              @click="openCondition(index)"
            />
            <van-field
              v-model="item.equal"
              readonly
              right-icon="arrow"
              placeholder="请选择值范围"
              @click="openEqual(index)"
            />
            <van-field
              v-if="item.showInput"
              v-model="item.val"
              placeholder="请输入"
            />
            <van-field
              v-else
              v-model="item.val"
              readonly
              right-icon="arrow"
              placeholder="请选择"
              @click="openValue(index)"
            />
          </van-cell-group>
        </div>
      </div>
      <div class="add textRight">
        <div v-if="filterItem.length > 1" class="left relation" @click="changeRelation">
          <span>条件关系：{{ relationValue.name }}</span>
          <span class="iconfont iconright" />
        </div>
        <div class="operate" @click="addFilter">
          <span class="iconfont iconplus" />
          <span>添加条件</span>
        </div>
      </div>
      <div v-show="hidshow" class="bottomFixed">
        <div class="bottomBtn notBottomBar van-hairline--top">
          <div class="btnOne" @click="reset">
            <control-btn text="重置" type="info" />
          </div>
          <div class="btnTwo" @click="inquire">
            <control-btn text="查询" type="primary" />
          </div>
        </div>
      </div>
    </div>
    <!--        筛选条件字段-->
    <van-action-sheet
      v-model="showCondition"
      class="actionSelect"
      :actions="conditionItems"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @cancel="closePicker"
      @select="confirmCondition"
    />
    <!--        筛选条件限定-->
    <van-action-sheet
      v-model="showEqual"
      class="actionSelect"
      :actions="equalItems"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @cancel="closePicker"
      @select="confirmEqual"
    />

    <!--        且还是或-->
    <van-action-sheet
      v-model="showRelation"
      class="actionSelect"
      :actions="relations"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @cancel="closePicker"
      @select="confirmRelation"
    />

    <!--单选、下拉弹框-->
    <van-action-sheet
      v-model="showSingleAction"
      class="actionSelect"
      :actions="singleOptions"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @cancel="closePicker"
      @select="confirmOptions"
    />

    <!--多选弹框-->
    <van-popup
      v-model="showCheckboxPicker"
      position="bottom"
      get-container="#app"
    >
      <div class="van-hairline--top-bottom van-picker__toolbar">
        <button class="van-picker__cancel" @click="closePicker">取消</button>
        <button class="van-picker__confirm" @click="confirmMultiple">确认</button>
      </div>
      <van-checkbox-group ref="checkboxGroup" v-model="multipleResult" checked-color="#10C2C4">
        <van-cell-group :border="false" class="checkboxList">
          <van-cell
            v-for="(option, i) in checkboxOption"
            :key="i"
            class="checkboxItem"
            clickable
            :title="option"
            @click="toggle(option)"
          >
            <van-checkbox
              ref="checkboxes"
              slot="right-icon"
              :name="option"
              icon-size="16px"
            />
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-popup>

    <!--自定义字段的日期控件弹框-->
    <van-popup
      v-model="showDatePicker"
      position="bottom"
      get-container="#app"
    >
      <van-datetime-picker
        v-model="defaultDate"
        type="date"
        :min-date="minDate"
        @cancel="closePicker"
        @confirm="confirmDate"
      />
    </van-popup>

    <!-- 地区选择 -->
    <van-popup
      v-model="showAreaPicker"
      position="bottom"
      get-container="#app"
    >
      <van-area
        :value="areaValue"
        :area-list="areaList"
        @cancel="closePicker"
        @confirm="confirmArea"
      />
    </van-popup>
    <template v-if="showMarket">
      <department-list @marketConfirm="confirmMarket" />
    </template>
  </div>
</template>

<script>
import { getAttribute } from '../../../service/customer/customer'
import controlBtn from '../../../components/common/controlBtn'
import departmentList from './departmentList'
import { DateFormat } from '../../../js/rules'
import area from '@/js/area'

export default {
  name: 'FilterPage',
  components: {
    controlBtn,
    departmentList
  },
  props: {
    filterItem: {
      type: Array,
      default() {
        return []
      }
    },
    relationIndex: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      showCondition: false,
      conditionItems: [],
      conditionIndex: -1,
      showEqual: false,
      equalItems: [],
      equalIndex: -1,
      valueIndex: -1,
      showSingleAction: false,
      singleOptions: [],
      showCheckboxPicker: false,
      multipleResult: [],
      checkboxOption: [],
      showDatePicker: false,
      minDate: new Date(1970, 0, 1),
      defaultDate: new Date(),
      showMarket: false,
      showRelation: false,
      relationValue: {},
      relations: [
        {
          name: '且',
          value: 'AND'
        },
        {
          name: '或',
          value: 'OR'
        }
      ],
      showAreaPicker: false,
      areaValue: '',
      commitAreaData: {
        province: '',
        provinceName: '',
        city: '',
        cityName: '',
        region: '',
        regionName: ''
      },
      areaList: area
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    this.getSelfField()
    this.relationValue = this.relations[this.relationIndex]
  },
  methods: {
    async getSelfField() {
      const res = await getAttribute()
      const allAttribute = res.data.data
      this.conditionItems = allAttribute
    },
    addFilter() {
      let flag = false
      for (let i = 0; i < this.filterItem.length; i++) {
        if (!this.filterItem[i].condition || !this.filterItem[i].equal || !this.filterItem[i].val) {
          flag = true
          this.$toast({
            message: '请完成筛选条件' + (i + 1),
            duration: 1000,
            icon: 'icon iconfont iconwarning'
          })
          break
        }
      }
      if (!flag) {
        const item = {
          condition: '',
          key: '',
          equal: '',
          op: '',
          val: '',
          id: '',
          showInput: false
        }
        this.filterItem.push(item)
      }
    },
    changeRelation() {
      this.showRelation = true
    },
    confirmRelation(val, index) {
      this.closePicker()
      this.relationValue = val
      this.$emit('index', index)
    },
    reduce(index) {
      this.filterItem.splice(index, 1)
    },
    closeFilter() {
      this.$emit('close', true)
    },
    openCondition(index) {
      this.conditionIndex = index
      this.showCondition = true
    },
    confirmCondition(val) {
      this.closePicker()
      if (this.filterItem[this.conditionIndex].condition !== val.name) {
        this.filterItem[this.conditionIndex].equal = ''
        this.filterItem[this.conditionIndex].op = ''
        this.filterItem[this.conditionIndex].val = ''
      }
      this.filterItem[this.conditionIndex].condition = val.name
      this.filterItem[this.conditionIndex].key = val.key
      if (val.controlType === 'INPUT_BOX' || val.controlType === 'MARK_SELECT_BOX') {
        this.filterItem[this.conditionIndex].showInput = true
      } else {
        this.filterItem[this.conditionIndex].showInput = false
      }
    },
    openEqual(index) {
      if (this.filterItem[index].condition) {
        this.equalIndex = index
        this.equalItems = []
        this.showEqual = true
        let num
        for (let i = 0; i < this.conditionItems.length; i++) {
          if (this.filterItem[index].condition === this.conditionItems[i].name) {
            num = i
          }
        }
        if (this.conditionItems[num].key === 'area_code') {
          this.conditionItems[num].op = ['IS']
        }
        this.conditionItems[num].op.forEach(op => {
          const data = {
            op: op,
            name: ''
          }
          // 枚举: IS,NOT,LIKE,NOTLIKE,GE,LE
          // 枚举备注: 是 不是 包含 不包含 大于等于 小于等于
          if (op === 'IS') {
            data.name = '是'
          } else if (op === 'NOT') {
            data.name = '不是'
          } else if (op === 'LIKE') {
            data.name = '包含'
          } else if (op === 'NOTLIKE') {
            data.name = '不包含'
          } else if (op === 'GE') {
            data.name = '大于等于'
          } else if (op === 'LE') {
            data.name = '小于等于'
          }
          this.equalItems.push(data)
        })
      }
    },
    confirmEqual(val) {
      this.closePicker()
      this.filterItem[this.equalIndex].equal = val.name
      this.filterItem[this.equalIndex].op = val.op
    },
    openValue(index) {
      if (this.filterItem[index].condition) {
        this.valueIndex = index
        this.singleOptions = []
        this.checkboxOption = []
        this.multipleResult = []
        let num
        for (let i = 0; i < this.conditionItems.length; i++) {
          if (this.filterItem[index].condition === this.conditionItems[i].name) {
            num = i
          }
        }
        if (this.conditionItems[num].key === 'source') {
          this.showSingleAction = true
          for (let i = 0; i < this.conditionItems[num].options.length; i++) {
            const data = {
              name: this.conditionItems[num].options[i].label
            }
            this.singleOptions.push(data)
            for (let v = 0; v < this.conditionItems[num].options[i].child.length; v++) {
              const data = {
                name: this.conditionItems[num].options[i].child[v].label
              }
              this.singleOptions.push(data)
            }
          }
        } else if (this.conditionItems[num].key === 'marketer' || this.conditionItems[num].key === 'counselor') {
          this.showMarketPicker()
        } else if (this.conditionItems[num].controlType === 'SELECT_BOX' || this.conditionItems[num].controlType === 'RADIO') {
          this.showSingleAction = true
          for (let i = 0; i < this.conditionItems[num].options.length; i++) {
            const data = {
              name: this.conditionItems[num].options[i].label
            }
            this.singleOptions.push(data)
          }
          if (this.conditionItems[num].key === 'gender') {
            this.singleOptions = [
              { name: '男' },
              { name: '女' }
            ]
          }
        } else if (this.conditionItems[num].controlType === 'CHECKBOX') {
          this.showCheckboxPicker = true
          for (let i = 0; i < this.conditionItems[num].options.length; i++) {
            this.checkboxOption.push(this.conditionItems[num].options[i].label)
          }
          if (this.filterItem[index].val) {
            this.multipleResult = this.filterItem[index].val.split(',')
          }
        } else if (this.conditionItems[num].controlType === 'DATE') {
          this.showDatePicker = true
          if (this.filterItem[index].val) {
            this.defaultDate = new Date(this.filterItem[index].val.replace(/-/g, '/'))
          } else {
            this.defaultDate = new Date()
          }
        } else if (this.conditionItems[num].controlType === 'AREA_BOX') {
          this.showAreaPicker = true
        }
      }
    },
    // 选择市场人员或顾问
    showMarketPicker() {
      this.showMarket = true
    },
    confirmMarket(val) {
      this.showMarket = false
      if (val) {
        this.filterItem[this.valueIndex].val = val.name
        this.filterItem[this.valueIndex].id = val.id
      }
    },
    // 单选、下拉的确定选择
    confirmOptions(val) {
      this.closePicker()
      this.filterItem[this.valueIndex].val = val.name
    },
    toggle(option) {
      if (this.multipleResult.indexOf(option) !== -1) {
        this.multipleResult.splice(this.multipleResult.indexOf(option), 1)
      } else {
        this.multipleResult.push(option)
      }
    },
    confirmMultiple() {
      this.closePicker()
      this.filterItem[this.valueIndex].val = this.multipleResult.join(',')
    },
    // 日期控件
    confirmDate(time) {
      this.closePicker()
      this.filterItem[this.valueIndex].val = this.formatTime(time)
    },
    formatTime(time) {
      return DateFormat(time, 'yyyy-MM-dd')
    },
    // 地址选择确认
    confirmArea(value) {
      let str = ''
      const obj = {
        province: value[0].code,
        provinceName: value[0].name,
        city: value[1].code,
        cityName: value[1].name,
        region: value[2].code,
        regionName: value[2].name
      }
      str = `${obj.provinceName} ${obj.cityName} ${obj.regionName}`
      this.filterItem[this.valueIndex].val = str
      this.commitAreaData = JSON.stringify(obj)

      this.showAreaPicker = false
    },
    // 关闭选择框
    closePicker() {
      this.showRelation = false
      this.showCondition = false
      this.showEqual = false
      this.showSingleAction = false
      this.showCheckboxPicker = false
      this.showDatePicker = false
      this.showAreaPicker = false
    },
    // 重置
    reset() {
      this.$emit('reset', true)
    },
    inquire() {
      const param = {
        items: [],
        op: this.relationValue.value
      }
      let flag = true
      this.filterItem.forEach(item => {
        if (!item.op || !item.key || !item.val) {
          this.$toast('请完善筛选条件')
          flag = false
        }
        if (!item.id) {
          if (item.op && item.key && item.val) {
            let v = item.val
            if (item.key === 'area_code') {
              v = this.commitAreaData
            }
            if (item.key === 'gender') {
              v = item.val === '男' ? 'MALE' : 'FEMALE'
            }
            param.items.push({
              op: item.op,
              key: item.key,
              val: v
            })
          }
        } else {
          if (item.op && item.key && item.id) {
            let v = item.id
            if (item.key === 'area_code') {
              v = this.commitAreaData
            }

            param.items.push({
              op: item.op,
              key: item.key,
              val: v
            })
          }
        }
      })
      if (flag) this.$emit('inquire', param)
    }
  }
}
</script>

<style lang="scss" scoped>

    .filterPage {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 111;
        background-color: $white;

        .title {
            position: relative;
            padding: 20px 12px;
            color: $black;
            line-height: 24px;

            .iconfont {
                position: absolute;
                right: 12px;
                top: 20px;
                color: $text-5;
            }
        }

        .filterBox {
            height: calc(100vh - 114px);
            overflow-y: auto;

            .top {
                padding: 12px;

                .reduce {
                    font-size: 12px;
                    color: $theme;
                }
            }

            .van-cell {
                padding: 10px 12px;

                &:last-child {
                    &::after {
                        position: absolute;
                        box-sizing: border-box;
                        content: ' ';
                        pointer-events: none;
                        right: 16px;
                        bottom: 0;
                        left: 16px;
                        border-bottom: 1px solid $text-e;
                        transform: scaleY(0.5);
                    }
                }
            }

            .add {
                padding: 12px;
                font-size: 14px;

                .relation {
                    .iconright {
                        margin-left: 4px;
                        color: $text-b;
                        font-size: 13px;
                    }
                }

                .operate {
                    display: inline-block;
                    color: $theme;

                    .iconplus {
                        margin-right: 8px;
                        font-size: 13px;
                    }
                }
            }

            .btnOne {
                width: 113px;
            }

            .btnTwo {
                width: calc(100% - 125px);
            }
        }
    }

    .actionSelect {
        max-height: 264px;

        button {
            &:nth-last-child(2) {
                margin-bottom: 58px;
            }
        }

        .van-checkbox-group {
            padding-bottom: 29px;
        }

        .van-action-sheet__cancel {
            position: fixed;
            bottom: 0;
            left: 0;
        }
    }
</style>
