<template>
  <div class="detail">
    <etm-layout-split :left-styles="{minWidth:'400px'}">
      <div slot="left">
        <memberInfo :content="memberData" :name="memberName" />
      </div>
      <div slot="right">
        <memberDetail :content="memberData" :member-id="memberId" :name="memberName" />
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import memberInfo from './info'
import memberDetail from './detail'
import { getMemberDetail } from '@/api/neuroo/memberManage'
import transferDate from '@/utils/date'
export default {
  components: {
    memberInfo,
    memberDetail
  },
  data() {
    return {
      memberData: null,
      memberName: ''
    }
  },
  computed: {
    memberId() {
      return localStorage.getItem('memberManage_neuroo_currentId')
    }
  },
  created() {
    getMemberDetail(this.memberId).then(res => {
      const { data } = res
      data.customerInfo.birthday = data.customerInfo.birthday ? transferDate(data.customerInfo.birthday).time : '-'
      data.customerInfo.enterSchoolTime = data.customerInfo.enterSchoolTime ? transferDate(data.customerInfo.enterSchoolTime).time : '-'
      this.memberData = data
      this.memberName = data.customerInfo.name
      localStorage.setItem('memberManage_neuroo_schoolId', data.customerInfo.schoolId)
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style scoped lang="scss">
.detail {
  /*display: flex;*/
  //@include bgc_bg_color();
  /*height: calc(100vh - 150px);*/
}
</style>
