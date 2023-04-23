<template>
    <el-table :data="taskList" border style="width: 100%">
        <el-table-column prop="id" label="表单名称" width="180" />

    </el-table>

</template>

<script>
import { ElMessage } from 'element-plus'

export default {
    setup() {
    },
    data() {
        return {
            taskList: []
        }
    },
    mounted() {
        this.loadTaskList()
    },
    methods: {
        loadTaskList() {
            this.$http.post('/engine-rest/task').then(response => {
                console.log(response.data);
                this.taskList = response.data;
            });
        }

    }
}
</script>
<style>
</style>
