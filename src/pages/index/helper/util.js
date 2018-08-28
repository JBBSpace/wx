export default {
  // 全局路径
  // apiServer: 'http://bs.7psj.cn:9632',
  // apiServer: 'http://hgworker.7psj.cn:9000',
  apiServer: 'http://192.168.1.145:9001',
  imageServer: '/',
  // 本地存储
  setStorage(name, content) {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
  },
  getStorage(name) {
    if (!name) return
    let content = window.localStorage.getItem(name)
    return JSON.parse(content)
  },
  removeStorage(name) {
    if (!name) return
    window.localStorage.removeItem(name)
  },
  getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
  },
  getRequest() {
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  }
}
