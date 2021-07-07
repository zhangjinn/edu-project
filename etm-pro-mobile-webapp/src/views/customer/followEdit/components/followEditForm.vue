<template>
  <div class="followEditForm textLeft">
    <van-cell-group :border="false">
      <template v-for="(item,index) in allAttribute">
        <van-cell
          v-if="item.visible&&item.key !== 'follow_img'"
          :key="index"
          :required="item.mandatory"
          :class="item.key === 'mark' && formList.tag.length ? 'markCell' : ''"
        >
          <template v-if="item.key === 'mark'">
            <van-cell>
              <van-field
                readonly
                label="客户标签"
                input-align="left"
                right-icon="arrow"
                placeholder="请编辑标签"
                @click="editTag"
              />
              <div v-if="formList.tag&&formList.tag.length" class="tagBox">
                <van-tag
                  v-for="(tag,ind) in formList.tag"
                  :key="ind"
                  class="tag"
                  color="#CFF3F3"
                  text-color="#10C2C4"
                >
                  {{ tag.name }}
                </van-tag>
              </div>
            </van-cell>
          </template>
          <template v-else-if="item.key === 'follow_content'">
            <van-cell>
              <div class="textareaBox">
                <span>跟进内容</span>
                <span class="count right">{{ formList.content&&formList.content.length ? formList.content.length : 0 }}/500</span>
                <div>
                  <textarea
                    v-model="formList.follow_content"
                    class="textarea"
                    placeholder="请描述跟进内容..."
                    maxlength="500"
                  />
                </div>
                <div class="pictureBox">
                  <van-uploader
                    v-model="formList.follow_img"
                    multiple
                    upload-icon="plus"
                    :after-read="afterRead"
                    @delete="deleteImg"
                  />
                </div>
              </div>
            </van-cell>
          </template>
          <template v-else>
            <van-field
              v-if="item.controlType === 'RADIO'||item.controlType === 'SELECT_BOX'"
              v-model="formList[item.key]"
              readonly
              :label="item.name"
              input-align="left"
              right-icon="arrow"
              :placeholder="'请选择'+item.name"
              @click="openOptionsPicker(item)"
            />
            <van-field
              v-else-if="item.controlType === 'INPUT_BOX'"
              v-model="formList[item.key]"
              :label="item.name"
              input-align="left"
              :placeholder="'请输入'+item.name"
            />
            <van-field
              v-else-if="item.controlType === 'CHECKBOX'"
              v-model="formList[item.key]"
              readonly
              :label="item.name"
              input-align="left"
              right-icon="arrow"
              :placeholder="'请选择'+item.name"
              @click="openMultiplePicker(item)"
            />
            <van-field
              v-else-if="item.controlType === 'DATE'"
              v-model="formList[item.key]"
              readonly
              :label="item.name"
              input-align="left"
              right-icon="arrow"
              placeholder="请选择时间"
              @click="openDatePicker(item)"
            />
          </template>
        </van-cell>
      </template>
    </van-cell-group>
    <!--单选、下拉选择弹框-->
    <van-action-sheet
      v-model="showOptionsPicker"
      class="actionSelect"
      :actions="optionsList"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @cancel="closePicker"
      @select="confirmOptions"
    />
    <!--多选选择弹框-->
    <van-popup
      v-model="showMultiplePicker"
      position="bottom"
      get-container="#app"
    >
      <div class="van-hairline--top-bottom van-picker__toolbar">
        <button class="van-picker__cancel" @click="closePicker">取消</button>
        <button class="van-picker__confirm" @click="confirmMultiple">确认</button>
      </div>
      <van-checkbox-group ref="checkboxGroup" v-model="multipleResult" checked-color="#10C2C4">
        <van-cell-group :border="false">
          <van-cell
            v-for="(option, i) in multipleOptions"
            :key="i"
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
    <!--日期控件选择弹框-->
    <van-popup
      v-model="showDatePicker"
      position="bottom"
      get-container="#app"
    >
      <van-datetime-picker
        v-model="defaultDate"
        :type="currentItem.key === 'follow_time' || currentItem.key === 'next_follow_time' ? 'datetime' : 'date'"
        @cancel="closePicker"
        @confirm="confirmSelfDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { DateFormat } from '../../../../js/rules'
import { getFollowFields } from '../../../../service/customer/customer'

export default {
  name: 'FollowEditForm',
  props: {
    formList: {
      type: Object,
      default() {
        return {}
      }
    },
    customerId: {
      type: Number,
      default() {
        return null
      }
    },
    followData: {
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
    }
  },
  data() {
    return {
      allAttribute: [],
      currentItem: {},
      optionsList: [],
      showOptionsPicker: false,
      multipleOptions: [],
      showMultiplePicker: false,
      multipleResult: [],
      multipleIndex: 0,
      showDatePicker: false,
      defaultDate: new Date(),
      imageUrl: [],
      requireField: []
    }
  },
  created() {
    this.getSelfField()
  },
  methods: {
    async getSelfField() {
      const res = await getFollowFields()
      const allAttribute = res.data.data
      this.allAttribute = allAttribute
      const arr = []
      this.allAttribute.forEach(item => {
        if (item.key !== 'important_level' && item.key !== 'state' && item.key !== 'sales_stage' && item.key !== 'mark') {
          const data = {
            key: item.key,
            value: ''
          }
          this.followData.customFields.push(data)
        }
        if (item.mandatory) {
          const data = {
            name: item.name,
            key: item.key
          }
          this.requireField.push(data)
        }
        if (item.controlType === 'INPUT_BOX') {
          const data = {
            key: item.key,
            name: item.name
          }
          arr.push(data)
        }
      })
      this.$emit('requireField', this.requireField, arr)
    },
    editTag() {
      this.$emit('tagEditOn', true)
    },
    setFieldId(txt) {
      if (this.requireComplete.indexOf(txt) === -1) {
        this.requireComplete.push(txt)
      }
    },
    removeFieId(txt) {
      if (this.requireComplete.indexOf(txt) !== -1) {
        this.requireComplete.splice(this.requireComplete.indexOf(txt), 1)
      }
    },
    formatTime(time, type) {
      if (type) return DateFormat(time, 'yyyy-MM-dd hh:mm:ss')
      return DateFormat(time, 'yyyy-MM-dd')
    },
    // 关闭选择框
    closePicker() {
      this.showOptionsPicker = false
      this.showMultiplePicker = false
      this.showDatePicker = false
    },
    // 单选、下拉控件
    openOptionsPicker(item) {
      this.currentItem = item
      this.showOptionsPicker = true
      this.optionsList = []
      item.options.forEach(option => {
        const data = {
          name: option.label
        }
        this.optionsList.push(data)
      })
    },
    confirmOptions(val) {
      this.closePicker()
      this.formList[this.currentItem.key] = val.name
      if (this.currentItem.key === 'important_level' || this.currentItem.key === 'state' || this.currentItem.key === 'sales_stage') {
        for (let i = 0; i < this.followData.customerCustomFields.length; i++) {
          if (this.followData.customerCustomFields[i].key === this.currentItem.key) {
            this.followData.customerCustomFields[i].value = val.name
            break
          }
        }
      } else {
        for (let i = 0; i < this.followData.customFields.length; i++) {
          if (this.followData.customFields[i].key === this.currentItem.key) {
            this.followData.customFields[i].value = val.name
            break
          }
        }
      }
      this.setFieldId(this.currentItem.key)
    },
    // 多选控件
    openMultiplePicker(item) {
      this.currentItem = item
      this.showMultiplePicker = true
      this.multipleOptions = []
      this.multipleResult = []
      item.options.forEach(option => {
        this.multipleOptions.push(option.label)
      })
      if (this.formList[this.currentItem.key]) {
        this.multipleResult = this.formList[this.currentItem.key].split(',')
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
      for (let i = 0; i < this.followData.customFields.length; i++) {
        if (this.followData.customFields[i].key === this.currentItem.key) {
          this.followData.customFields[i].value = this.multipleResult.join(',')
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
      } else {
        this.defaultDate = new Date()
      }
    },
    confirmSelfDate(time) {
      this.closePicker()
      let type = null
      if (this.currentItem.key === 'follow_time' || this.currentItem.key === 'next_follow_time') {
        type = 'time'
      }
      this.formList[this.currentItem.key] = this.formatTime(time, type)
      for (let i = 0; i < this.followData.customFields.length; i++) {
        if (this.followData.customFields[i].key === this.currentItem.key) {
          this.followData.customFields[i].value = this.formatTime(time, type)
          break
        }
      }
      this.setFieldId(this.currentItem.key)
    },
    // 上传跟进的图片
    afterRead() {
      this.setFieldId('follow_img')
    },
    // 删除图片
    deleteImg() {
      if (!this.formList.follow_img.length) {
        this.removeFieId('follow_img')
      }
    }
  }
}
</script>

<style lang="scss">

    .followEditForm {
        padding-top: 75px;
        background-color: $white;

        .textareaBox {
            span {
                font-size: 15px;
                color: $text-2;

                &.count {
                    font-size: 12px;
                    color: $text-9;
                }
            }

            .textarea {
                width: 100%;
                height: 50px;
                resize: none;
            }
        }

        .van-cell {
            padding: 20px 16px;

            &.markCell {
                padding: 20px 16px 12px;
            }

            &::after {
                left: 16px !important;
                right: 16px !important;
            }

            .van-cell {
                padding: 0;

                &::after {
                    border: none;
                }
            }
        }

        .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
            border: none;
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
