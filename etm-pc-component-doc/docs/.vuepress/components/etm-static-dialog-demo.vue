<template>
  <div class="etm-pop-demo-wrap">
    <high-code :code="code" :description="description">
      <el-button  @click="open">无蒙版弹窗</el-button>
      <etm-static-dialog
      :visible.sync="showPop"
      :target="target"
     >
        <etm-layout-split>
          <el-input   placeholder="这是无蒙版弹窗"></el-input>
        </etm-layout-split>
     </etm-static-dialog>
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
      showPop:false,
      target:{},
      attrTableData: [
        {
          param: 'visible',
          description: '控制弹窗弹出关闭的布尔变量，为true时弹出，为false时关闭',
          type: 'Boolean',
          option: 'true, false',
          default: 'false'
        },
        {
          param: 'target',
          description: '控制弹出框的位置,把自己的event传到弹窗上',
          type: 'Event',
          option: '',
          default: '{}'
        },
      ],
      eventTableData:[

      ],
      code:
          `     <el-button  @click="open">无蒙版弹窗</el-button>
      <etm-static-dialog
      :visible.sync="showPop"
      :target="target"
     >
        <el-button>这是无蒙版弹窗</el-button>
     </etm-static-dialog>
        export default {
          data() {
            return {
               showPop:false,
                target:{},
            }
          },
          methods:{
              open(e){
               this.showPop=true
               this.target=e
            }
          }
        }
      `,
      description: '构造一个无蒙版弹窗',
    }
  },
  computed:{
  },
  methods:{
    open(e){
      this.showPop=true
      this.target=e
    }
  }
}
</script>

<style scoped lang="scss">
.etm-pop-demo-wrap {

}
</style>
