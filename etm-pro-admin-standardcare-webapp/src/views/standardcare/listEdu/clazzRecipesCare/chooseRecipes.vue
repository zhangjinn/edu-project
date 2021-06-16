<template>
  <div class="chooseRecipes">
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
          v-model="chooseRecipesCurrentValue"
          :options="chooseRecipesOptions"
        />
      </div>
      <div slot="right">
        <EtmWeeklyCalendar
          v-if="chooseRecipesCurrentValue"
          ref="xlsxTable"
          :table-data="tableData"
          :add="false"
          :week-tag="false"
          :title-time="false"
        >
          <template slot="toolLeft">
            <div class="tooLeft">
              <p>
                <span
                  v-if="recipesName"
                  class="recipesName"
                >{{ recipesName }}</span>
                <el-tag
                  v-for="(tag,index) in tags"
                  :key="index"
                >
                  {{ tag }}
                </el-tag>
              </p>
              <p
                v-if="remarks"
                class="remarks"
              >
                {{ remarks }}
              </p>
            </div>
          </template>
          <template v-slot:cell="data">
            <!--            <div v-if="!data.cellList" class="nonSchoolDay">休</div>-->
            <div
              v-for="(item,index) in data.cellList"
              :key="index"
              class="list-group-item"
            >
              <cellList
                type="chooseRecipes"
                :data="item"
                :show-ingredients="checked"
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
  queryRecipesList,
  queryGridRecipe
} from '@/api/standardcare/listFeatures/recipesManage'
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  name: 'ChooseRecipes',
  components: {
    EtmWeeklyCalendar,
    cellList,
    chooseTabs
  },
  mixins: [baseMixin],
  data () {
    return {
      searchContent: '',
      recipesName: '',
      remarks: '',
      tags: [],
      chooseRecipesCurrentValue: null,
      chooseRecipesOptions: [],
      checked: true,
      tableData: {
        title: '时段',
        content: []
      }
    }
  },
  watch: {
    chooseRecipesCurrentValue: {
      handler (nVal) {
        this.chooseRecipesDetail(nVal)
      },
      immediate: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      queryRecipesList({
        name: this.searchContent,
        paged: false
      }).then((res) => {
        this.chooseRecipesOptions = this.convertDataToOptions(res.data.content, 'name', 'id')
        this.chooseRecipesCurrentValue = this.chooseRecipesOptions[0]
      })
    },
    chooseRecipesDetail (nVal) {
      console.log(nVal)
      if (!nVal) return
      this.recipesName = nVal.name
      this.remarks = nVal.remarks
      this.tags = nVal.labelNameList
      queryGridRecipe({
        recipesId: nVal.value
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
.chooseRecipes {
  ::v-deep.EtmLayoutSplit-wrap {
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

    .recipesName {
      margin-right: 8px;
    }

    .remarks {
      color: $info-color;
    }

    .el-tag {
      margin-right: 8px;
    }
  }
}
</style>
