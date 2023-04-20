<template>
    <el-button type="primary" @click="showEditFormDialog()">新增表单</el-button>
    <el-table :data="formList" border style="width: 100%">
        <el-table-column prop="key" label="表单名称" width="180" />
        <el-table-column label="操作" width="180">
            <template #default="props">
                <el-button type="primary" @click="showEditFormDialog(props.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    {{editingForm}}
    <el-dialog v-model="dialogVisible" title="表单设计器" @close="handleClose" style="width: 80%; height: 80%">
        <fc-designer ref="designer"/>
        <template #footer>
            <span class="dialog-footer">
                表单名称：
                <el-input v-model="editingForm.formKey" placeholder="请输入表单名称" style="width: 200px; margin-right: 20px"/>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="exportForm">保存表单</el-button>
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
            dialogVisible: false,
            editingForm: {
                formId: null,
                formKey: null
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
            if (rowData != null) {
                this.editingForm.formId = rowData.id;
                this.editingForm.formKey = rowData.key;
                const selectForm = JSON.parse(rowData.value);
                this.$refs.designer.setRule(selectForm.formRule);
                this.$refs.designer.setOption(selectForm.formOptions);
            }
        },
        handleClose() {
            this.editingForm.formId = null;
            this.editingForm.formKey = null;
            this.$refs.designer.clearActiveRule();
            // this.$refs.designer.setRule([]);
            // this.$refs.designer.setOption(null);
        }
    }
}
</script>
<style>
</style>
