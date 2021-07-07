<template>
  <div class="edit-wrap">
    <etm-form ref="form" type="dialog" :model="data">
      <el-form-item label="教室名称" prop="roomName" :rules="formValidate.nullValueRule(true, '教室名称')">
        <el-input v-model="data.roomName" placeholder="请输入教室名称" @blur="change" />
      </el-form-item>

      <el-form-item label="备注" prop="remarks">
        <el-input v-model="data.remarks" placeholder="最多20个字" maxlength="20" show-word-limit @blur="change" />
      </el-form-item>
      <el-form-item label="教室详情" prop="details">
        <el-input
          v-model="data.details"
          type="textarea"
          :rows="4"
          placeholder="请输入教室详情"
          maxlength="200"
          show-word-limit
          @blur="change"
        />
      </el-form-item>
      <el-form-item label="上传展示图片">
        <etm-upload-image
          :resource-name="'classes'"
          :preview-src-list="data.imageList"
          :preview-src-key="data.previewSrcKey"
          @getImgList="getImgList"
        />
      </el-form-item>
      <el-form-item label="是否开启">
        <el-switch v-model="data.enable" />
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>
/**
 * edit create by Administrator
 * createTime 2020/8/31 10:35
 */
import formValidate from '@/utils/rules'
import EtmUploadImage from '@/components/EtmUploadImg/index'
import { deepClone } from '@/views/newDaycare/contract/common'

export default {
  name: 'Edit',
  components: { EtmUploadImage },
  filters: {},
  mixins: [],
  model: {
    prop: 'data',
    event: 'evt'
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formValidate,
      cacheData: {}
    }
  },
  computed: {},
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(n, o) {
        if (!Object.keys(this.cacheData).length) {
          this.cacheData = deepClone(n)
        }
      }
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    change() {
      this.$emit('evt', this.data)
    },
    rollback() {
      return this.cacheData
    },
    updateCache() {
      this.$set(this, 'cacheData', {})
    },
    getImgList(val, key) {
      console.log(key)
      const resultImg = key.map(cur => {
        return {
          name: cur,
          url: cur
        }
      })

      this.data.resultImg = resultImg
      this.data.imageList = val
      this.data.previewSrcKey = key

      this.change()
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-wrap {

}
</style>
