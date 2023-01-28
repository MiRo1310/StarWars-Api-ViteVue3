<script setup>
const emit = defineEmits(["confirmReload", "switchDarkLightMode"])


</script>

<template>
    <ul class="p-1 text-left text-yellow-400 lg:text-sm xxs:text-xs mr_bgMain">
        <li class="mr_dropDown" @click="$emit('confirmReload')">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
            <p class="mr_dropDownText">Reload Data</p>
        </li>
        <li class="mr_dropDown" @click="$emit('switchDarkLightMode')">
            <font-awesome-icon icon="fa-solid fa-droplet" />
            <p class="mr_dropDownText">Light-Mode/Dark-Mode</p>
        </li>
        <li class="mr_dropDown"></li>
    </ul>
</template>