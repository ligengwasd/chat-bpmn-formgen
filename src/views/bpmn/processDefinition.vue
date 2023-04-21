<template>
    <el-table :data="deploymentList" border style="width: 100%">
        <el-table-column prop="id" label="主键" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="key" label="流程key"/>
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="deploymentId" label="部署ID" />
        <el-table-column prop="version" label="操作">

        </el-table-column>

    </el-table>
</template>

<script>
export default {
    setup() {
    },
    data() {
        return {
            deploymentList: [],
            formList: []
        }
    },
    mounted() {
        this.loadDeploymentList()
    },
    methods: {
        loadDeploymentList() {
            this.$http.get('/engine-rest/process-definition').then(response => {
                this.deploymentList = response.data
            }) .catch(error => {
                console.log(error);
            });
        }
    }
}
</script>
