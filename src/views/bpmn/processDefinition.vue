<template>
    <el-table :data="deploymentList" border style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="key" label="流程key"/>
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="version" label="操作">
            <template #default="props">
                <el-button type="primary" @click="loadBpmnXml(props.row)">查看流程定义</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog v-model="bpmnViewerDialogVisible" title="查看流程" @opened = "handleOpen" @closed="handleClose" style="width: 80%; height: 70%">
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
            },
            bpmnViewer: null
        }
    },
    mounted() {
        this.loadDeploymentList();
    },
    methods: {
        loadDeploymentList() {
            const params = {params: {"latestVersion": true}};
            this.$http.get('/engine-rest/process-definition', params).then(response => {
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
                this.bpmnViewer = new BpmnViewer({container: '#bpmnCanvas'});
                this.bpmnViewer.importXML(xmlData);
                // this.bpmnViewer.get('bpmnCanvas').zoom('fit-viewport');
                // this.bpmnViewer.get('bpmnCanvas').scroll('center');
            })
        },
        handleClose() {
            this.bpmnViewer.destroy();
        }
    }
}
</script>
