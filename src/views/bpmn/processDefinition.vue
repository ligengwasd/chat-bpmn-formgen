<template>
    <el-table :data="deploymentList" border style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="key" label="流程key"/>
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="version" label="操作">
            <template #default="props">
                <el-button type="primary" @click="openBpmnViewerDialog(props.row)">查看</el-button>
                <el-button type="primary" @click="openBpmnModelerDialog(props.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog v-model="bpmnViewerDialogVisible" title="查看流程" @opened = "handleBpmnViewerDialogOpen" @closed="handleBpmnViewerDialogClose" style="width: 80%; height: 70%">
        <div id="bpmnViewerCanvas" style="border: 1px solid green;height: 500px;"></div>
    </el-dialog>
    <el-dialog v-model="bpmnModelerDialogVisible" title="编辑流程" @opened = "handleBpmnModelerDialogOpen" @closed="handleBpmnModelerDialogClose" style="width: 80%; height: 100%">
        <div id="bpmnModelerCanvas" style="border: 1px solid green;height: 500px;"></div>
        <div id="bpmnModelerCanvasPropertiesPanel" style="border: 1px solid green;height: 300px;"></div>
    </el-dialog>

</template>

<script>
import BpmnViewer from 'camunda-bpmn-js/lib/camunda-platform/Viewer';
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';

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
            bpmnViewer: null,
            bpmnModelerDialogVisible: false,
            bpmnModelerDialogData: {
                processDefinitionId: null
            },
            bpmnModeler: null
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
        openBpmnViewerDialog(processDefinition) {
            this.bpmnViewerDialogData.processDefinitionId = processDefinition.id;
            this.bpmnViewerDialogVisible = true;
        },
        openBpmnModelerDialog(processDefinition) {
            this.bpmnModelerDialogData.processDefinitionId = processDefinition.id;
            this.bpmnModelerDialogVisible = true;
        },
        handleBpmnViewerDialogOpen() {
            const queryResources = '/engine-rest/process-definition/'.concat(this.bpmnViewerDialogData.processDefinitionId).concat("/xml")
            this.$http.get(queryResources).then(response => {
                let xmlData = response.data.bpmn20Xml;
                this.bpmnViewer = new BpmnViewer({container: '#bpmnViewerCanvas'});
                this.bpmnViewer.importXML(xmlData);
            })
        },
        handleBpmnViewerDialogClose() {
            this.bpmnViewer.destroy();
            this.bpmnViewerDialogData.processDefinitionId = null;
        },
        handleBpmnModelerDialogOpen() {
            const queryResources = '/engine-rest/process-definition/'.concat(this.bpmnModelerDialogData.processDefinitionId).concat("/xml")
            this.$http.get(queryResources).then(response => {
                let xmlData = response.data.bpmn20Xml;
                this.bpmnModeler = new BpmnModeler({
                    container: '#bpmnModelerCanvas',
                    propertiesPanel: {
                        parent: '#bpmnModelerCanvasPropertiesPanel'
                    }
                });
                try {
                    this.bpmnModeler.importXML(xmlData);
                    this.bpmnModeler.get('canvas').zoom('fit-viewport');
                } catch (err) {
                    console.error('something went wrong:', err);
                }
            })
        },
        handleBpmnModelerDialogClose() {
            this.bpmnModeler.destroy();
            this.bpmnModelerDialogData.processDefinitionId = null;
        }
    }
}
</script>
