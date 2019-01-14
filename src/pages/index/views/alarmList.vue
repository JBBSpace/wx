<template>  
<div class="alarmClockList">
  <div class="banner">
    <img src="../assets/alarmClock.png">
  </div>
  <ul>
    <li class="cell" v-for="item in alarmClockList" :key="item.id" @click="goSet(item)">
      <div class="left">
        <p class="time">{{item.send_time}}</p>
        <p class="name">{{item.name}}</p>
        <p class="week">{{item.weeks}}</p>
      </div>
      <div class="right">
        <van-switch v-model="item.is_active"/>
      </div>
    </li>
  </ul>
</div>
</template>  
<script>
import util from "@/pages/index/helper/util";
import alarmApi from "@/pages/index/services/alarm";
export default {
  data() {
    return {
      alarmClockList: []
    };
  },
  methods: {
    init() {
      const params = {
        company_id: window.localStorage.getItem("company_id"),
      };
      alarmApi.alarmtask({ params: params }).then(res => {
        const { data, status, message } = res.data;
        if (status) {
          this.$toast(message);
        } else {
          this.alarmClockList = data;
        }
      });
    },
    goSet(self) {
      var e = e || window.event;
      if (e.target.nodeName == "DIV") {
        e.stopPropagation();
        if (self.send_day.length) {
          const data = {
            company_id: window.localStorage.getItem("company_id"),
            is_active: self.is_active,
            muen_id: self.id
          };
          alarmApi.alarmSubmit({ data: data }).then(res => {
            const { data, status, message } = res.data;
            if (status) {
              this.$toast(message);
              self.is_active = !self.is_active;
            }
          });
        } else {
          this.$router.push({
            name: "alarm",
            query: {
              id: self.id,
              hours: "00",
              minutes: "00",
              week: JSON.stringify([])
            }
          });
        }
      } else {
        this.$router.push({
          name: "alarm",
          query: {
            id: self.id,
            hours:
              self.send_time == null || self.send_time == ""
                ? "00"
                : self.send_time.split(":")[0],
            minutes:
              self.send_time == null || self.send_time == ""
                ? "00"
                : self.send_time.split(":")[1],
            week: JSON.stringify(self.send_day)
          }
        });
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>  
  
<style lang="scss" scoped>
.alarmClockList {
  padding-bottom: 80px;
  .banner {
    width: 750px;
    height: 460px;
    background: #51b8cb;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 380px;
      height: 365px;
    }
  }
  ul {
    .cell {
      display: flex;
      justify-content: space-between;
      padding: 0 20px 0 20px;
      border-bottom: 1px solid #989898; /*no*/
      .left {
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        .time {
          font-size: 36px;
          color: rgba(81, 184, 203, 1);
        }
        .name {
          font-size: 33px;
          color: rgba(0, 0, 0, 1);
        }
        .week {
          font-size: 24px;
          color: rgba(114, 113, 113, 1);
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .van-switch--on {
          background-color: #51b8cb;
        }
      }
    }
  }
}
</style>  