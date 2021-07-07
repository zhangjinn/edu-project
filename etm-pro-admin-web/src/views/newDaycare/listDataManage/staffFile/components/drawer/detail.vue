<template>
  <div class="detail">
    <div class="left">
      <img v-if="employeeDetailData.avatar" :src="employeeDetailData.avatar" style="width: 130px;height: 130px;border-radius: 4px;">
      <img v-else src="@/assets/images/newDaycare/photo.png" style="width: 130px;height: 130px;border-radius: 4px;">
    </div>
    <div class="right">
      <!--基础信息栏-->
      <div class="basic">
        <etm-title :border="false" title="基础信息" />
        <div class="item">
          <div class="basic-item">
            <span>员工姓名：</span>
            <span>{{ employeeDetailData.employeeRecordName }}</span>
          </div>
          <div class="basic-item">
            <span>联系电话：</span>
            <span>{{ employeeDetailData.telephone }}</span>
          </div>
          <div class="basic-item">
            <span>入职时间：</span>
            <span>{{ employeeDetailData.entryTime | parseTime }}</span>
          </div>
          <div class="basic-item">
            <span>性别：</span>
            <span>{{ employeeDetailData.gender | genderFilter }}</span>
          </div>
          <div class="basic-item">
            <span>出生日期：</span>
            <span>{{ employeeDetailData.birthday | parseTime }}</span>
          </div>
        </div>
      </div>

      <!--个人信息-->
      <div class="basic add-margin">
        <etm-title :border="false" title="个人信息" />
        <div class="item">
          <div class="basic-item">
            <span>证件类型：</span>
            <span>{{ employeeDetailData.certificateType }}</span>
          </div>
          <div class="basic-item">
            <span>证件号码：</span>
            <span>{{ employeeDetailData.certificateNumber }}</span>
          </div>
          <div class="basic-item">
            <span>民族：</span>
            <span>{{ employeeDetailData.clan }}</span>
          </div>
          <div class="basic-item">
            <span>籍贯：</span>
            <span>{{ employeeDetailData.hometown }}</span>
          </div>
          <div class="basic-item">
            <span>婚姻状况：</span>
            <span>{{ employeeDetailData.marriage | marrigeStatusFilter }}</span>
          </div>
          <div class="basic-item">
            <span>户口类型：</span>
            <span>{{ employeeDetailData.hukouType | hukouTypeFilter }}</span>
          </div>
          <div class="basic-item">
            <span>户口所在地：</span>
            <span>{{ hukouName }}</span>
            <!--<etm-address v-model="employeeDetailData.areaCode" :area-id="employeeDetailData.areaCode" :disabled="true" />-->
          </div>
          <div class="basic-item">
            <span>家庭地址：</span>
            <span>{{ employeeDetailData.address }}</span>
          </div>
        </div>
      </div>

      <!--工作信息-->
      <div class="basic add-margin">
        <etm-title :border="false" title="工作信息" />
        <div class="item">
          <div class="basic-item">
            <span>职位：</span>
            <span>{{ employeeDetailData.positionId }}</span>
          </div>
          <div class="basic-item">
            <span>职称：</span>
            <span>{{ employeeDetailData.professionId }}</span>
          </div>
          <div class="basic-item">
            <span>职业证书：</span>
            <span>{{ employeeDetailData.vocationalCertificate }}</span>
          </div>
        </div>
      </div>

      <!--学历信息-->
      <div class="basic add-margin">
        <etm-title :border="false" title="学历信息" />
        <div class="item">
          <div class="basic-item">
            <span>学历：</span>
            <span>{{ employeeDetailData.education | educationTypeFilter }}</span>
          </div>
          <div class="basic-item">
            <span>毕业院校：</span>
            <span>{{ employeeDetailData.graduatedSchool }}</span>
          </div>
          <div class="basic-item">
            <span>专业：</span>
            <span>{{ employeeDetailData.profession }}</span>
          </div>
        </div>
      </div>

      <!--合同信息-->
      <div class="basic add-margin">
        <etm-title :border="false" title="合同信息" />
        <div class="item">
          <div class="basic-item">
            <span>合同类型：</span>
            <span>{{ employeeDetailData.contractType | contractTypeFilter }}</span>
          </div>
          <div class="basic-item">
            <span>合同起始日：</span>
            <span>{{ employeeDetailData.contractStartTime | parseTime }}</span>
          </div>
          <div class="basic-item">
            <span>合同终止日：</span>
            <span>{{ employeeDetailData.contractEndTime | parseTime }}</span>
          </div>
          <div class="basic-item">
            <span>签合同次数：</span>
            <span>{{ employeeDetailData.contractCount }}</span>
          </div>
          <div class="basic-item">
            <span>编制情况：</span>
            <span>{{ employeeDetailData.compilationStatus | compilationStatus }}</span>
          </div>
        </div>
      </div>

      <!--其他信息-->
      <div class="basic add-margin">
        <etm-title :border="false" title="其他信息" />
        <div class="item remark">
          <div class="basic-item">
            <span>备注：</span>
            <span>{{ employeeDetailData.remarks }}</span>
          </div>
          <div class="basic-item">
            <span>附件：</span>
            <!--<img v-if="employeeDetailData.annex" style="width: 120px;height: 120px" :src="employeeDetailData.annex">-->
            <div class="content">
              <div v-for="(item,index) in (employeeDetailData.annex || [])" :key="index" @click="download(item)"><etm-text>{{ item.name }}</etm-text></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * detail create by Administrator
 * createTime 2021/1/28 11:41
 */
import baseMixin from '@/layout/mixin/baseMixin'
import StaffMixin from '../../staffMixin'
import DownloadJs from 'downloadjs'
import { Loading } from 'element-ui-etm'
import axios from 'axios'
// import { getUploadFilePrefix } from '@/api/base'
// import EtmAddress from '@/views/base/org/EtmAddress'
import { queryAreaInfoByAreaId } from '@/api/base/base'

let uploadLoading
export default {
  name: 'Detail',
  components: {},
  filters: {},
  mixins: [baseMixin, StaffMixin],
  props: {
    employeeRecordId: {
      type: Number,
      default: () => {
        return undefined
      }
    },
    employeeDetailData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      hukouName: '暂无',
      prefix: '',
      downloadName: '附件.jpg'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      // this.prefix = await getUploadFilePrefix()
      // if (this.employeeDetailData.annex && this.employeeDetailData.annex.indexOf('http') === -1) {
      //   this.employeeDetailData.annex = this.prefix + this.employeeDetailData.annex
      // }
      if (this.employeeDetailData.areaCode) {
        queryAreaInfoByAreaId({ areaId: this.employeeDetailData.areaCode }).then(res => {
          console.log(res, 'res')
          if (res.data.provinceName === res.data.cityName) {
            this.hukouName = `${res.data.provinceName}${res.data.name}`
          } else {
            this.hukouName = `${res.data.provinceName}${res.data.cityName}${res.data.name}`
          }
        })
      }
    },
    download(file) {
      uploadLoading = Loading.service({
        fullscreen: true,
        lock: true,
        customClass: 'etm-loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.1)'
      })

      axios({
        url: file.url,
        responseType: 'blob'
      }).then(res => {
        DownloadJs(res.data, file.name)
        uploadLoading.close()
      }).catch(() => {
        this.$message.error('文件下载失败')
        uploadLoading.close()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .detail{
      display: flex;
      .right{
        width: 100%;
      }
      .basic{
        margin-left: 23px;
        display: flex;
        flex-direction: column;
        .item{
          display: flex;
          justify-content: start;
          flex-wrap: wrap;
        }
        .remark{
          display: flex;
          flex-direction: column;
          .basic-item{
            width: 100%;
            span:first-child{
              width: 75px;
            }
          }
        }
        .basic-item{
          width: 250px;
          margin-top: 10px;
          display: inline-flex;
          /*margin-right: 30px;*/
          span:last-child{
            display: inline-block;
          }
          .content{
            display: flex;
            flex-direction: column;
            .div{
              margin-bottom: 5px;
            }
          }
          /*flex-direction: column;*/
        }
      }
      .add-margin{
        margin-top: 30px;
      }

    }
</style>
