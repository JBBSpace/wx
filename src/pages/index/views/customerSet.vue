<template>
  <div class="customerSet">
    <div class="cell" v-for="item in customerList" :key="item.id">
      <div class="left">
        <p class="lable">{{item.lable}}</p>
      </div>
      <div class="right">
        <van-switch v-model="checked" @change="userrejectPost"/>
      </div>
    </div>
  </div>
</template>  
<script>
import api from "@/pages/index/services/my";
export default {
  data() {
    return {
      customerList: [
        {
          id: 1,
          lable: "顾客评价提醒"
        }
      ],
      checked: true
    };
  },
  methods: {
    init() {
      api
        .userrejectGet({
          params: { company_id: localStorage.getItem("company_id") }
        })
        .then(res => {
          const { status, message, data } = res.data;
          if (status) {
            this.$toast(message);
          } else {
            this.checked = !data.includes("reviews");
          }
        });
    },
    userrejectPost() {
      const apiUrl = this.checked ? "userrejectDelete":"userrejectPost";
      api[apiUrl]({
        data: {
          company_id: localStorage.getItem("company_id"),
          type: "reviews"
        }
      }).then(res => {
        const { status, message, data } = res.data;
        if (status) {
          this.$toast(message);
        } else {
          this.checked = !data.includes("reviews");
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>  
  
<style lang="scss" scoped>
.customerSet {
  background: #f6f7f7;
  padding: 20px 30px;
  .cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 33px;
    .van-switch--on {
      background-color: #51b8cb;
    }
  }
}
</style>  