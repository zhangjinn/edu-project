<template>
  <div class="TablePage-wrap">
    <etm-layout-split>
      <etm-tool-bar v-model="formData" @search="search" />
      <etm-table-page :data="data" :columns="columns" @currentChange="currentChange">
        <etm-table-tool-bar slot="tool">
          <el-button>测试</el-button>
        </etm-table-tool-bar>
      </etm-table-page>

      <etm-table :data="data1" :columns="columns">
        <etm-table-tool-bar slot="tool">
          <el-button>测试</el-button>
        </etm-table-tool-bar>
      </etm-table>

    </etm-layout-split>
  </div>

</template>

<script>
/**
 * TablePage create by haijinsha
 * createTime 2020/9/2 16:10
 */
export default {
  name: 'TablePage',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      formData: [
        {
          label: '班级名称',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        }
      ],
      columns: [
        {
          label: '测试1',
          prop: 'test1',
          fixed: 'left'
        },
        {
          label: '测试2',
          prop: 'test2',
          fixed: 'left'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        }, {
          label: '测试3',
          prop: 'test3'
        }, {
          label: '测试3',
          prop: 'test3'
        }, {
          label: '测试3',
          prop: 'test3'
        }, {
          label: '测试3',
          prop: 'test3'
        }, {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试3',
          prop: 'test3'
        },
        {
          label: '测试4',
          prop: 'test4',
          fixed: 'right'
        }
      ],
      data: {
        totalElements: 2000,
        pageNum: 1,
        pageSize: 10,
        content: [
          {
            test1: '111',
            test2: '222',
            test3: '333',
            test4: '444'
          }
        ]
      },
      data1: [
        {
          test1: '111',
          test2: '222',
          test3: '333',
          test4: '444'
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    init() {
      console.log('init')
      // this.data.pageNum = this.pageInfo.pageNum
      alert('等待数据返回')
      setTimeout(() => {
        this.data.pageNum = this.pageInfo.pageNum
        this.data.pageSize = this.pageInfo.pageSize
      }, 1000)
    },
    search() {
      console.log('search')
      this.pageInfo.pageNum = 1
      this.init()
    },
    currentChange(pageNum, pageSize) {
      console.log('currentChange')
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
  .TablePage-wrap {

  }
</style>
