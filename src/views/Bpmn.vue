<template>
    <div>
        bpmn
        <div id="container"></div>
    </div>
</template>

<script>
import { markRaw } from 'vue';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';

export default {
    data() {
        return {
            containerEl: null,
            bpmnModeler: null
        };
    },
    mounted() {
        // 初始化流程图
        this.init();
    },
    methods: {
        /**
         * 初始化流程图
         */
        init() {
            this.containerEl = document.getElementById('container');
            // 加markRaw去除双向绑定作用域
            this.bpmnModeler = markRaw(new BpmnModeler({
                container: this.containerEl
            }));
            this.bpmnModeler.createDiagram(() => {
                this.bpmnModeler.get('canvas').zoom('fit-viewport');
            });
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
