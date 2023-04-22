<template>
    <el-button type="primary" @click="openBpmnModelerDialog()">新建</el-button>
    <el-table :data="deploymentList" border style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="key" label="流程key"/>
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="version" label="操作">
            <template #default="props">
                <el-button type="primary" @click="openBpmnViewerDialog(props.row)">查看</el-button>
                <el-button type="primary" @click="openBpmnModelerDialog(props.row)">编辑</el-button>
                <el-button type="primary" @click="deleteProcessDef(props.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog v-model="bpmnViewerDialogVisible" title="查看流程" @opened = "handleBpmnViewerDialogOpen" @closed="handleBpmnViewerDialogClose" style="width: 80%; height: 70%">
        <div id="bpmnViewerCanvas" style="border: 1px solid green;height: 500px;"></div>
    </el-dialog>
    <el-dialog v-model="bpmnModelerDialogVisible" title="编辑流程" @opened = "handleBpmnModelerDialogOpen" @closed="handleBpmnModelerDialogClose" style="width: 80%; height: 100%">
        <el-button type="primary" @click="saveProcessDef()" style="margin-bottom: 6px">保存流程定义</el-button>
        <el-row>
            <el-col :span="18">
                <div id="bpmnModelerCanvas" style="border: 1px solid green;height: 600px;"></div>
            </el-col>
            <el-col :span="6">
                <div id="bpmnModelerCanvasPropertiesPanel" style="border: 1px solid green;height: 600px;"></div>
            </el-col>
        </el-row>
    </el-dialog>

</template>

<script>
import BpmnViewer from 'camunda-bpmn-js/lib/camunda-platform/Viewer';
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';
import customTranslate from '../../bpmnxml/customTranslate';


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
            if (processDefinition != null) {
                this.bpmnModelerDialogData.processDefinitionId = processDefinition.id;
            }
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
        async handleBpmnModelerDialogOpen() {
            let xmlData;
            if (this.bpmnModelerDialogData.processDefinitionId != null) {
                const queryResources = '/engine-rest/process-definition/'.concat(this.bpmnModelerDialogData.processDefinitionId).concat("/xml")
                await this.$http.get(queryResources).then(response => {
                    xmlData = response.data.bpmn20Xml;
                })
            }
            this.bpmnModeler = new BpmnModeler({
                container: '#bpmnModelerCanvas',
                propertiesPanel: {
                    parent: '#bpmnModelerCanvasPropertiesPanel'
                },
                additionalModules: [
                    {
                        translate: [ 'value', customTranslate ]
                    }
                ]
            });
            if (xmlData != null) {
                this.bpmnModeler.importXML(xmlData);
            } else {
                xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                    "<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:modeler=\"http://camunda.org/schema/modeler/1.0\" id=\"Definitions_0qynyjh\" targetNamespace=\"http://bpmn.io/schema/bpmn\" exporter=\"Camunda Modeler\" exporterVersion=\"5.10.0\" modeler:executionPlatform=\"Camunda Platform\" modeler:executionPlatformVersion=\"7.19.0\">\n" +
                    "  <bpmn:process id=\"Process_0bjr816\" isExecutable=\"true\">\n" +
                    "    <bpmn:startEvent id=\"StartEvent_1\" />\n" +
                    "  </bpmn:process>\n" +
                    "  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n" +
                    "    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_0bjr816\">\n" +
                    "      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n" +
                    "        <dc:Bounds x=\"152\" y=\"79\" width=\"36\" height=\"36\" />\n" +
                    "      </bpmndi:BPMNShape>\n" +
                    "    </bpmndi:BPMNPlane>\n" +
                    "  </bpmndi:BPMNDiagram>\n" +
                    "</bpmn:definitions>\n";
                // xmlData.replace('Process_0bjr816', '222');
                this.bpmnModeler.importXML(xmlData);
            }
        },
        handleBpmnModelerDialogClose() {
            this.bpmnModeler.destroy();
            this.bpmnModelerDialogData.processDefinitionId = null;
        },
        deleteProcessDef(processDefinition) {
            const params = {params: {"cascade": true}};
            console.log(processDefinition.id);
            this.$http.delete("/engine-rest/process-definition/key/".concat(processDefinition.key), params).then(response => {
                ElMessage({message: '删除成功', type: 'success'});
                this.loadDeploymentList();
            });
        },
        async saveProcessDef() {
            const options = { format: true };
            const xmlData = await this.bpmnModeler.saveXML(options);
            const createDeployUrl = "/engine-rest/deployment/create";
            let formData = new FormData();
            formData.append('data', xmlData);

            this.$http.post(createDeployUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // 设置请求头的Content-Type
                }
            })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
}
</script>
