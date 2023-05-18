<template>
    <div id="box"></div>
</template>

<script>
import 'amis/sdk/sdk.js';
import 'amis/lib/themes/default.css';

import {  onMounted } from "vue";
console.log("ces ");
const props= defineProps({
    amisjson: {
        type: Object,
        required: true
    }
})

onMounted(() => {
    // @ts-ignore
    var amis = amisRequire('amis/embed');
    console.log(amis);

    let amisScoped = amis.embed('#box', props.amisjson);
})

</script>

<style scoped>

</style>
