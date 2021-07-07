<template>
  <div class="more">
    <etm-form :model="formData">
      <el-form-item label="业绩所属人:">
        <div class="addBox">
          <el-select
            v-model="formData.owner"
            filterable
            placeholder="输入关键字搜索"
          >
            <el-option
              v-for="(adviser, i) in adviserList"
              :key="i"
              :value="adviser.id"
              :label="adviser.name"
            />
          </el-select>
          <div class="add">
            <span class="iconfont iconplus" @click="addOwner" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="业绩所属人占比（%）:">
        <el-input-number
          v-model="formData.ownerPerformance"
          controls-position="right"
          :min="0"
          :max="100"
          placeholder="请输入占比"
          @change="checkPercent('main')"
        />
      </el-form-item>
      <div v-for="(owner, index) in formData.otherOwner" :key="index">
        <el-form-item label="次业绩所属人:">
          <div class="addBox">
            <el-select
              v-model="owner.id"
              filterable
              placeholder="输入关键字搜索"
            >
              <el-option
                v-for="(adviser, i) in adviserList"
                :key="i"
                :value="adviser.id"
                :label="adviser.name"
              />
            </el-select>
            <div class="add">
              <span class="iconfont iconminus" @click="removeOwner(index)" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="业绩所属人占比（%）:">
          <el-input-number
            v-model="owner.performance"
            controls-position="right"
            :min="0"
            :max="100"
            placeholder="请输入占比"
            @change="checkPercent('secondary', index)"
          />
        </el-form-item>
      </div>
      <el-form-item label="上传图片:">
        <etm-upload-img
          resource-name="memberManageV2/more"
          :preview-src-list="formData.previewSrcLists"
          :preview-src-key="formData.previewSrcKey"
          :text="''"
          @getImgList="getImgList"
        />
      </el-form-item>
      <el-form-item label="备注:">
        <el-input
          v-model="formData.remark"
          placeholder="请输入备注内容"
          type="textarea"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>
<script>
import EtmUploadImg from '@/components/EtmUploadImg/index'
import { getAllEmployee } from '@/api/sacc/enrollmentManage'

export default {
  components: {
    EtmUploadImg
  },
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      adviserList: [],
      percent: 0
    }
  },
  mounted() {
    this.getEmployee()
  },
  methods: {
    getEmployee() {
      const organizationId = localStorage.getItem('currentOrganizationId')
      const param = {
        organizationId: organizationId,
        paged: false
      }
      getAllEmployee(param).then(res => {
        this.adviserList = res.data.content
      })
    },
    checkPercent(type, index) {
      let percent = 0
      percent += this.formData.ownerPerformance
      this.formData.otherOwner.forEach(item => {
        percent += item.performance
      })
      if (percent > 100) {
        if (type === 'secondary') {
          this.percent = percent - this.formData.ownerPerformance
          this.$nextTick(() => {
            this.formData.otherOwner[index].performance = 0
            const item = this.formData.otherOwner[index]
            this.formData.otherOwner.splice(index, 1, item)
          })
        } else if (type === 'main') {
          this.percent = percent - this.formData.ownerPerformance
          this.$nextTick(() => {
            this.formData.ownerPerformance = 0
          })
        }
        this.$message.warning('业绩占比总数不能超过100%')
      } else {
        this.percent = percent
      }
    },
    addOwner() {
      if (this.percent < 100) {
        const owner = {
          id: '',
          performance: ''
        }
        this.formData.otherOwner.push(owner)
      } else {
        this.$message.warning('业绩占比总数已达100%')
      }
    },
    removeOwner(index) {
      this.formData.otherOwner.splice(index, 1)
      this.checkPercent()
    },
    // 获取上传图片列表
    getImgList(val, key) {
      this.formData.previewSrcLists = val
      this.formData.previewSrcKey = key
    }
  }
}
</script>

<style scoped lang="scss">
  .more {
    min-width: 900px;

    & > > > .el-form {
      max-width: 80% !important;
    }

    & > > > .charger {
      .el-input, .el-select {
        width: 272px !important;
      }

      .el-select {
        margin-right: 10px;
      }
    }

    & > > > .el-textarea {
      width: 560px !important;
      textarea{
        resize: none;
      }
    }

    .addBox {
      position: relative;

      .add {
        position: absolute;
        top: 0;
        right: -32px;

        .iconfont {
          @include c_main_color();
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    .el-select {
      width: 100%;
    }
  }
</style>
