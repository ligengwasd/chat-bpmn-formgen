<template>
    <el-container>
        <el-header>
            <h1>IM & 智能机器人 & 工作流 缝合怪</h1>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu>
                    <el-menu-item index="/home/chat">
                        <router-link to="/home/chat">即时通信</router-link>
                    </el-menu-item>
                    <el-menu-item index="/home/formGenerator">
                        <router-link to="/home/formGenerator">表单设计器</router-link>
                    </el-menu-item>
                    <el-menu-item index="/home/formParser">
                        <router-link to="/home/formParser">表单解析器</router-link>
                    </el-menu-item>
                    <el-menu-item index="/home/bpmnDesign">
                        <router-link to="/home/bpmnDesign">流程设计器</router-link>
                    </el-menu-item>
                    <el-menu-item index="/home/bpmn/processDefinition">
                        <router-link to="/home/bpmn/processDefinition">流程定义</router-link>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script lang="ts">

</script>

<style lang="scss" scoped>
</style>
