<template>
  <div>
    <etm-form
      ref="form"
      :model="form"
      type="dialog"
    >
      <el-form-item
        label="上传封面"
      >
        <etm-upload-img
          :resource-name="'standardcare/scheduleManage'"
          :preview-src-list="form.previewSrcLists"
          :preview-src-key="form.previewSrcKey"
          :limit-number="1"
          @getImgList="getImgList"
        />
      </el-form-item>
      <el-form-item
        label="日程名称"
        prop="name"
        :rules="formValidate.nullValueRule(true,'请输入日程名称')"
      >
        <el-input
          v-model="form.name"
          maxlength="10"
          placeholder="请输入日程名称"
        />
      </el-form-item>
      <el-form-item
        class="tagBox"
        label="标签"
      >
        <el-select
          v-model="form.tags"
          multiple
          placeholder="请选择标签"
        >
          <el-option
            v-for="item in tagsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <i
          class="tag-icon el-icon-setting"
          @click="popVisible = true"
        />
      </el-form-item>

      <el-form-item
        label="备注"
      >
        <el-input
          v-model="form.remarks"
          maxlength="20"
          placeholder="请输入备注"
        />
      </el-form-item>
      <el-form-item
        label="设置颜色"
      >
        <etm-color v-model="form.color" />
      </el-form-item>
    </etm-form>

    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="标签设置"
      confirm-btn="确定"
      cancel-btn="取消"
      append-to-body
      @close="popConfirm"
      @cancel="popConfirm"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <tags v-if="popVisible" />
      </div>
    </etm-pop>
  </div>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import etmUploadImg from '@/components/EtmUploadImg/index'
import tags from '@/views/standardcare/settings/scheduleManageSetting/tabsItem/tags'

import {
  queryLabelList,
  queryWeekScheduleTemplateDetail
} from '@/api/standardcare/listFeatures/scheduleManage'
import etmColor from '@/components/etmColor'
import { getImgUrlRelativePath } from '@/utils'
export default {
  name: 'Edit',
  components: {
    etmUploadImg,
    etmColor,
    tags
  },
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add',
      validator (val) {
        return ['add', 'edit'].includes(val)
      }
    },
    itemId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      popVisible: false,
      formValidate,
      form: {
        name: '',
        tags: [],
        remarks: '',
        color: '',
        previewSrcLists: [],
        previewSrcKey: []
      },
      tagsOptions: []

    }
  },
  created () {
    this.queryLabelOptions()
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {
    getImgList (val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },
    // 标签列表
    queryLabelOptions () {
      queryLabelList().then(res => {
        if (res.data) {
          this.tagsOptions = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },
    init () {
      queryWeekScheduleTemplateDetail({
        weekScheduleTemplateId: this.itemId
      }).then((res) => {
        const { data } = res
        this.form = {
          name: data.name,
          tags: data.labelIdList,
          remarks: data.mark,
          color: data.bgcolor,
          previewSrcLists: [],
          previewSrcKey: []
        }
        if (data.coverUrl) {
          this.form.previewSrcLists.push(data.coverUrl)
          this.form.previewSrcKey.push(getImgUrlRelativePath(data.coverUrl))
        }
      })
    },
    // 设置修改之后实时刷新对应列表
    popConfirm () {
      this.queryLabelOptions()
      this.popVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.tagBox {
  position: relative;

  .tag-icon {
    color: $info-color;
    cursor: pointer;
    font-size: 24px;
    position: absolute;
    right: -30px;
    top: 4px;
  }
}
</style>
