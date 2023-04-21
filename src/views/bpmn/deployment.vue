<template>
    {{deploymentList}}
    <el-table :data="deploymentList" border style="width: 100%">
        <el-table-column prop="id" label="主键" width="320" />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="deploymentTime" label="部署时间" />
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
            this.$http.get('/engine-rest/deployment').then(response => {
                this.deploymentList = response.data
            }) .catch(error => {
                console.log(error);
            });
        }
    }
}
</script>
