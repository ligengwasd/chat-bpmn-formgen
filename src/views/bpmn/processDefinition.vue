<template>
    {{bpmnViewerData}}

    <el-table :data="deploymentList" border style="width: 100%">
        <el-table-column prop="id" label="主键" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="key" label="流程key"/>
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="deploymentId" label="部署ID" />
        <el-table-column prop="version" label="操作">
            <template #default="props">
                <el-button type="primary" @click="loadBpmnXml(props.row)">查看流程定义</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog v-model="bpmnViewerDialogVisible" title="流程查看" @opened = "handleOpen" style="width: 100%; height: 100%">
        <div id="bpmnCanvas" style="border: 1px solid green;height: 500px;"></div>
    </el-dialog>
</template>

<script>
import BpmnViewer from 'bpmn-js';

export default {
    setup() {
    },
    data() {
        return {
            deploymentList: [],
            formList: [],
            bpmnViewerDialogVisible: false,
            bpmnViewerDialogData: {
                processDefinitionId: null
            }
        }
    },
    mounted() {
        this.loadDeploymentList();
    },
    methods: {
        loadDeploymentList() {
            this.$http.get('/engine-rest/process-definition').then(response => {
                this.deploymentList = response.data
            }) .catch(error => {
                console.log(error);
            });
        },
        loadBpmnXml(processDefinition) {
            this.bpmnViewerDialogData.processDefinitionId = processDefinition.id;
            this.bpmnViewerDialogVisible = true;
        },
        handleOpen() {
            const queryResources = '/engine-rest/process-definition/'.concat(this.bpmnViewerDialogData.processDefinitionId).concat("/xml")
            this.$http.get(queryResources).then(response => {
                let xmlData = response.data.bpmn20Xml;
                console.log("xmlData", xmlData);
                const bpmnViewer = new BpmnViewer({
                    container: '#bpmnCanvas'
                });
                bpmnViewer.importXML(xmlData);
                //     .then(function(result) {
                //     bpmnViewer.get('bpmnCanvas').zoom('fit-viewport');
                // })
            })

        }

    }
}
</script>
