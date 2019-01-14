<template>
  <div class="chart-store-sales">
    <div class="company-name">
      <span class="label">公司名称：</span>
      <span class="select-text" @click="popupShow = !popupShow">{{companyInfo.name}}</span>
    </div>
    <div class="echart-type">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item title="报表类型：" :name="1" :border="false">
          <div class="info">
            <span
              v-for="item in echartTypeList"
              :class="[{ active: isActive(item.type) }, 'item']"
              :key="item.type"
              @click="toggleType(item.type)"
            >{{item.text}}</span>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="table">
      <p class="chart-label">销售表格</p>
      <div v-if="dataEmpty" class="data-empty">查询成功 暂无数据</div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>门店编号</th>
              <th>门店名称</th>
              <th class="right">实售金额（元）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>-</td>
              <td>合计</td>
              <td class="right">{{thousandBitSeparator(data.sum)}}</td>
            </tr>
            <tr v-for="item in data.re_data" :key="item.com_name">
              <td>{{item.c_com}}</td>
              <td class="left">{{item.com_name}}</td>
              <td class="right">{{thousandBitSeparator(item.money)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <van-popup v-model="popupShow" position="bottom">
      <van-picker
        show-toolbar
        value-key="name"
        :columns="companyList"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import util from "@/pages/index/helper/util";
import chartApi from "@/pages/index/services/chart";
export default {
  data: function() {
    return {
      popupShow: false,
      companyInfo: { id: "", name: "请选择公司名称", code: "" },
      companyList: [],
      activeNames: 1,
      curType: "0",
      echartTypeList: [
        {
          text: "日报",
          type: "0"
        },
        {
          text: "周报",
          type: "1"
        },
        {
          text: "月报",
          type: "2"
        },
        {
          text: "季度报",
          type: "3"
        },
        {
          text: "半年报",
          type: "4"
        },
        {
          text: "年报",
          type: "5"
        },
        {
          text: "昨日",
          type: "10"
        },
        {
          text: "上周报",
          type: "11"
        },
        {
          text: "上月报",
          type: "12"
        },
        {
          text: "上季度",
          type: "13"
        },
        {
          text: "上半年",
          type: "14"
        },
        {
          text: "去年",
          type: "15"
        }
      ],
      data: [],
      dataEmpty: true
    };
  },
  methods: {
    initCompanyList() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        name: "st_company"
      };
      chartApi.initCompanyList({ params: params }).then(res => {
        const { status, message, data } = res.data;
        if (status) {
          this.$toast(message);
        } else {
          this.companyList = data;
          this.companyInfo = data[0]
            ? data[0]
            : { id: "", name: "公司列表获取出错", code: "" };
          this.viewreportData();
        }
      });
    },
    viewreportData() {
      const params = {
        company_id: localStorage.getItem("company_id"),
        Datetype: this.curType,
        comid: this.companyInfo.id ? this.companyInfo.id : ""
      };
      chartApi.viewreportDataStoreSales({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status) {
          this.$toast(message);
        } else {
          if (data.re_data.length) {
            this.dataEmpty = false;
            this.data = data;
          }
        }
      });
    },
    isActive(isActive) {
      return this.curType === isActive;
    },
    toggleType(type) {
      this.curType = type;
      this.viewreportData();
    },
    onConfirm(target) {
      this.companyInfo = target;
      this.popupShow = !this.popupShow;
      this.viewreportData();
    },
    onCancel() {
      this.popupShow = !this.popupShow;
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
    this.initCompanyList();
  }
};
</script>
<style lang="scss" scoped>
.chart-store-sales {
  padding: 30px 20px 0 20px;
  .label {
    font-size: 30px;
  }
  .company-name {
    display: flex;
    align-items: center;
    padding: 10px 0;
    .select-text {
      width: 480px;
      font-size: 26px;
      line-height: 68px;
      color: #727171;
      border: 1px solid #ebedf0; /*no*/
      border-radius: 8px;
      padding-left: 20px;
      background: url("../assets/select.png") no-repeat 440px center;
    }
  }
  .echart-type {
    .info {
      font-size: 0;
      .item {
        display: inline-block;
        width: 98px;
        line-height: 56px;
        border: 1px solid #ebedf0; /*no*/
        border-radius: 6px;
        margin: 0 10px 6px 0;
        font-size: 26px;
        color: #727171;
        text-align: center;
        &.active {
          background-color: #51b8cb;
          border: 1px solid #51b8cb; /*no*/
          color: white;
        }
      }
    }
  }
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
    table {
      width: 100%;
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
            &:nth-child(1) {
              width: 130px;
            }
            &.right {
              width: 160px;
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
            &:nth-child(1) {
              width: 130px;
            }
            &.right {
              width: 160px;
              text-align: right;
            }
            &.left {
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
</style>  