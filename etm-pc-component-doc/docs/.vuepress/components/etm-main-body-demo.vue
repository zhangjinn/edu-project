<template>
  <div class="etm-main-body-demo-wrap">
    <high-code :code="code" :description="description">
      <p>不需要面包屑的情况:</p>
      <etm-main-body>
        这里是主体区域内容
      </etm-main-body>
      <hr>
      <p>单方向的面包屑情况: (一级页面A -> 二级页面A -> 三级页面A)</p>
      <etm-main-body
        :bread="true"
        :bread-data="singleBreadData"
      />
      <hr>
      <p>多方向的面包屑情况:(一级页面B -> 二级页面B 和 一级页面B -> 二级页面C)</p>
      <etm-main-body
        :bread="true"
        :bread-data="multiBreadData"
      />
    </high-code>
    <params-table :table-data="attrTableData"/>
  </div>  
</template>
<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";
import OneA from './demo/EtmMainBody/example/oneA'
import TwoA from './demo/EtmMainBody/example/twoA'
import ThreeA from './demo/EtmMainBody/example/threeA'
import OneB from './demo/EtmMainBody/example/oneB'
import TwoB from './demo/EtmMainBody/example/twoB'
import TwoC from './demo/EtmMainBody/example/twoC'
export default {
  name: 'etm-main-body-demo',
  components: {HighCode, ParamsTable},
  data() {
    return {
      code: `
      <template>
        <div>
          <p>不需要面包屑的情况:</p>
          <etm-main-body>
            这里是主体区域内容
          </etm-main-body>
          <hr>
          <p>单方向的面包屑情况: (一级页面A -> 二级页面A -> 三级页面A)</p>
          <etm-main-body
            :bread="true"
            :bread-data="singleBreadData"
          />
          <hr>
          <p>多方向的面包屑情况:(一级页面B -> 二级页面B 和 一级页面B -> 二级页面C)</p>
          <etm-main-body
            :bread="true"
            :bread-data="multiBreadData"
          />
        </div>
      </template>
      <script>
        import OneA from './demo/EtmMainBody/example/oneA'
        import TwoA from './demo/EtmMainBody/example/twoA'
        import ThreeA from './demo/EtmMainBody/example/threeA'
        import OneB from './demo/EtmMainBody/example/oneB'
        import TwoB from './demo/EtmMainBody/example/twoB'
        import TwoC from './demo/EtmMainBody/example/twoC'
        export default {
          data() {
            return {
              singleBreadData: [
                {
                  name: '一级页面A',
                  route: 'OneA',
                  view: OneA
                },
                {
                  name: '二级页面A',
                  route: 'TwoA',
                  view: TwoA
                },
                {
                  name: '三级页面A',
                  route: 'ThreeA',
                  view: ThreeA
                }
              ],
              multiBreadData: [
                [
                  { name: '一级页面B', route: 'OneB', view: OneB },
                  { name: '二级页面B', route: 'TwoB', view: TwoB }
                ],
                [
                  { name: '一级页面B', route: 'OneB', view: OneB },
                  { name: '二级页面C', route: 'TwoC', view: TwoC }
                ]
              ]
            }
          }
        }

      oneA.vue:
      <template>
        <div>
          <p>这里是一级页面A</p>
          <button @click.stop="$emit('switch', 'TwoA')">进入二级页面A</button>
        </div>
      </template>
      
      twoA.vue:
      <template>
        <div>
          <p>这里是二级页面A</p>
          <button @click.stop="$emit('switch', 'ThreeA')">进入三级页面A</button>
        </div>
      </template>

      threeA.vue:
      <template>
        <div>
          <p>这里是三级页面A</p>
        </div>
      </template>

      oneB.vue:
      <template>
        <div>
          <p>这里是一级页面B</p>
          <button @click.stop="$emit('switch', { target: 'TwoB', index: 0 })">进入二级页面B</button>
          <button @click.stop="$emit('switch', { target: 'TwoC', index: 1 })">进入二级页面C</button>
        </div>
      </template>

      twoB.vue:
      <template>
        <div>
          <p>这里是二级页面B</p>
        </div>
      </template>

      twoC.vue:
      <template>
        <div>
          <p>这里是二级页面C</p>
        </div>
      </template>
      `,
      description: '根据传值，可以实现两种状态：带/不带面包屑的主体内容区域。该面包屑导航页面的时候不会导致url改变。主题内容区域会自适应高度，使其和周围取得一个固定的margin值，使用者只需要专注于区域内的布局即可',
      attrTableData: [
        {
          param: 'bread',
          description: '是否启用面包屑',
          type: 'Boolean',
          option: 'true, false',
          default: 'false'
        },
        {
          param: 'bread-data',
          description: '面包屑导航的层级关系、展示页面对应的组件和标识名',
          type: 'Array',
          option: '-',
          default: '-'
        }
      ],
      singleBreadData: [
        {
          name: '一级页面A',
          route: 'OneA',
          view: OneA
        },
        {
          name: '二级页面A',
          route: 'TwoA',
          view: TwoA
        },
        {
          name: '三级页面A',
          route: 'ThreeA',
          view: ThreeA
        }
      ],
      multiBreadData: [
        [
          { name: '一级页面B', route: 'OneB', view: OneB },
          { name: '二级页面B', route: 'TwoB', view: TwoB }
        ],
        [
          { name: '一级页面B', route: 'OneB', view: OneB },
          { name: '二级页面C', route: 'TwoC', view: TwoC }
        ]
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.etm-main-body-demo-wrap {

}
</style>