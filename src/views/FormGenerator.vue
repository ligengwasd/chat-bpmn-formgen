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
            const json = this.$refs.designer.getRule();
            console.log(json);
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
