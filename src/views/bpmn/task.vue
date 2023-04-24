<template>
    <el-row>
        <el-col :span="2" style="margin-right: 10px">
            <el-table :data="processDefinitionList" @current-change="handleSelectProcessDefinition" highlight-current-row border style="width: 100%">
                <el-table-column prop="name" label="流程定义名称" />
            </el-table>
        </el-col>
        <el-col :span="5" style="margin-right: 10px">
            <el-table :data="processInstanceList" @current-change="handleSelectProcessInstance" highlight-current-row border style="width: 100%">
                <el-table-column prop="id" label="流程实例" show-overflow-tooltip/>
                <el-table-column prop="businessKey" label="业务Key" />
                <el-table-column label="操作" width="120px">
                    <template #default="props">
                        <el-button type="primary" @click="">查看参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="4" style="margin-right: 10px">
            <el-table :data="executionList" @current-change="handleSelectExecution" highlight-current-row border style="width: 100%">
                <el-table-column prop="id" label="执行流ID" show-overflow-tooltip/>
                <el-table-column prop="ended" label="是否结束" />
                <el-table-column label="操作" width="120px">
                    <template #default="props">
                        <el-button type="primary" @click="">查看参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="12">
            <el-table :data="taskList" border stripe style="width: 100%; height: 800px">
                <el-table-column prop="id" label="任务ID" width="80" show-overflow-tooltip/>
                <el-table-column prop="assignee" label="指派人" width="80" />
                <el-table-column prop="businessKey" label="名称" />
                <el-table-column prop="name" label="任务名称" width="120" />
<!--                <el-table-column prop="executionId" label="执行流ID" width="180" show-overflow-tooltip/>-->
<!--                <el-table-column prop="processDefinitionId" label="流程定义ID" width="180" show-overflow-tooltip/>-->
<!--                <el-table-column prop="processInstanceId" label="流程实例ID" width="180" show-overflow-tooltip/>-->
                <el-table-column prop="taskDefinitionKey" label="taskDefinitionKey" width="150" />
                <el-table-column label="创建时间" width="180">
                    <template #default="props">
                        {{formatTime(props.row.created)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="props">
                        <el-button type="primary" @click="completeTask(props.row)">完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>


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
            processInstanceList:[],
            executionList:[]

        }
    },
    mounted() {
        // 设置语言为中文
        dayjs.locale('zh-cn')
        this.loadProcessDefinitionList()
    },
    methods: {
        formatTime(time) {
            if (time != null) {
                return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        handleSelectProcessDefinition(processDefinition) {
            this.$http.get('/engine-rest/process-instance',{
                params: {
                    processDefinitionId: processDefinition.id
                }
            })
                .then(response => {
                    this.processInstanceList = response.data;
                    console.log(response.data);
                })
        },
        handleSelectProcessInstance(processInstance) {
            this.$http.get('/engine-rest/execution',{
                params: {
                    processInstanceId: processInstance.id
                }
            })
                .then(response => {
                    this.executionList = response.data;
                    console.log(response.data);
                })
        },
        handleSelectExecution(execution) {
            this.$http.get('/engine-rest/task',{
                params: {
                    executionId: execution.id
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
        loadProcessDefinitionList() {
            const params = {params: {"latestVersion": true}};
            this.$http.get('/engine-rest/process-definition', params).then(response => {
                this.processDefinitionList = response.data
            }) .catch(error => {
                console.log(error);
            });
        },
        completeTask(task) {
            const completeUrl = "/engine-rest/task/".concat(task.id).concat("/complete");
            this.$http.post(completeUrl, {})
                .then(response => {
                    ElMessage({message: '保存成功', type: 'success'});
                })
                .catch(error => {
                    ElMessage({message: '保存失败', type: 'error'});
                    console.error(error);
                });

        }
    }
}
</script>
<style>
.current-row>td {
    background: #006eff;

}
</style>
