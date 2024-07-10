<script setup lang="ts">
import WebREditor from './components/WebREditor.vue'
import Toolbar from 'primevue/toolbar';
const version = __APP_VERSION__;
</script>
<style>
:root {
	--webr-toolbar-height: 2rem;
}
</style>
<template>
	<Toolbar class="py-0" style="height: var(--webr-toolbar-height)">
		<template #start>
			<div class="flex flex-row p-0 m-0" style="align-self:center">
				<h2 class="m-0" style="font-size:100%;align-self:baseline">webR Console</h2>
				<span class="ml-1" style="align-self:baseline">v{{version}}</span>
			</div>
		</template>
		<template #center>
		</template>
		<template #end>
			<div class="p-0 m-0">webR v{{ webR.version }}</div>
		</template>
	</Toolbar>
	<WebREditor style="height: calc(100% - var(--webr-toolbar-height))" />
</template>
