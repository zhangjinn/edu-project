<template>
  <div class="etm-pop-demo-wrap">
    <high-code :code="code" :description="description">
    <el-button @click.stop="showSide = true">打开小抽屉弹窗</el-button>
    <el-button @click.stop="showSide2 = true">打开大抽屉弹窗</el-button>
    <etm-drawer
      :visible.sync="showSide"
      :type="type"
    >
      <etm-layout-split>
        <el-card class="box-card">
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </etm-layout-split>
    </etm-drawer>
    <etm-drawer
        :visible.sync="showSide2"
        :type="type2"
    >
      <etm-layout-split>
        <el-card class="box-card">
          <div v-for="o in 8" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </etm-layout-split>
    </etm-drawer>
    </high-code>
    <params-table :table-data="attrTableData"/>
  </div>
</template>
<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";
export default {
  name: 'etm-drawer-demo',
  components: {HighCode, ParamsTable},
  data() {
    return {
      showSide:false,
      showSide2:false,
      value: '',
      type: 'small',
      type2: 'big',
      attrTableData: [
        {
          param: 'visible',
          description: '控制弹窗弹出关闭的布尔变量，为true时弹出，为false时关闭',
          type: 'Boolean',
          option: 'true, false',
          default: 'false'
        },
        {
          param: 'type',
          description: '控制抽屉弹窗弹大小，big时为大抽屉，small为小抽屉',
          type: 'String',
          option: 'big, small',
          default: 'small'
        },
        {
          param: 'before-close',
          description: '窗口关闭前的回调函数',
          type: 'Function',
          option: '函数',
          default: '-'
        },
        ],
      eventTableData:[

      ],
      code: `
    <el-button @click.stop="showSide = true">打开小抽屉弹窗</el-button>
    <el-button @click.stop="showSide2 = true">打开大抽屉弹窗</el-button>
    <etm-drawer
      :visible.sync="showSide"
      :type="type"
    />
    <etm-drawer
        :visible.sync="showSide2"
        :type="type2"
    />
        export default {
          data() {
            return {
              showSide:false,
              showSide2:false,
              type: 'small',
              type2: 'big',
            }
          }
        }
      `,
      description: '构造一个抽屉弹窗',
    }
  },
  computed:{
  },
  methods:{
  }
}
</script>

<style scoped lang="scss">
.etm-pop-demo-wrap {

}
</style>
