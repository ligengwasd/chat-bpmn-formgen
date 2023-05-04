<template>
    <el-container>
        <el-header>
            <h1>即时通讯 & 流程引擎</h1>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu :default-active="$route.path">
                    <router-link to="/home/chat">
                        <el-menu-item index="/home/chat">即时通信</el-menu-item>
                    </router-link>
                    <router-link to="/home/formGenerator">
                        <el-menu-item index="/home/formGenerator">表单引擎</el-menu-item>
                    </router-link>
                    <el-sub-menu>
                        <template #title>
                            <span>流程引擎</span>
                        </template>
                        <router-link to="/home/bpmn/processDefinition">
                            <el-menu-item index="/home/bpmn/processDefinition">流程定义</el-menu-item>
                        </router-link>
                        <router-link to="/home/bpmn/task">
                            <el-menu-item index="/home/bpmn/task">任务列表</el-menu-item>
                        </router-link>

                    </el-sub-menu>
<!--                    <el-menu-item index="/home/formParser">-->
<!--                        <router-link to="/home/formParser">表单解析器</router-link>-->
<!--                    </el-menu-item>-->
<!--                    <el-menu-item index="/home/bpmnDesign">-->
<!--                        <router-link to="/home/bpmnDesign">流程设计器</router-link>-->
<!--                    </el-menu-item>-->
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
