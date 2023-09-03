<script setup>
import { useStore } from '../store/store';
const store = useStore()

const confirmReload = () => {
    store.setValuePageData(true, "showDialogConfirm")
    store.setValuePageData(false, "dropdown")
}
</script>

<template>
    <ul class="p-1 text-left text-yellow-400 lg:text-sm xxs:text-xs bg--main">
        <li class="dropDown--entry" @click="confirmReload">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
            <p class="dropDown--entry-text">Reload Data</p>
        </li>
        <li class="dropDown--entry" @click="store.toggleDarkMode()">
            <font-awesome-icon icon="fa-solid fa-droplet" />
            <p class="dropDown--entry-text">Light-Mode/Dark-Mode</p>
        </li>
    </ul>
</template>