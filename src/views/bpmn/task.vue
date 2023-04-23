<template>
    <el-table :data="taskList" border stripe style="width: 100%; height: 800px">
        <el-table-column prop="id" label="任务ID" width="80" show-overflow-tooltip/>
        <el-table-column prop="assignee" label="指派人" width="80" />
        <el-table-column prop="name" label="任务名称" width="120" />
        <el-table-column prop="executionId" label="执行流ID" width="180" show-overflow-tooltip/>
        <el-table-column prop="processDefinitionId" label="流程定义ID" width="180" show-overflow-tooltip/>
        <el-table-column prop="processInstanceId" label="流程实例ID" width="180" show-overflow-tooltip/>
        <el-table-column prop="taskDefinitionKey" label="taskDefinitionKey" width="150" />
        <el-table-column label="创建时间" width="180">
            <template #default="props">
                {{formatTime(props.row.created)}}
            </template>
        </el-table-column>
        <el-table-column label="操作">

        </el-table-column>
    </el-table>
</template>

<script>
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 如果需要中文语言包


export default {
    setup() {
    },
    data() {
        return {
            taskList: []
        }
    },
    mounted() {
        // 设置语言为中文
        dayjs.locale('zh-cn')
        this.loadTaskList()
    },
    methods: {
        loadTaskList() {
            this.$http.get('/engine-rest/task', {
            }, {
                params: {
                }
            })
            .then(response => {
                this.taskList = response.data;
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        },
        formatTime(time) {
            if (time != null) {
                return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
            }
        }

    }
}
</script>
<style>
</style>
