<template>
    <el-button type="primary" @click="openBpmnModelerDialog()">新建</el-button>
    <el-table :data="deploymentList" border style="width: 100%">
        <el-table-column prop="id" label="流程定义ID" show-overflow-tooltip/>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="key" label="流程key"/>
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="deploymentId" label="部署ID" show-overflow-tooltip/>
        <el-table-column prop="resource" label="资源" show-overflow-tooltip/>
        <el-table-column label="操作" width="300px">
            <template #default="props">
                <el-button type="primary" @click="openBpmnViewerDialog(props.row)">查看</el-button>
                <el-button type="primary" @click="openBpmnModelerDialog(props.row)">编辑</el-button>
<!--                <el-button type="primary" @click="deleteProcessDef(props.row)">删除</el-button>-->
                <el-button type="primary" @click="openFormParserDialog(props.row)">启动流程</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog v-model="bpmnViewerDialogVisible" title="查看流程" @opened = "handleBpmnViewerDialogOpen" @closed="handleBpmnViewerDialogClose" style="width: 80%; height: 70%">
        <div id="bpmnViewerCanvas" style="border: 1px solid green;height: 500px;"></div>
    </el-dialog>
    <el-dialog v-model="bpmnModelerDialogVisible" title="编辑流程" @opened = "handleBpmnModelerDialogOpen" @closed="handleBpmnModelerDialogClose" style="width: 90%; height: 80%">
        <el-button type="primary" @click="saveProcessDef()" style="margin-bottom: 6px">保存流程定义</el-button>
        <el-row>
            <el-col :span="20">
                <div id="bpmnModelerCanvas" style="border: 1px solid green;height: 600px;"></div>
            </el-col>
            <el-col :span="4">
                <div id="bpmnModelerCanvasPropertiesPanel" style="border: 1px solid green;height: 600px;"></div>
            </el-col>
        </el-row>
    </el-dialog>
    <el-dialog v-model="formParserDialogVisible" title="启动流程">
        {{formParserDialogData.formValue}}
        <br>
        {{formParserDialogData.rule}}
        <el-form label-width="125px" inline>
            <el-form-item label="请先选择表单">
                <el-select placeholder="请选择表单" clearable @change="formSelectorChange">
                    <el-option
                        v-for="item in formParserDialogData.formList"
                        :key="item.key"
                        :label="item.key"
                        :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="请输入业务key">
                <el-input v-model="formParserDialogData.businessKey" placeholder="请输入业务key" />
            </el-form-item>
        </el-form>
        <br>
        <form-create v-if = "formParserDialogData.rule != null"
                     :rule="formParserDialogData.rule"
                     :option="formParserDialogData.options"
                     v-model="formParserDialogData.formValue"
        />
        <template #footer>
            <el-button type="primary" @click="startProcess">
              启动流程
            </el-button>
        </template>
    </el-dialog>
</template>

<script>
import BpmnViewer from 'camunda-bpmn-js/lib/camunda-platform/Viewer';
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';
import customTranslate from '../../bpmnxml/customTranslate';
import { ElMessage } from 'element-plus'


export default {
    setup() {
    },
    data() {
        return {
            deploymentList: [],
            bpmnViewerDialogVisible: false,
            bpmnViewerDialogData: {
                processDefinitionId: null
            },
            bpmnViewer: null,
            bpmnModelerDialogVisible: false,
            bpmnModelerDialogData: {
                processDefinitionId: null
            },
            bpmnModeler: null,
            formParserDialogVisible: false,
            formParserDialogData: {
                formList: [],
                processDefinition: null,
                businessKey: null,
                // formSelectValue: null
                rule: [],
                options: {},
                formValue: {}
            }
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
                console.log("bpmnXml内容:", xmlData)
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
            const createDeployUrl = "bpmn/deployment/create";
            const param = {
                "bpmnXmlStr": xmlData.xml
            };
            this.$http.post(createDeployUrl, param)
            .then(response => {
                console.log("deploymentId:", response.data);
                this.loadDeploymentList();
                this.bpmnModelerDialogVisible = false;
                ElMessage({message: '保存成功', type: 'success'});
            })
            .catch(error => {
                ElMessage({message: '保存成功', type: 'error'});
                console.error(error);
            });

        },
        openFormParserDialog(processDefinition) {
            this.formParserDialogVisible = true;
            this.$http.get('/bizConfig/list').then(response => {
                this.formParserDialogData.formList = response.data;
            });
            this.formParserDialogData.processDefinition = processDefinition
            // if (rowData != null) {
            //     const selectForm = JSON.parse(rowData.value);
            //     this.formParserDialogData.rule = selectForm.formRule;
            //     this.formParserDialogData.options = selectForm.formOptions;
            // }
        },
        formSelectorChange(selectedValue){
            console.log("111", selectedValue)
            this.formParserDialogData.rule = JSON.parse(selectedValue.value).formRule
            this.formParserDialogData.options = JSON.parse(selectedValue.value).formOptions
        },
        startProcess() {
            console.log(111, this.formParserDialogData.formValue)
            const createDeployUrl = "/engine-rest/process-definition/".concat(this.formParserDialogData.processDefinition.id).concat("/start");
            let variables = {};
            for(let key in this.formParserDialogData.formValue){
                console.log(key, this.formParserDialogData.formValue[key])
                variables[key] = {
                    "value": this.formParserDialogData.formValue[key],
                }
            }
            console.log("variables", variables);
            const param = {
                "businessKey": this.formParserDialogData.businessKey,
                "variables": variables
            };
            this.$http.post(createDeployUrl, param)
                .then(response => {
                    ElMessage({message: '保存成功', type: 'success'});
                    this.formParserDialogVisible = false;
                })
                .catch(error => {
                    ElMessage({message: '保存失败', type: 'error'});
                    console.error(error);
                });
        }
    }
}
</script>
