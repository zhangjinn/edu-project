<template>
  <div class="medicine">
    <el-form v-for="(d, index) in medication.inUse" :key="index" label-width="300px">
      <el-form-item :label="$t('memberManage.medicineFormLabelDisease') + ':'">
        <div class="disease">
          <el-input v-model="d.disease" style="width: 176px;" :placeholder="$t('memberManage.medicineFormDiseasePlaceHolderText')" />
          <span :class="index === 0 ? '' : 'delete'" @click.stop="handleDisease(index)">
            <i :class="index === 0 ? 'el-icon-plus' : 'el-icon-minus'" />
            {{ index === 0 ? $t('memberManage.medicineFormAddDisease') : $t('memberManage.medicineFormDeleteDisease') }}
          </span>
        </div>
      </el-form-item>
      <el-form-item class="inner">
        <el-form v-for="(m, i) in d.medicine" :key="i" class="innerForm">
          <el-form-item :label="$t('memberManage.medicineFormLabelName') + ':'">
            <el-input v-model="m.name" style="width: 560px;" :placeholder="$t('memberManage.medicineFormNamePlaceHolderText')" />
          </el-form-item>
          <el-form-item :label="$t('memberManage.medicineFormLabelUsage') + ':'">
            <el-input v-model="m.usage" style="width: 560px;" :placeholder="$t('memberManage.medicineFormUsagePlaceHolderText')" />
          </el-form-item>
          <el-form-item :label="$t('memberManage.medicineFormLabelRemark') + ':'">
            <div class="remark">
              <el-input v-model="m.description" style="width: 560px;" :placeholder="$t('memberManage.medicineFormRemarkPlaceHolderText')" type="textarea" />
              <br>
              <span :class="i === 0 ? '' : 'delete'" @click.stop="handleMedicine(i, index)">
                <i :class="i === 0 ? 'el-icon-plus' : 'el-icon-minus'" />
                {{ i === 0 ? $t('memberManage.medicineFormAddMedicineBtnText') : $t('memberManage.medicineFormDeleteMedicineBtnText') }}
              </span>
            </div>
          </el-form-item>
        </el-form>
      </el-form-item>
      <div class="border" />
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    modify: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      medication: {
        inUse: [{
          disease: '',
          medicine: [
            {
              name: '',
              usage: '',
              description: ''
            }
          ]
        }]
      }
    }
  },
  watch: {
    medication: {
      handler(v) {
        if (v.inUse.length === 1) {
          const item = v.inUse[0]
          if (!item.disease) {
            if (item.medicine.length === 1) {
              const medicine = item.medicine[0]
              if (!medicine.name && !medicine.usage && !medicine.description) {
                this.$store.commit('memberManageV2/SET_MEDICINE', true)
                return
              } else {
                this.$store.commit('memberManageV2/SET_MEDICINE', false)
                return
              }
            } else {
              this.$store.commit('memberManageV2/SET_MEDICINE', false)
              return
            }
          } else {
            const lastMedicine = item.medicine[item.medicine.length - 1]
            if (lastMedicine.name && lastMedicine.usage && lastMedicine.description) {
              this.$store.commit('memberManageV2/SET_MEDICINE', true)
              return
            } else {
              this.$store.commit('memberManageV2/SET_MEDICINE', false)
              return
            }
          }
        } else {
          for (let i = 0; i < v.inUse.length; i++) {
            const item = v.inUse[i]
            if (item.disease) {
              const medicine = item.medicine
              for (let j = 0; j < medicine.length; j++) {
                const mitem = medicine[j]
                if (mitem.name && mitem.usage && mitem.description) {
                  continue
                } else {
                  this.$store.commit('memberManageV2/SET_MEDICINE', false)
                  return
                }
              }
            } else {
              this.$store.commit('memberManageV2/SET_MEDICINE', false)
              return
            }
          }
          this.$store.commit('memberManageV2/SET_MEDICINE', true)
          return
          // const lastDisease = v.inUse[v.inUse.length - 1]
          // if (!lastDisease.disease) {
          //   this.$store.commit('memberManage/SET_MEDICINE', false)
          //   return
          // }
          // const lastMedicine = lastDisease.medicine[lastDisease.medicine.length - 1]
          // if (lastMedicine.name && lastMedicine.usage && lastMedicine.description) {
          //   this.$store.commit('memberManage/SET_MEDICINE', true)
          //   return
          // } else {
          //   this.$store.commit('memberManage/SET_MEDICINE', false)
          //   return
          // }
        }
      },
      deep: true
    },
    modify: {
      handler(v) {
        if (this.$store.state.memberManageV2.method === 'modify') {
          if (Array.isArray(v.inUse) && v.inUse.length) {
            this.medication = {
              inUse: v.inUse
            }
          } else {
            this.medication = {
              inUse: [{
                disease: '',
                medicine: [
                  {
                    name: '',
                    usage: '',
                    description: ''
                  }
                ]
              }]
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleMedicine(i, index) {
      const medicine = this.medication.inUse[index].medicine
      if (i) {
        medicine.splice(i, 1)
      } else {
        const lastOne = medicine[medicine.length - 1]
        if (lastOne.name && lastOne.usage && lastOne.description) {
          medicine.push(
            {
              name: '',
              usage: '',
              description: ''
            }
          )
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('memberManage.completeMedicineInfoTip')
          })
        }
      }
    },
    handleDisease(i) {
      const inUse = this.medication.inUse
      if (i) {
        inUse.splice(i, 1)
      } else {
        const lastOne = inUse[inUse.length - 1]
        if (lastOne.disease) {
          inUse.push({
            disease: '',
            medicine: [
              {
                name: '',
                usage: '',
                description: ''
              }
            ]
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('memberManage.completeDiseaseNameTip')
          })
        }
      }
    },
    validate() {
      const inUse = this.medication.inUse
      // 用户无操作，初始的默认状态下可以通过验证
      if (inUse.length === 1 && inUse[0].disease === '' && inUse[0].medicine.length === 1 && inUse[0].medicine[0].name === '' && inUse[0].medicine[0].usage === '' && inUse[0].medicine[0].description === '') {
        return true
      }

      // 用户有操作，需要验证其输入内容
      for (let i = 0; i < inUse.length; i++) {
        if (inUse[i].disease) {
          for (let j = 0; j < inUse[i].medicine.length; j++) {
            const medicine = inUse[i].medicine[j]
            if (medicine.name && medicine.usage && medicine.description) {
              continue
            } else {
              return false
            }
          }
        } else {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped lang="scss">
.medicine {
  height: calc(100vh - 234px);
  overflow-y: auto;
  .el-form:first-of-type {
    padding-top: 0;
  }
  & >>> .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  & >>> .el-form-item {
    margin-bottom: 24px;
  }
  .disease {
    span {
      cursor: pointer;
      margin-left: 304px;
      font-size: 14px;
      @include c_main_color();
      &.delete {
        @include c_secondary_color();
      }
    }
  }
  .remark {
    span {
      cursor: pointer;
      margin-left: 544px;
      font-size: 14px;
      @include c_main_color();
      &.delete {
        @include c_secondary_color();
      }
    }
  }
  .inner {
    & >>> .el-form-item__content {
      margin-left: 228px!important;
    }
  }
  .innerForm {
    border-bottom: transparent!important;
    padding-top: 0!important;
    & >>> .el-form-item__content {
      margin-left: 0!important;
    }
    & >>> .el-form-item {
      margin-bottom: 10px;
    }
  }
  & >>> .el-form {
    // border-bottom: 1px solid;
    @include bc_divide_color();
    padding-top: 24px;
  }
  .border {
    width: 640px;
    @include bgc_divide_color();
    // margin: 0 auto;
    margin-left: 242px;
    transform: translateX(-15px);
    height: 1px;
  }
  & >>> .el-textarea__inner {
    padding: 5px 10px;
  }
}
</style>
