<template>
  OAuth-Server登录页
    <br>
    <br>
    <el-button type="primary" @click="doLogin()">点击登录</el-button>

</template>

<script>
import { encode, decode } from 'js-base64';

export default {
    name: "login",
    methods: {
        doLogin() {
            let authorizeUrlEncode = this.$route.query.authorizeUrl;
            let authorizeUrl = decode(authorizeUrlEncode)
            window.location.href = "http://auth2.tims.com:8001/oauth2/doLogin?name=sa&pwd=123456"
                .concat("&authorizeUrl=").concat(this.$route.query.authorizeUrl);

            // this.$http.get('http://localhost:8001/oauth2/doLogin?name=sa&pwd=123456',
            //     {withCredentials: true}
            // ).then(response => {
            //     console.log(authorizeUrl);
            //     console.log(response.headers['set-cookie']);
            //     var x = document.cookie;
            //     console.log(x);
            //     console.log(x.substring(8));
            //     document.cookie = "satoken=" + x.substring(8)+ "; Max-Age=2592000; Expires=Sun, 11 Jun 2024 20:32:06 +0800; Path=/; Domain=tims.com"
            //     // window.location.href = authorizeUrl;
            // })
        }
    }
}
</script>

<style scoped>

</style>
