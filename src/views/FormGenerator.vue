<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <el-input v-model="formName" placeholder="请输入表单名称"></el-input>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" @click="exportForm()">创建表单</el-button>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <br>
    <fc-designer ref="designer"/>


</template>

<script>
export default {
    data() {
        return {
            formName:""
        }
    },
    methods: {
        exportForm() {
            const bizConfigValue = {
                "formRule": this.$refs.designer.getRule(),
                "formOptions": this.$refs.designer.getOption()
            }
            const param = {
                "type": "form",
                "key": this.formName,
                "value": JSON.stringify(bizConfigValue)
            }
            console.log(param);
            // this.$http.post('/task/1/comment/create', param).then(response => {
            this.$http.post('/bizConfig', param).then(response => {
                console.log(response.data);
            }) .catch(error => {
                console.log(error);
            });
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
