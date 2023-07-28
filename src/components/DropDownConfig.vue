<script setup>
const emit = defineEmits(["confirmReload", "switchDarkLightMode"])


</script>

<template>
    <ul class="p-1 text-left text-yellow-400 lg:text-sm xxs:text-xs bg--main">
        <li class="dropDown--entry" @click="$emit('confirmReload')">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
            <p class="dropDown--entry-text">Reload Data</p>
        </li>
        <li class="dropDown--entry" @click="$emit('switchDarkLightMode')">
            <font-awesome-icon icon="fa-solid fa-droplet" />
            <p class="dropDown--entry-text">Light-Mode/Dark-Mode</p>
        </li>
    </ul>
</template>