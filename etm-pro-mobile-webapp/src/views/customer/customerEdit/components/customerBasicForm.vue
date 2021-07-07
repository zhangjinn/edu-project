<template>
  <div class="editCustomerForm">
    <van-cell-group :border="false">
      <template v-for="(item,index) in allAttribute">
        <van-cell
          v-if="item.visible && item.name !== '联系人姓名' && item.name !== '联系人电话'"
          :key="index"
          :required="item.mandatory"
          :class="item.key === 'mark' && formList.mark.length ? 'markCell' : ''"
        >
          <template v-if="item.name === '头像'">
            <van-cell
              title="头像"
              is-link
            >
              <div class="userImg">
                <van-uploader :after-read="afterRead">
                  <div v-if="formList.avatar" class="img">
                    <img :src="formList.avatar">
                  </div>
                  <span v-else class="iconfont icondefault" />
                </van-uploader>
              </div>
            </van-cell>
          </template>
          <template v-else-if="item.name === '联系人称呼'">
            <van-cell
              title="联系人"
              class="addContact"
            >
              <div class="right" @click="addContact">添加联系人</div>
            </van-cell>
            <van-cell>
              <div v-for="(list,ind) in formList.contactDTOList" :key="ind" class="contactList">
                <input v-show="false" v-model="list.contact_id">
                <van-row>
                  <van-col :span="5">
                    <div class="relationBox" @click="openRelationPicker(ind)">
                      <span v-if="list.contact_relationship">{{ list.contact_relationship }}</span>
                      <span v-else class="labelColor">称呼</span>
                      <span
                        v-if="showRelation&&ind === relationIndex"
                        class="iconfont iconarrow-up"
                      />
                      <span v-else class="iconfont iconarrow-down" />
                    </div>
                  </van-col>
                  <van-col :span="6" :offset="1" class="leftLine">
                    <input v-model="list.contact_name" class="contactInput" placeholder="请输入姓名">
                  </van-col>
                  <van-col :span="9" :offset="1" class="leftLine">
                    <input
                      v-model="list.contact_telephone"
                      class="contactInput"
                      placeholder="请输入电话号码"
                      @blur="judge(list.contact_telephone)"
                    >
                  </van-col>
                  <van-col :span="2">
                    <div v-if="ind > 0" class="reduceIcon textRight">
                      <span
                        class="iconfont icondelete"
                        @click="reduceContact(ind)"
                      />
                    </div>
                  </van-col>
                </van-row>
              </div>
            </van-cell>
          </template>
          <template v-else-if="item.name === '标签'">
            <van-cell>
              <van-field
                readonly
                :label="item.name"
                input-align="left"
                right-icon="arrow"
                placeholder="请编辑选择"
                @click="editTag"
              />
              <div v-if="formList.mark&&formList.mark.length" class="tagBox">
                <van-tag
                  v-for="(mark,i) in formList.mark"
                  :key="i"
                  class="tag"
                  color="#CFF3F3"
                  text-color="#10C2C4"
                >
                  {{ mark.name }}
                </van-tag>
              </div>
            </van-cell>
          </template>
          <template v-else-if="item.name === '生日'">
            <van-field
              v-model="formList[item.key]"
              readonly
              :label="item.name"
              input-align="left"
              right-icon="arrow"
              placeholder="请选择"
              @click="openBirthdayPicker"
            />
          </template>
          <template v-else-if="item.name === '市场人员'">
            <van-field
              v-model="formList[item.key]"
              readonly
              :label="item.name"
              input-align="left"
              right-icon="arrow"
              placeholder="请选择"
              @click="showMarketPicker"
            />
          </template>
          <template v-else-if="item.name === '居住地区'">
            <van-field
              v-model="formList[item.key]"
              readonly
              :label="item.name"
              input-align="left"
              right-icon="arrow"
              placeholder="请选择省/市/区"
              @click="showAddressEdit()"
            />
          </template>
          <template v-else>
            <van-field
              v-if="item.controlType === 'CASCADE_SELECT_BOX' || item.controlType === 'RADIO' || item.controlType === 'SELECT_BOX'"
              v-model="formList[item.key]"
              readonly
              :label="item.name"
              input-align="left"
              right-icon="arrow"
              placeholder="请选择"
              @click="openOptionsPicker(item)"
            />
            <van-field
              v-else-if="item.controlType === 'INPUT_BOX'"
              v-model="formList[item.key]"
              :label="item.name"
              input-align="left"
              placeholder="请输入内容"
            />
            <van-field
              v-else-if="item.controlType === 'CHECKBOX'"
              v-model="formList[item.key]"
              readonly
              :label="item.name"
              input-align="left"
              right-icon="arrow"
              placeholder="请选择"
              @click="openCheckboxPicker(item)"
            />
            <van-field
              v-else-if="item.controlType === 'DATE'"
              v-model="formList[item.key]"
              readonly
              :label="item.name"
              input-align="left"
              right-icon="arrow"
              placeholder="请选择"
              @click="openDatePicker(item)"
            />
          </template>
        </van-cell>
      </template>
    </van-cell-group>
    <!--选择客户生日-->
    <van-popup
      v-model="showBirthdayPicker"
      position="bottom"
      get-container="#app"
    >
      <van-datetime-picker
        v-model="birthdayDate"
        title="客户生日"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="closePicker"
        @confirm="confirmBirthday"
      />
    </van-popup>

    <!--单选、下拉-->
    <van-action-sheet
      v-model="showRadioPicker"
      :actions="radioTxt"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @cancel="closePicker"
      @select="confirmOptions"
    />

    <!--选择联系人关系-->
    <van-action-sheet
      v-model="showRelation"
      class="actionSelect"
      :actions="relationshipOption"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @cancel="closePicker"
      @select="confirmRelation"
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

    <!--日期控件弹框-->
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
        @confirm="confirmSelfDate"
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
import { DateFormat, judgePhone } from '../../../../js/rules'
import { getCustomerDictType, getCustomerContact } from '../../../../service/customer/customer'
import { getAllEmployee } from '../../../../service/base/contact'
import departmentList from '../../components/departmentList'
import { getOrgMsg } from '../../../../js/organization'
import area from '@/js/area'
export default {
  name: 'EditCustomerForm',
  components: {
    departmentList
  },
  props: {
    formList: {
      type: Object,
      default() {
        return {}
      }
    },
    requireComplete: {
      type: Array,
      default() {
        return []
      }
    },
    postData: {
      type: Object,
      default() {
        return {}
      }
    },
    customerId: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      showBirthdayPicker: false,
      showRadioPicker: false,
      showSources: false,
      showMarket: false,
      showRelation: false,
      showAreaPicker: false,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      birthdayDate: new Date(),
      currentItem: {},
      relationshipOption: [],
      sexTxt: [
        {
          name: '男',
          id: 1
        },
        {
          name: '女',
          id: 2
        }
      ],
      requireField: [],
      sourcesTxt: [],
      radioTxt: [],
      allAttribute: [],
      options: [],
      optionsIds: [],
      optionsIndex: 0,
      showOptionsPicker: [],
      multipleOptions: [],
      showMultiplePicker: [],
      multipleResult: [],
      multipleIndex: 0,
      showDatePicker: false,
      defaultDate: new Date(),
      selfDateIndex: 0,
      relationIndex: 0,
      showCheckboxPicker: false,
      checkboxOption: [],
      marketData: [],
      areaValue: '',
      areaList: area
    }
  },
  created() {
    this.getSelfField()
    if (this.customerId) {
      this.getContact()
    }
  },
  methods: {
    getSelfField() {
      getCustomerDictType(this.customerId).then(res => {
        this.allAttribute = res.data.data
        const arr = []
        this.allAttribute.forEach(item => {
          if (item.key !== 'contact_relationship' && item.key !== 'contact_name' && item.key !== 'contact_telephone' && item.key !== 'area_code' && item.key !== 'gender') {
            const data = {
              key: item.key,
              value: ''
            }
            this.postData.customFields.push(data)
          }
          if (item.controlType === 'INPUT_BOX' && item.key !== 'avatar' && item.key !== 'contact_name' && item.key !== 'contact_telephone') {
            const data = {
              key: item.key,
              name: item.name
            }
            arr.push(data)
          }
          if (item.key === 'contact_relationship') {
            for (let i = 0; i < item.options.length; i++) {
              const data = {
                name: item.options[i].label,
                contact_id: item.options[i].id
              }
              this.relationshipOption.push(data)
            }
          }
          if (item.key === 'area_code') {
            let obj = {
              province: '',
              provinceName: '',
              city: '',
              cityName: '',
              region: '',
              regionName: ''
            }
            if (item.value) {
              const vv = JSON.parse(item.value)
              obj = {
                province: vv.province,
                provinceName: vv.provinceName,
                city: vv.city,
                cityName: vv.cityName,
                region: vv.region,
                regionName: vv.regionName
              }
            }

            const data = {
              key: item.key,
              value: JSON.stringify(obj)
            }
            this.postData.customFields.push(data)
          }
          if (item.key === 'gender') {
            const data = {
              key: item.key,
              value: item.value === '男' ? 'MALE' : 'FEMALE'
            }
            this.postData.customFields.push(data)
          }
          if (item.mandatory && item.key !== 'contact_name' && item.key !== 'contact_telephone') {
            const data = {
              key: item.key,
              name: item.name
            }
            this.requireField.push(data)
          }
          if (item.value) {
            if (item.key === 'marketer') {
              this.getMarket(item.value)
            } else if (item.key === 'mark') {
              item.value.split(',').forEach(item => {
                const data = {
                  name: item
                }
                this.formList.mark.push(data)
              })
            } else if (item.key === 'area_code') {
              const v = JSON.parse(item.value)
              let str = ''
              str = `${v.provinceName} ${v.cityName} ${v.regionName}`
              this.formList[item.key] = str
            } else {
              this.formList[item.key] = item.value
            }
            for (let u = 0; u < this.postData.customFields.length; u++) {
              if (item.key === this.postData.customFields[u].key) {
                if (item.key === 'gender') {
                  this.postData.customFields[u].value = (item.value === '男' ? 'MALE' : 'FEMALE')
                } else if (item.key === 'avatar') {
                  this.postData.customFields[u].value = item.value.split('com')[1]
                } else {
                  this.postData.customFields[u].value = item.value
                }
              }
            }
            this.setFieldId(item.key)
          }
        })

        this.$emit('requireField', this.requireField, arr)
      })
    },
    getMarket(id) {
      const organizationId = getOrgMsg('id')
      getAllEmployee(organizationId).then(res => {
        this.marketData = res.data.data
        this.marketData.forEach(item => {
          if (item.id === parseInt(id)) {
            this.$set(this.formList, 'marketer', item.name)
          }
        })
      })
    },
    getContact() {
      getCustomerContact(this.customerId).then(res => {
        const data = res.data.data
        if (data.length) {
          this.formList.contactDTOList = []
        }
        data.forEach(item => {
          const obj = {}
          obj.contactId = item.contactId
          for (let i = 0; i < item.customFields.length; i++) {
            obj[item.customFields[i].key] = item.customFields[i].value
          }
          this.formList.contactDTOList.push(obj)
        })
      })
    },
    editTag() {
      this.$emit('tagEditOn', true)
    },
    formatTime(time) {
      return DateFormat(time, 'yyyy-MM-dd')
    },
    judge(phone) {
      if (!judgePhone(phone)) {
        this.$toast({
          icon: 'icon iconfont iconwarning',
          message: '电话号码格式不正确',
          duration: 1000
        })
      }
    },
    setFieldId(txt) {
      if (this.requireComplete.indexOf(txt) === -1) {
        this.requireComplete.push(txt)
      }
    },
    // 选择客户生日
    openBirthdayPicker() {
      this.showBirthdayPicker = true
      if (this.formList.birthday) {
        this.birthdayDate = new Date(this.formList.birthday.replace(/-/g, '/'))
      }
    },
    confirmBirthday(time) {
      this.closePicker()
      this.birthdayDate = new Date(time)
      this.formList.birthday = this.formatTime(time)
      for (let i = 0; i < this.postData.customFields.length; i++) {
        if (this.postData.customFields[i].key === 'birthday') {
          this.postData.customFields[i].value = this.formatTime(time)
          break
        }
      }
      this.setFieldId('birthday')
    },
    // 选择市场人员
    showMarketPicker() {
      this.showMarket = true
      this.$emit('showMarket', true)
    },
    // 选择省市区
    showAddressEdit() {
      this.showAreaPicker = true
    },
    confirmMarket(val) {
      this.showMarket = false
      this.$emit('showMarket', false)
      if (val) {
        this.formList.marketer = val.name
        for (let i = 0; i < this.postData.customFields.length; i++) {
          if (this.postData.customFields[i].key === 'marketer') {
            this.postData.customFields[i].value = val.id
            break
          }
        }
        this.setFieldId('marketer')
      }
    },
    // 增加联系人
    addContact() {
      let flag = false
      for (let i = 0; i < this.formList.contactDTOList.length; i++) {
        if (!this.formList.contactDTOList[i].contact_name ||
                        !this.formList.contactDTOList[i].contact_telephone ||
                        !this.formList.contactDTOList[i].contact_relationship) {
          flag = true
          this.$toast({
            message: '完善已有联系人才能再添加',
            duration: 1000
          })
          break
        }
      }
      if (!flag) {
        const newData = {
          contactId: null,
          contact_name: null,
          contact_telephone: null,
          contact_relationship: null
        }
        this.formList.contactDTOList.push(newData)
      }
    },
    // 删除联系人
    reduceContact(index) {
      if (this.formList.contactDTOList.length === 1) {
        this.$toast({
          message: '联系人不能少于一个',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      } else {
        this.formList.contactDTOList.splice(index, 1)
      }
    },
    // 选择联系人关系
    openRelationPicker(index) {
      this.relationIndex = index
      this.showRelation = true
    },
    confirmRelation(val) {
      this.showRelation = false
      this.formList.contactDTOList[this.relationIndex].contact_relationship = val.name
    },
    // 单选、下拉控件
    openOptionsPicker(item) {
      this.currentItem = item
      this.radioTxt = []
      if (item.key === 'gender') {
        this.radioTxt = [
          {
            name: '男',
            value: 'MALE'
          },
          {
            name: '女',
            value: 'FEMALE'
          }
        ]
      } else if (item.key === 'source') {
        for (let i = 0; i < item.options.length; i++) {
          const data = {
            name: item.options[i].label
          }
          this.radioTxt.push(data)
          for (let v = 0; v < item.options[i].child.length; v++) {
            const data = {
              name: item.options[i].child[v].label
            }
            this.radioTxt.push(data)
          }
        }
      } else {
        for (let i = 0; i < item.options.length; i++) {
          const data = {
            name: item.options[i].label
          }
          this.radioTxt.push(data)
        }
      }
      this.showRadioPicker = true
    },
    confirmOptions(val) {
      this.closePicker()
      this.formList[this.currentItem.key] = val.name
      for (let i = 0; i < this.postData.customFields.length; i++) {
        if (this.postData.customFields[i].key === this.currentItem.key) {
          if (this.currentItem.key === 'gender') {
            this.postData.customFields[i].value = val.value
          } else {
            this.postData.customFields[i].value = val.name
          }
          break
        }
      }
      this.setFieldId(this.currentItem.key)
    },
    // 多选控件
    openCheckboxPicker(item) {
      this.currentItem = item
      this.showCheckboxPicker = true
      this.multipleResult = []
      this.checkboxOption = []
      item.options.forEach(item => {
        this.checkboxOption.push(item.label)
      })
      if (this.formList[item.key]) {
        this.multipleResult = this.formList[item.key].split(',')
      } else if (item.value) {
        this.multipleResult = item.value
      }
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
      this.formList[this.currentItem.key] = this.multipleResult.join(',')
      for (let i = 0; i < this.postData.customFields.length; i++) {
        if (this.postData.customFields[i].key === this.currentItem.key) {
          this.postData.customFields[i].value = this.multipleResult.join(',')
          break
        }
      }
      this.setFieldId(this.currentItem.key)
    },
    // 日期控件
    openDatePicker(item) {
      this.currentItem = item
      this.showDatePicker = true
      if (this.formList[this.currentItem.key]) {
        this.defaultDate = new Date(this.formList[this.currentItem.key].replace(/-/g, '/'))
      } else if (item.value) {
        this.defaultDate = new Date(item.value)
      } else {
        this.defaultDate = new Date()
      }
    },
    confirmSelfDate(time) {
      this.closePicker()
      this.formList[this.currentItem.key] = this.formatTime(time)
      for (let i = 0; i < this.postData.customFields.length; i++) {
        if (this.postData.customFields[i].key === this.currentItem.key) {
          this.postData.customFields[i].value = this.formatTime(time)
          break
        }
      }
      this.setFieldId(this.currentItem.key)
    },
    // 关闭选择框
    closePicker() {
      this.showBirthdayPicker = false
      this.showSources = false
      this.showRelation = false
      this.showRadioPicker = false
      this.showCheckboxPicker = false
      this.showDatePicker = false
      this.showAreaPicker = false
    },
    // 上传头像
    afterRead(file) {
      this.formList.avatarFile = file.file
      this.setFieldId('avatar')
      this.$emit('changImg', file.content)
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
      this.formList['area_code'] = str
      for (let u = 0; u < this.postData.customFields.length; u++) {
        if (this.postData.customFields[u].key === 'area_code') {
          this.postData.customFields[u].value = JSON.stringify(obj)
        }
      }
      this.setFieldId('area_code')
      this.showAreaPicker = false
    }
  }
}
</script>

<style lang="scss">

    .editCustomerForm {
        background-color: $white;

        .iconfont {
            font-size: 20px;
            color: $theme;
        }

        .addContact {
            .right {
                color: $theme;
                font-size: 12px;
            }
        }

        .contactList {
            padding: 19.5px 0;

            &:not(:last-child) {
                border-bottom: .5px solid $text-e;
            }

            &:last-child {
                padding-bottom: 0;
            }

            .relationBox {
                font-size: 15px;

                .iconfont {
                    float: right;
                    margin-right: 10px;
                    font-size: 12px;
                    color: $text-b;
                }
            }

            .contactInput {
                width: 100%;
                font-size: 15px;
                background-color: transparent;
            }

            .leftLine {
                position: relative;

                &::before {
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    left: -14.5px;
                    content: '';
                    @include wh(.5px, 25px);
                    background-color: $text-e;
                }
            }

            .reduceIcon {
                .iconfont {
                    font-size: 15px;
                    color: $text-b;
                }
            }

            .dropList {
                .van-cell {
                    padding: 10px 16px;
                }

                .van-dropdown-item__content {
                    left: 12px;
                    right: 12px;
                    width: auto;
                }
            }
        }

        .van-uploader__upload-text {
            margin-top: 0;
        }

        .tagBox {
            padding-top: 10px;

            .tag {
                margin: 0 8px 8px 0;
            }
        }
    }

    .van-cell {
        padding: 20px 16px;
        overflow: visible;

        &.markCell {
            padding: 20px 16px 12px;
        }

        &.checkboxItem {
            padding: 20px 16px;
        }

        &::after {
            right: 16px !important;
            left: 16px !important;
        }

        .van-cell {
            padding: 0;

            &::after {
                border: none;
            }
        }
    }

    .van-cell__value {
        position: relative;
        overflow: visible;
    }

    .userImg {
        position: absolute;
        right: 0;
        top: -5.5px;

        .img {
            @include round(35px);
            overflow: hidden;
        }

        .iconfont {
            color: $text-d;
            font-size: 30px;
        }
    }

    .van-popup {
        .checkboxList {
            height: 220px;
            overflow-y: auto;

            &::after {
                border: none;
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
            padding-bottom: 58px;
        }

        .van-action-sheet__cancel {
            position: fixed;
            bottom: 0;
            left: 0;
        }
    }
</style>
