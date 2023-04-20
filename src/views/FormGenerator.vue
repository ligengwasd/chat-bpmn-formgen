<template>
    <el-button type="primary" @click="openFormDesignerDialog()">新增表单</el-button>
    <el-table :data="formList" border style="width: 100%">
        <el-table-column prop="key" label="表单名称" width="180" />
        <el-table-column label="操作" width="380">
            <template #default="props">
                <el-button type="primary" @click="openFormDesignerDialog(props.row)">编辑表单</el-button>
                <el-button type="primary" @click="openFormDesignerDialog(props.row)">使用表单</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model="formGeneratorDialogVisible" title="表单设计器" @opened = "handleOpen" @closed="handleClose" style="width: 100%; height: 100%">
        <fc-designer ref="designer"/>
        <template #footer>
            <span class="dialog-footer">
                表单名称：
                <el-input v-model="formGeneratorDialogData.formName" placeholder="请输入表单名称" style="width: 200px; margin-right: 20px"/>
                <el-button @click="closeFormDesignerDialog()">取消</el-button>
                <el-button type="primary" @click="exportForm">保存表单</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
    setup() {
    },
    data() {
        return {
            formList: [],
            formGeneratorDialogVisible: false,
            formGeneratorDialogData: {
                formId: null,
                formName: null,
                fromDesignerData: null
            }
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
                "key": this.formGeneratorDialogData.formName,
                "value": JSON.stringify(bizConfigValue)
            }
            if (this.formGeneratorDialogData.formId == null) {
                this.$http.post('/bizConfig', param).then(response => {
                    console.log(response.data);
                }) .catch(error => {
                    console.log(error);
                });
            } else {
                this.$http.put('/bizConfig/'.concat(this.formGeneratorDialogData.formId), param).then(response => {
                    console.log(response.data);
                }) .catch(error => {
                    console.log(error);
                });
            }
            ElMessage({message: '操作成功', type: 'success',})
            this.formGeneratorDialogVisible = false;
        },
        loadAllForm() {
            this.$http.get('/bizConfig/list').then(response => {
                console.log(response.data);
                this.formList = response.data;
            });
        },
        openFormDesignerDialog(rowData) {
            this.formGeneratorDialogVisible = true;
            if (rowData != null) {
                this.formGeneratorDialogData.fromDesignerData = rowData.value;
                this.formGeneratorDialogData.formName = rowData.key;
                this.formGeneratorDialogData.formId = rowData.id;
            }
        },
        closeFormDesignerDialog() {
            this.formGeneratorDialogVisible = false;
        },
        handleOpen() {
            console.log("handleOpen")
            const selectForm = JSON.parse(this.formGeneratorDialogData.fromDesignerData);
            this.$refs.designer.setRule(selectForm.formRule);
            this.$refs.designer.setOption(selectForm.formOptions);
        },
        handleClose() {
            console.log("handleClose");
            this.formGeneratorDialogData.fromDesignerData = null;
            this.formGeneratorDialogData.formName = null;
            this.formGeneratorDialogData.formId = null;
            this.$refs.designer.clearActiveRule();
            this.$refs.designer.clearDragRule();
            this.loadAllForm();
        }
    }
}
</script>
<style>
</style>
