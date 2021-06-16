<template>
    <div class="param-table">

        <etm-title>{{title}}:</etm-title>
        <table class="table">
            <thead class="thead">
            <tr>
                <th v-for="(col, index) of columns" :key="index">{{col.label}}</th>
            </tr>
            </thead>
            <tbody class="tbody">
            <tr class="tr" v-for="(data, index) of tableData" :key="index">
                <template v-for="(col,idx) of columns">
                    <td :key="idx">{{data[col.prop]}}</td>
                </template>
            </tr>
            </tbody>
        </table>
    </div>

</template>
<script>
export default {
  name: 'params-table',
  props: {
    tableData: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: '属性列表'
    }
  },
  data() {
    return {
      columns: [
        {label: '参数', prop: 'param'},
        {label: '说明', prop: 'description'},
        {label: '类型', prop: 'type'},
        {label: '可选值', prop: 'option'},
        {label: '默认值', prop: 'default'},
      ]
    }
  }
}
</script>

<style lang="scss" scoped>


    .param-table {
        margin: 16px 0;

        .table {
            table-layout: fixed;

            .thead, .tbody {
                width: 100%;

                th, td {
                    text-align: center;
                    width: 20%;
                    border: 1px solid rgba(238, 238, 238, 0.53);
                }
            }

            .thead {
                th {
                    background-color: #ddd;
                }
            }

            .tbody .tr {
                &:nth-child(eve) {
                    background-color: #fff;
                }

                &:hover {
                    background-color: #eee;
                }
            }
        }
    }
</style>
