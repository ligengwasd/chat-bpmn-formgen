<template>
    <el-table :data="formList" border style="width: 100%">
        <el-table-column prop="key" label="表单名称" width="180" />
        <el-table-column label="操作" width="180">
            <template #default="props">
                <el-button type="primary" @click="showEditFormDialog(props.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
<!--    <br>-->
<!--    <el-row :gutter="20">-->
<!--        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>-->
<!--        <el-col :span="6">-->
<!--            <el-input v-model="formName" placeholder="请输入表单名称"></el-input>-->
<!--        </el-col>-->
<!--        <el-col :span="6">-->
<!--            <el-button type="primary" @click="exportForm()">保存表单</el-button>-->
<!--        </el-col>-->
<!--        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>-->
<!--    </el-row>-->

    <el-dialog v-model="dialogVisible" title="表单设计器" :before-close="handleClose" style="width: 80%; height: 80%">
        <fc-designer ref="designer"/>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
            </span>
        </template>
    </el-dialog>



</template>

<script>
export default {
    setup() {
    },
    data() {
        return {
            formName: "",
            formList: [],
            selectForm: null,
            dialogVisible: false
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
        },
        showEditFormDialog(rowData) {
            this.dialogVisible = true;
            const selectForm = JSON.parse(rowData.value);
            this.$refs.designer.setRule(selectForm.formRule);
            this.$refs.designer.setOption(selectForm.formOptions);
        },
        selectChange() {
            const selectForm = JSON.parse(this.selectForm);
            this.$refs.designer.setRule(selectForm.formRule);
            this.$refs.designer.setOption(selectForm.formOptions);
        }
    }
}
</script>
<style>
</style>
