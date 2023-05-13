<template>
  OAuth-Server授权页
    <br>
    <br>
    <el-button type="primary" @click="doLogin()">点击登录</el-button>

</template>

<script>
import { encode, decode } from 'js-base64';

export default {
    name: "confirm",
    methods: {
        doLogin() {
            let authorizeUrlEncode = this.$route.query.authorizeUrl;
            let authorizeUrl = decode(authorizeUrlEncode)
            window.location.href = "http://auth2.tims.com:8001/oauth2/doLogin?name=sa&pwd=123456"
                .concat("&authorizeUrl=").concat(this.$route.query.authorizeUrl);
        }
    }
}
</script>

<style scoped>

</style>
