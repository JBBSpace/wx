<template>
    <div class="scanResult">
      <div class="contain">
        <div class="detail">
          <div class="label">商品：</div>
          <div class="info">{{articlename}}</div>
        </div>
        <span class="cion"></span>
        <table>
          <thead>
            <tr>
              <th>门店名称</th>
              <th>库存（个）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in scanResultList" :key="item.com_name">
              <td>{{item.warehousename}}</td>
              <td>{{item.number}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>
<script>
import scanAPI from "@/pages/index/services/scan";
document.title = "商品信息查询";
export default {
  data() {
    return {
      scanResultCode: this.$route.params.code,
      scanResultList: [],
      articlename: ""
    };
  },
  methods: {
    init() {
      const params = {
        code: this.scanResultCode,
        company_id: window.localStorage.getItem("company_id")
      };
      scanAPI.stockInfo({ params: params }).then(res => {
        const { data } = res.data;
        this.scanResultList = data;
        this.articlename = res.data.articlename;
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.scanResult {
  .contain {
    padding: 25px;
    .detail {
      overflow: hidden; /*父元素*/
      .label {
        float: left; /*子元素*/
        font-size: 30px;
        color: rgba(0, 0, 0, 1);
      }
      .info {
        overflow: hidden; /*子元素*/
        font-size: 26px;
        color: rgba(114, 113, 113, 1);
      }
      .cion {
        position: relative;
      }
      .cion:before {
        content: "台词：";
      }
    }

    table {
      width: 100%;
      border: 1px solid #727171; /*no*/
      border-collapse: collapse;
      font-size: 28px;
      th,
      td {
        text-align: center;
        border: 1px solid #727171; /*no*/
        padding: 25px 10px;
      }
      th {
        color: #000000;
      }
      td {
        color: #727171;
      }
    }
  }
}
</style>
