<template>
  <div class="chooseSchedule">
    <etm-layout-split>
      <div slot="left">
        <el-input
          v-model="searchContent"
          placeholder="请输入搜索内容"
          @keyup.enter.native="handleSearch"
        >
          <span
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="handleSearch"
          />
        </el-input>

        <chooseTabs
          v-model="chooseScheduleCurrentValue"
          :options="chooseScheduleOptions"
        />
      </div>
      <div slot="right">
        <EtmWeeklyCalendar
          v-if="chooseScheduleCurrentValue"
          ref="xlsxTable"
          :table-data="tableData"
          :add="false"
          :week-tag="false"
          :title-time="false"
        >
          <template slot="toolLeft">
            <div class="tooLeft">
              <p v-if="scheduleName">
                {{ scheduleName }}
              </p>
            </div>
          </template>
          <template v-slot:cell="data">
            <div
              v-if="!data.cellList"
              class="nonSchoolDay"
            >
              休
            </div>
            <div v-else>
              <cellList
                type="chooseSchedule"
                :data="data.cellList"
              />
            </div>
          </template>
        </EtmWeeklyCalendar>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import EtmWeeklyCalendar from '@/components/EtmWeeklyCalendar'
import chooseTabs from '@/views/standardcare/listEdu/clazzRecipesCare/components/chooseTabs'
import cellList from './cellList'
import {
  queryWeekScheduleTemplate
} from '@/api/standardcare/clazzScheduleCare'
import {
  queryGridWeekScheduleTemplate
} from '@/api/standardcare/listFeatures/scheduleManage'
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  name: 'ChooseSchedule',
  components: {
    EtmWeeklyCalendar,
    cellList,
    chooseTabs
  },
  mixins: [baseMixin],
  data () {
    return {
      searchContent: '',
      scheduleName: '',
      chooseScheduleCurrentValue: null,
      chooseScheduleOptions: [],
      tableData: {
        title: '时段',
        content: []
      }
    }
  },
  watch: {
    chooseScheduleCurrentValue: {
      handler (nVal) {
        this.chooseRecipeDetail(nVal)
      },
      immediate: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      queryWeekScheduleTemplate({
        name: this.searchContent
      }).then((res) => {
        this.chooseScheduleOptions = this.convertDataToOptions(res.data, 'name', 'id')
        this.chooseScheduleCurrentValue = this.chooseScheduleOptions[0]
      })
    },
    chooseRecipeDetail (nVal) {
      if (!nVal) return
      this.scheduleName = nVal.name
      queryGridWeekScheduleTemplate({
        weekScheduleTemplateId: nVal.value
      }).then((res) => {
        this.tableData.content = res.data
      })
    },
    handleSearch () {
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
  .chooseSchedule {
    ::v-deep .EtmLayoutSplit-wrap {
      .layout-left {
        border-radius: 0;
        border-right: 1px solid $divide-color;
        margin-right: 0;
        padding-left: 0;
        padding-top: 0;
      }

      .layout-right {
        border-radius: 0;
        padding-right: 0;
        padding-top: 0;
      }
    }
  }
</style>
