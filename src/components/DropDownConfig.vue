<script setup>
const emit = defineEmits(["confirmReload", "switchDarkLightMode"])


</script>

<template>
    <ul class="p-1 text-left text-yellow-400 lg:text-sm xxs:text-xs mr_bgMain">
        <li class="dropDownEntryStyle" @click="$emit('confirmReload')">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
            <p class="dropDownEntryText">Reload Data</p>
        </li>
        <li class="dropDownEntryStyle" @click="$emit('switchDarkLightMode')">
            <font-awesome-icon icon="fa-solid fa-droplet" />
            <p class="dropDownEntryText">Light-Mode/Dark-Mode</p>
        </li>
        <li class="dropDownEntryStyle"></li>
    </ul>
</template>