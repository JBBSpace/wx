<template>
  <div class="chart-week-sales">
    <div class="table">
      <p class="chart-label">商品周销售报表</p>
      <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      <div v-else>
        <div class="scroll-x">
          <table>
            <thead>
              <tr>
                <th class="name">门店名称</th>
                <th>周日</th>
                <th>周一</th>
                <th>周二</th>
                <th>周三</th>
                <th>周四</th>
                <th>周五</th>
                <th>周六</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data" :key="item.com_name">
                <td class="name">{{item.comname}}</td>
                <td>{{thousandBitSeparator(item.SUN)}}</td>
                <td>{{thousandBitSeparator(item.MON)}}</td>
                <td>{{thousandBitSeparator(item.TUE)}}</td>
                <td>{{thousandBitSeparator(item.WED)}}</td>
                <td>{{thousandBitSeparator(item.THU)}}</td>
                <td>{{thousandBitSeparator(item.FRI)}}</td>
                <td>{{thousandBitSeparator(item.SAT)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartApi from "@/pages/index/services/chart";
export default {
  data: function() {
    return {
      data: [],
      dataEmpty: true
    };
  },
  methods: {
    viewreportData() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        Datetype: 0,
        comid: 1
      };
      chartApi.rep_week_com({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status) {
          this.$toast(message);
        } else {
          if (data.length) {
            this.dataEmpty = false;
            this.data = data;
          }
        }
      });
    },
    thousandBitSeparator(num) {
      return (
        num &&
        (num.toString().indexOf(".") != -1
          ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
              return $1 + ",";
            })
          : num.toString().replace(/(\d)(?=(\d{3}))/g, function($0, $1) {
              return $1 + ",";
            }))
      );
    }
  },
  mounted() {
    this.viewreportData();
  }
};
</script>
<style lang="scss" scoped>
.chart-week-sales {
  padding: 5px 20px 0 20px;
  .table {
    .chart-label {
      font-size: 30px;
      padding-left: 50px;
      line-height: 70px;
      background: url("../assets/table.png") no-repeat left center;
      background-size: 40px 40px;
    }
    .data-empty {
      width: 100%;
      height: calc(100vh - 400px);
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.7);
      color: #888;
      font-size: 28px;
    }
    .scroll-x {
      width: 100%;
      overflow-x: scroll;
      table {
        width:180%;
        border-collapse: collapse;
        font-size: 28px;
        thead {
          tr {
            display: table;
            width: 100%;
            table-layout: fixed;
            th {
              text-align: center;
              border: 1px solid #ebedf0; /*no*/
              padding: 25px 10px;
              color: #428bca;
              background-color: #f9f9f9;
              &.name {
                width: 240px;
              }
            }
          }
        }
        tbody {
          display: block;
          tr {
            display: table;
            width: 100%;
            table-layout: fixed;
            td {
              text-align: center;
              border: 1px solid #ebedf0; /*no*/
              padding: 15px 10px;
              color: #727171;
              text-align: right;
              &.right {
                text-align: right;
              }
              &.name {
                width: 240px;
                text-align: left;
              }
            }
            &:nth-child(odd) {
              background-color: #fff;
            }
            &:nth-child(even) {
              background-color: #f9f9f9;
            }
          }
        }
      }
    }
  }
}
</style>  