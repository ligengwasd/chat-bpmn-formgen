<template>
    <el-row :gutter="20">
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6">
            <el-select v-model="selectForm" placeholder="请选择">
                <el-option
                    v-for="item in formList"
                    :key="item.key"
                    :label="item.key"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" @click="exportForm()">导入表单</el-button>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6">
            <el-input v-model="formName" placeholder="请输入表单名称"></el-input>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" @click="exportForm()">保存表单</el-button>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <br>
    <fc-designer ref="designer"/>


</template>

<script>
export default {
    setup() {
    },
    data() {
        return {
            formName: "",
            formList: [],
            selectForm: null
        }
    },
    mounted() {
        this.loadAllForm()
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
        loadAllForm() {
            this.$http.get('/bizConfig/list').then(response => {
                console.log(response.data);
                this.formList = response.data;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
