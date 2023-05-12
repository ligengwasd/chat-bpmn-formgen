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
            console.log(111)
            let authorizeUrlEncode = this.$route.query.authorizeUrl;
            let authorizeUrl = decode(authorizeUrlEncode)
            this.$http.get('http://localhost:8001/oauth2/doLogin?name=sa&pwd=123456').then(response => {
                console.log(authorizeUrl);
                window.location.href = authorizeUrl;
            })
        }
    }
}
</script>

<style scoped>

</style>
