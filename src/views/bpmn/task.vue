<template>
    <el-form label-width="125px" :inline="true">
        <el-form-item label="流程定义：">
            <el-select v-model="searchTaskParam.processDefinitionId" placeholder="流程定义" clearable>
                <el-option
                    v-for="item in processDefinitionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="指派人：">
            <el-input v-model="searchTaskParam.assignee" placeholder="指派人" />
        </el-form-item>
        <el-form-item label="业务key：">
            <el-input v-model="searchTaskParam.processInstanceBusinessKeyLike" placeholder="业务key模糊匹配" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="loadTaskList()">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="taskList" border stripe style="width: 100%; height: 800px">
        <el-table-column prop="id" label="任务ID" width="80" show-overflow-tooltip/>
        <el-table-column prop="assignee" label="指派人" width="80" />
        <el-table-column prop="businessKey" label="名称" />
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
            taskList: [],
            processDefinitionList: [],
            searchTaskParam: {
                processDefinitionId: null,
                assignee: null,
                processInstanceBusinessKeyLike: null
            }
        }
    },
    mounted() {
        // 设置语言为中文
        dayjs.locale('zh-cn')
        this.loadTaskList()
        this.loadProcessDefinitionList()
    },
    methods: {
        loadTaskList() {
            this.$http.get('/engine-rest/task',{
                params: Object.fromEntries(Object.entries(this.searchTaskParam).filter(([key, value]) => value !== null && value !== ''))
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
        },
        loadProcessDefinitionList() {
            const params = {params: {"latestVersion": true}};
            this.$http.get('/engine-rest/process-definition', params).then(response => {
                this.processDefinitionList = response.data
            }) .catch(error => {
                console.log(error);
            });
        },

    }
}
</script>
<style>
</style>
