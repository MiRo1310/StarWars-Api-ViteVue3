<script setup>
import { useStore } from '../store/store';
import dataJs from "../lib/data";
const store = useStore()

const confirm = (val) => {
    store.setValuePageData(false, "showDialogConfirm")
    if (val) dataJs.reloadData()
}

</script>
<template>
    <div class="bg--confirm md:w-[30%] w-[80%] h-40 text-center">
        <h1 class="mt-4 font-bold p-2">Do you really want to reload Data from API?</h1>
        <button @click="confirm(true)" type="button" class="button button--confirm">OK</button>
        <button @click="confirm(false)" type="button" class="button button--confirm">Abort</button>
    </div>
</template>