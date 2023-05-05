<template>
    <el-row>
        <el-col :span="8" style="margin-right: 10px">
            查询流程实例：
            <el-select v-model="processDefinitionSelectorValue" @change="handleSelectProcessDefinition" placeholder="流程定义" clearable>
                <el-option
                    v-for="item in processDefinitionList"
                    :key="item.key"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
            <br>
            <br>
            <el-table :data="processInstanceList" @current-change="handleSelectProcessInstance" highlight-current-row border style="width: 100%">
                <el-table-column prop="id" label="流程实例" show-overflow-tooltip/>
                <el-table-column prop="businessKey" label="业务Key" />
                <el-table-column label="操作" width="220px">
                    <template #default="props">
                        <el-button type="primary" @click="loadVariableList({'processInstanceIdIn':props.row.id})">查看参数</el-button>
                        <el-button type="primary" @click="processTrack(props.row.id)">流程追踪</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="15" style="margin-right: 10px">
            执行流列表：
            <el-table :data="executionList" @current-change="handleSelectExecution" highlight-current-row border style="width: 100%">
                <el-table-column prop="id" label="执行流ID" show-overflow-tooltip/>
                <el-table-column prop="ended" label="是否结束" />
                <el-table-column label="操作" width="120px">
                    <template #default="props">
                        <el-button type="primary" @click="loadVariableList({'executionIdIn':props.row.id})">查看参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <br>
            任务列表：
            <el-table :data="taskList" border stripe>
                <el-table-column prop="id" label="任务ID" show-overflow-tooltip/>
                <el-table-column prop="assignee" label="指派人" />
                <el-table-column prop="businessKey" label="名称" />
                <el-table-column prop="name" label="任务名称" />
<!--                <el-table-column prop="executionId" label="执行流ID" width="180" show-overflow-tooltip/>-->
<!--                <el-table-column prop="processDefinitionId" label="流程定义ID" width="180" show-overflow-tooltip/>-->
<!--                <el-table-column prop="processInstanceId" label="流程实例ID" width="180" show-overflow-tooltip/>-->
                <el-table-column prop="taskDefinitionKey" label="taskDefinitionKey" />
                <el-table-column label="创建时间">
                    <template #default="props">
                        {{formatTime(props.row.created)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template #default="props">
                        <el-button type="primary" @click="completeTask(props.row)">完成</el-button>
                        <el-button type="primary" @click="loadVariableList({'taskIdIn':props.row.id})">查看参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>

    <el-dialog v-model="variableDialogVisible" title="参数列表">
        <el-table :data="variableList" border stripe style="width: 100%; height: 800px">
            <el-table-column prop="name" label="参数名称"  show-overflow-tooltip/>
            <el-table-column prop="type" label="参数类型"  show-overflow-tooltip/>
            <el-table-column prop="value" label="参数值"  show-overflow-tooltip/>
        </el-table>
    </el-dialog>

    <el-dialog v-model="bpmnViewerDialogVisible" title="查看流程" style="width: 80%; height: 70%"  @closed="handleBpmnViewerDialogClose">
        <div id="bpmnViewerCanvas" style="border: 1px solid green;height: 500px;"></div>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import BpmnViewer from "camunda-bpmn-js/lib/camunda-platform/Viewer"; // 如果需要中文语言包

export default {
    setup() {
    },
    data() {
        return {
            processDefinitionSelectorValue: null,
            taskList: [],
            processDefinitionList: [],
            processInstanceList:[],
            executionList:[],
            variableDialogVisible: false,
            variableList: [],
            bpmnViewerDialogVisible: false,
            bpmnViewer: null,
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
        handleSelectProcessDefinition(processDefinitionId) {
            this.$http.get('/engine-rest/process-instance',{
                params: {
                    processDefinitionId: processDefinitionId
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

        },
        loadVariableList(param) {
            const url = "/engine-rest/variable-instance";
            const params = {params: param};
            this.$http.get(url, params).then(response => {
                this.variableList = response.data
            }) .catch(error => {
                console.log(error);
            });
            this.variableDialogVisible = true;
        },
        processTrack(processInstanceId) {
            if (this.bpmnViewer) {
                this.bpmnViewer.destroy();
            }
            const queryResources = '/engine-rest/process-definition/'.concat(this.processDefinitionSelectorValue).concat("/xml")
            this.$http.get(queryResources).then(response => {
                let xmlData = response.data.bpmn20Xml;
                this.bpmnViewer = new BpmnViewer({container: '#bpmnViewerCanvas'});
                console.log("bpmnXml内容:", xmlData)
                this.bpmnViewer.importXML(xmlData);
            })

            this.$http.get('/bpmn/highLine/'.concat(processInstanceId)).then(response => {
                console.log("highLine数据", response.data);
                let canvas = this.bpmnViewer.get("canvas");
                //高亮线
                response.data.highLine.forEach((e) => {
                    canvas.addMarker(e, "highlight");
                });
                //高亮任务
                if (response.data.highPoint.length > 0) {
                    response.data.highPoint.forEach((e) => {
                        if (e) {
                            canvas.addMarker(e, "highlight");
                        }
                    });
                }
                //高亮我执行过的任务
                if (response.data.ido.length > 0) {
                    response.data.ido.forEach((e) => {
                        if (e) {
                            canvas.addMarker(e, "highlightIDO");
                        }
                    });
                }
                //高亮下一个任务
                if (response.data.waitingToDo.length > 0) {
                    response.data.waitingToDo.forEach((e) => {
                        if (e) {
                            canvas.addMarker(e, "highlightTODO");
                        }
                    });
                }
            })
            this.bpmnViewerDialogVisible = true;
        },
        handleBpmnViewerDialogClose() {
            this.bpmnViewer.destroy();
        }
    }
}
</script>
<style>
.current-row>td {
    background: #006eff;
}
/*  以下为流程图高亮样式  */
.highlight .djs-visual > :nth-child(1) {
    stroke: green !important;
    fill: rgba(0, 80, 0, 0.4) !important;
}
.highlightIDO .djs-visual > :nth-child(1) {
    stroke: rgb(255, 196, 0) !important;
    fill: rgba(255, 196, 0, 0.4) !important;
}
.highlightTODO .djs-visual > :nth-child(1) {
    stroke: rgb(255, 0, 0) !important;
    fill: rgba(255, 255, 255, 0.4) !important;
}
</style>
