<template>
  <div>
    <etm-form
      ref="form"
      :model="form"
      type="dialog"
    >
      <el-form-item
        class="coverBox"
        label="上传封面"
      >
        <etm-upload-img
          :resource-name="'standardcare/recipesManage'"
          :preview-src-list="form.previewSrcLists"
          :preview-src-key="form.previewSrcKey"
          :limit-number="1"
          @getImgList="getImgList"
        />
      </el-form-item>

      <el-form-item
        label="食谱名称"
        prop="name"
        :rules="formValidate.nullValueRule(true,'请输入食谱名称')"
      >
        <el-input
          v-model="form.name"
          maxlength="10"
          placeholder="请输入食谱名称"
        />
      </el-form-item>

      <el-form-item
        class="tagBox"
        label="适用范围"
      >
        <el-select
          v-model="form.range"
          placeholder="请选择适用范围"
        >
          <el-option
            v-for="item in rangeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <i
          class="tag-icon el-icon-setting"
          @click="settingPop('range','适用范围设置')"
        />
      </el-form-item>

      <el-form-item
        class="tagBox"
        label="餐次选择"
        prop="meals"
        :rules="formValidate.nullValueRule(true,'请选择餐次')"
      >
        <el-select
          v-model="form.meals"
          placeholder="请选择餐次"
        >
          <el-option
            v-for="item in mealsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <i
          class="tag-icon el-icon-setting"
          @click="settingPop('meals','餐次设置')"
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
          @click="settingPop('tags','标签设置')"
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
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      append-to-body
      @close="popConfirm"
      @cancel="popConfirm"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <range v-if="popVisible && settingType === 'range'" />
        <meals v-if="popVisible && settingType === 'meals'" />
        <tags v-if="popVisible && settingType === 'tags'" />
      </div>
    </etm-pop>
  </div>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import etmUploadImg from '@/components/EtmUploadImg/index'
import meals from '@/views/standardcare/settings/recipesManageSetting/tabsItem/meals'
import range from '@/views/standardcare/settings/recipesManageSetting/tabsItem/range'
import tags from '@/views/standardcare/settings/recipesManageSetting/tabsItem/tags'
import etmColor from '@/components/etmColor'
import {
  queryLabelList,
  queryRecipesDetail,
  queryScopeList,
  queryTimeQuantumGroupList
} from '@/api/standardcare/listFeatures/recipesManage'
import { getImgUrlRelativePath } from '@/utils'
export default {
  name: 'EditClass',
  components: {
    etmUploadImg,
    etmColor,
    meals,
    range,
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
      popTitle: '',
      settingType: '',
      form: {
        name: '',
        range: '',
        meals: '',
        tags: [],
        remarks: '',
        color: '',
        previewSrcLists: [],
        previewSrcKey: []
      },
      rangeOptions: [],
      mealsOptions: [],
      tagsOptions: []

    }
  },
  created () {
    this.queryScopeOptions()
    this.queryLabelOptions()
    this.queryMealsOptions()
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {
    init () {
      queryRecipesDetail({
        recipesId: this.itemId
      }).then((res) => {
        const { data } = res

        this.form = {
          name: data.name,
          range: data.scopeId,
          meals: data.timeQuantumGroupId,
          tags: data.labelIdList,
          remarks: data.remarks,
          color: data.color,
          previewSrcLists: [],
          previewSrcKey: []
        }
        if (data.cover) {
          this.form.previewSrcLists.push(data.cover)
          this.form.previewSrcKey.push(getImgUrlRelativePath(data.cover))
        }
      })
    },
    getImgList (val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },
    settingPop (type, popTitle) {
      this.settingType = type
      this.popTitle = popTitle
      this.popVisible = true
    },
    // 适用范围列表
    queryScopeOptions () {
      queryScopeList().then(res => {
        if (res.data) {
          this.rangeOptions = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },
    // 标签列表
    queryLabelOptions () {
      queryLabelList().then(res => {
        if (res.data) {
          this.tagsOptions = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },
    // 餐次列表
    queryMealsOptions () {
      queryTimeQuantumGroupList().then(res => {
        if (res.data) {
          this.mealsOptions = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },

    popConfirm () {
      if (!this.popVisible) return
      if (this.settingType === 'range') {
        this.queryScopeOptions()
      } else if (this.settingType === 'meals') {
        this.queryMealsOptions()
      } else {
        this.queryLabelOptions()
      }
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

.coverBox {
  margin-top: 10px;
}
</style>
