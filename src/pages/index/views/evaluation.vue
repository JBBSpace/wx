<template>
  <div class="chart-commodity-market-two">
    <div class="company-name"
         v-if="!role">
      <span class="label">公司名称：</span>
      <span class="select-text"
            @click="popupShow = !popupShow">{{companyInfo.name}}</span>
    </div>
    <div class="echart-type">
      <van-collapse v-model="activeNames"
                    accordion>
        <van-collapse-item title="报表类型："
                           :name="1"
                           :border="false">
          <div class="info">
            <span v-for="item in echartTypeList"
                  :class="[{ active: isActive(item.Datetype) }, 'item']"
                  :key="item.Datetype"
                  @click="toggleType(item.Datetype)">{{item.text}}</span>
          </div>
        </van-collapse-item>
      </van-collapse>
      <div class="cp">
        <p>{{role?"展示类型：":"排序："}}</p>
        <div class="info">
          <span v-for="item in echart2TypeList"
                :class="[{ active: isActive2(item.order) }, 'item']"
                :key="item.order"
                @click="toggleType2(item.order)">{{item.text}}</span>
        </div>
      </div>
    </div>
    <div class="table">
      <p class="chart-label">顾客评价表</p>
      <div v-if="dataEmpty"
           class="data-empty">查询成功 暂无数据</div>
      <div v-else>
        <table>
          <thead>
            <tr v-if="role">
              <th>顾客姓名</th>
              <th>评价平均分</th>
              <th>日期</th>
            </tr>
            <tr v-else>
              <th>门店编号</th>
              <th class="center">公司名称</th>
              <th>评价平均分</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="role">
              <tr v-for="(item,index) in tableData"
                  :key="index">
                <td>{{item.c_clientname}}</td>
                <td>{{item.c_degree}}</td>
                <td>{{item.date}}</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(item,index) in tableData"
                  :key="index">
                <td>{{item.c_com}}</td>
                <td class="center">{{item.com_name}}</td>
                <td>{{item.c_degree}}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <van-popup v-model="popupShow"
               position="bottom">
      <van-picker show-toolbar
                  value-key="name"
                  :columns="companyList"
                  @cancel="popupShow = !popupShow"
                  @confirm="onConfirm" />
    </van-popup>
  </div>
</template>

<script>
import chartApi from "@/pages/index/services/chart";
export default {
  data: function () {
    return {
      popupShow: false,
      companyInfo: { id: "", name: "请选择公司名称", code: "" },
      companyList: [],
      role: localStorage.getItem("role") === "clerk",
      activeNames: 1,
      Datetype: "0",
      orderClerk: "date",
      orderTop: "des",
      echartTypeList: [
        {
          text: "今日",
          Datetype: "0"
        },
        {
          text: "本周",
          Datetype: "1"
        },
        {
          text: "本月",
          Datetype: "2"
        },
        {
          text: "本季度",
          Datetype: "3"
        },
        {
          text: "本半年",
          Datetype: "4"
        },
        {
          text: "本年",
          Datetype: "5"
        }, {
          text: "昨日",
          Datetype: "10"
        },
        {
          text: "上周",
          Datetype: "11"
        },
        {
          text: "上月",
          Datetype: "12"
        },
        {
          text: "上季度",
          Datetype: "13"
        },
        {
          text: "上半年",
          Datetype: "14"
        },
        {
          text: "去年",
          Datetype: "15"
        }
      ],
      tableData: [],
      dataEmpty: true
    };
  },
  computed: {
    echart2TypeList: function () {
      if (this.role) {
        return [{
          text: "全部",
          order: "date"
        }, {
          text: "差评",
          order: "bad"
        }]
      } else {
        return [{
          text: "降序",
          order: "des"
        }, {
          text: "升序",
          order: "asc"
        }]
      }
    }
  },
  methods: {
    viewreportData () {
      const params = {
        Datetype: this.Datetype,
        company_id: localStorage.getItem("company_id"),
        order: this.role ? this.orderClerk : this.orderTop,
        comid: this.companyInfo.id ? this.companyInfo.id : ""
      };
      chartApi.rep_evaluation({ params: params }).then(res => {
        const { status, message, data } = res.data;
        this.dataEmpty = true;
        if (status) {
          this.$toast(message);
        } else {
          const lng = data.length;
          if (lng > 0) {
            this.dataEmpty = false;
          }
          this.tableData = data;
        }
      });
    },
    initCompanyList () {
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
    isActive (isActive) {
      return this.Datetype === isActive;
    },
    isActive2 (order) {
      if (this.role) {
        return this.orderClerk === order;
      } else {
        return this.orderTop === order;
      }
    },
    toggleType (type) {
      this.Datetype = type;
      this.viewreportData();
    },
    toggleType2 (type) {
      if (this.role) {
        this.orderClerk = type;
      } else {
        this.orderTop = type;
      }
      this.viewreportData();
    },
    onConfirm (value) {
      this.companyInfo = value;
      this.popupShow = !this.popupShow;
      this.viewreportData();
    },
    thousandBitSeparator (num) {
      return (
        num &&
        (num.toString().indexOf(".") != -1
          ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ",";
          })
          : num.toString().replace(/(\d)(?=(\d{3}))/g, function ($0, $1) {
            return $1 + ",";
          }))
      );
    }
  },
  created () {
    if (this.role) {
      this.viewreportData();
    } else {
      this.initCompanyList()
    }
  }
};
</script>
<style lang="scss" scoped>
.chart-commodity-market-two {
  padding: 30px 20px 0 20px;
  .label {
    font-size: 28px;
    padding-left: 27px;
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
    .cp {
      padding: 0 30px;
      font-size: 28px;
      display: flex;
      align-items: center;
    }
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
            &.center {
              width: 300px;
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
            &.center {
              width: 300px;
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