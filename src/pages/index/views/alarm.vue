<template>  
  <div class="alarmClockSeting">
    <van-picker :columns="columns" @change="onChange" />
    <van-cell-group>
      <van-cell title="周一   周二   周三   周五   周六   周日" is-link arrow-direction="down"/>
    </van-cell-group>
    <div class="weeks">
        <van-cell-group>
          <van-cell v-for="(item,index) in weeks" :key="index" :title="item.title" @click="selectWeek(item.id)">
            <input type="checkbox" :id="item.id" :value="item.id" v-model="weeksChecked">
          </van-cell>
        </van-cell-group>
    </div>
    <div class="btnBottom"><van-button type="primary" size="large" @click="setAlarm">设置完成</van-button></div>
  </div>
</template>  
  
<script>
import util from "@/pages/index/helper/util";
import alarmApi from "@/pages/index/services/alarm";
const time = ["00", "15", "30", "45"];
const citys = {
  "00": time,
  "01": time,
  "02": time,
  "03": time,
  "04": time,
  "05": time,
  "06": time,
  "07": time,
  "08": time,
  "09": time,
  "10": time,
  "11": time,
  "12": time,
  "13": time,
  "14": time,
  "15": time,
  "16": time,
  "17": time,
  "18": time,
  "19": time,
  "20": time,
  "21": time,
  "22": time,
  "23": time
};

export default {
  data() {
    return {
      columns: [
        {
          values: [
            "00",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23"
          ],
          className: "active",
          defaultIndex: [
            "00",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23"
          ].indexOf(this.$route.query.hours)
        },
        {
          values: time,
          defaultIndex: time.indexOf(this.$route.query.minutes)
        }
      ],
      weeks: [
        {
          title: "周一",
          id: 1
        },
        {
          title: "周二",
          id: 2
        },
        {
          title: "周三",
          id: 3
        },
        {
          title: "周四",
          id: 4
        },
        {
          title: "周五",
          id: 5
        },
        {
          title: "周六",
          id: 6
        },
        {
          title: "周日",
          id: 7
        }
      ],
      hoursAndMinutes: [this.$route.query.hours,this.$route.query.minutes],
      weeksChecked: JSON.parse(this.$route.query.week)
    };
  },
  methods: {
    onChange(picker, values) {
      this.hoursAndMinutes = values;
    },
    selectWeek(id) {
      var e = e || window.event;
      if (e.target.nodeName == "INPUT") {
        e.cancelBubble = true;
        e.stopPropagation();
      } else {
        this.weeksChecked.includes(id)
          ? this.weeksChecked.splice(this.weeksChecked.indexOf(id), 1)
          : this.weeksChecked.push(id);
      }
    },
    setAlarm() {
      if(this.weeksChecked.length == 0){
        this.$toast('请选择星期几')
        return 
      }
      const data = {
        company_id: window.localStorage.getItem("company_id"),
        wx_user_id: util.getCookie("wx_userid"),
        is_active: true,
        muen_id: this.$route.query.id,
        send_time: this.hoursAndMinutes.join(":"),
        send_day: this.weeksChecked
      };
      alarmApi.alarmSubmit({ data: data }).then(res => {
        const { data, status, message } = res.data;
        if (status) {
          this.$toast(message);
        } else {
          this.$router.push({
            name: "alarmList"
          });
        }
      });
    }
  },
};
</script>  
  
<style lang="scss" scoped>
.alarmClockSeting {
  padding-bottom: 120px;
  .weeks {
    width: 700px;
    margin: 0 auto;
    input[type="checkbox"] {
      position: relative;
      width: 40px;
      height: 40px;
      vertical-align: middle;
      color: white;
      border: none;
    }

    input[type="checkbox"]::before {
      content: "";
      position: absolute;
      z-index: 800;
      top: -2px;
      left: -2px;
      width: 42px;
      height: 42px;
      line-height: 40px;
      text-align: center;
      color: white;
      font-size: 28px;
      background-color: white;
      border: 1px solid #999; /*no*/
      box-sizing: border-box;
      border-radius: 4px;
    }

    input[type="checkbox"]:checked::before {
      color: white;
      border: 1px solid #51b8cb; /*no*/
      background-color: #51b8cb;
      content: "✔";
      font-family: "微软雅黑";
    }

    .van-cell {
      font-size: 28px;
      color: #727171;
      padding: 20px;
    }
  }
  .btnBottom {
    width: 100%;
    height: 100px;
    position: fixed;
    z-index: 801;
    bottom: 0;
    left: 0;
  }
}
</style>  