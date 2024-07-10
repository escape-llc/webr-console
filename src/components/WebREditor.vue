<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Image from 'primevue/image';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import Galleria from 'primevue/galleria';
import Toolbar from 'primevue/toolbar';
import ProgressSpinner from 'primevue/progressspinner';
import ScrollTop from 'primevue/scrolltop';


import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
ace.config.set(
	"basePath",
	"https://cdn.jsdelivr.net/npm/ace-builds/src-noconflict/"
);
</script>

<template>
	<Splitter style="height: calc(100% - 4rem)">
		<SplitterPanel :size="33" class="flex items-center justify-center">
			<div class="webr-editor">
				<Toolbar class="p-1 mb-1 webr-editor-header">
					<template #start>
						<ButtonGroup>
							<Button icon="pi pi-caret-right" title="Run Code" :label="runCaption" size="small" :disabled="buttonDisabled" @click="run"/>
							<Button icon="pi pi-delete-left" title="Clear Editor" label="Clear" size="small" severity="primary" outlined @click="clearCode"/>
						</ButtonGroup>
						<ProgressSpinner v-if="buttonDisabled" style="width: 1.5rem; height: 1.5rem;justify-content: center;" strokeWidth="4" fill="transparent"
							animationDuration="5s" aria-label="R is working" />
					</template>
					<template #center>
					</template>
					<template #end>
						<ButtonGroup>
							<Button icon="pi pi-align-left" title="Clear Output" label="Clear" size="small" severity="primary" outlined @click="clearOutput"/>
							<Button icon="pi pi-chart-bar" title="Clear Images" label="Clear" size="small" severity="primary" outlined  :badge="images.length.toString()"
								badgeSeverity="contrast" @click="clearImages"/>
						</ButtonGroup>
					</template>
				</Toolbar>
				<v-ace-editor v-model:value="input" lang="r" theme="twilight" class="webr-ace-editor" ref="webrEditor"
					:options="{ useWorker: true, wrap: true }" />
			</div>
		</SplitterPanel>
		<SplitterPanel :size="33" class="flex items-center justify-center">
			<div :ref="el => outputContainer(el)" v-if="outputs.length > 0" class="webr-output-container">
				<template v-for="output in outputs" v-bind:key="output">
					<pre class="webr-output" :class="{ 'webr-output-stdin': output.type === 'stdin','webr-output-stdout': output.type === 'stdout','webr-output-stderr': output.type === 'stderr' }">{{ output.output }}</pre>
				</template>
				<div id="webr-output-anchor"></div>
				<ScrollTop target="parent" :threshold="200" icon="pi pi-arrow-up" :buttonProps="{ raised: true, rounded: true }" />
			</div>
		</SplitterPanel>
		<SplitterPanel v-if="images.length > 0" :size="33" style="width:33%;max-width:50%" class="flex items-center justify-center">
			<Galleria :value="images" :activeIndex="activeImage" :showThumbnails="false" :showIndicators="true">
				<template #item="slotProps">
					<!--<img :src="slotProps.item.dataURL" style="width: 100%;display:block" /> -->
					<Image :src="slotProps.item.dataURL" alt="Image" width="100%" preview />
				</template>
				<template #thumbnail="slotProps">
					<img :src="slotProps.item.dataURL" style="height:20rem;display:block" />
				</template>
			</Galleria>
		</SplitterPanel>
	</Splitter>
</template>

<style>
/*
.p-overlay-mask {
	background-color: white !important;
}
.p-image-toolbar {
	background-color: silver !important;
	border-color: darkgray !important;
}
.p-image-action{
	color: black !important;
}
*/
.webr-editor {
	background-color: #ebebeb;
	height: 100%;
	width: 100%;
}

.webr-editor-header {
	background-color: #ebebeb !important;
	border: 1px solid #CCC;
}

.webr-editor-btn {
	flex-grow:1;
	flex-shrink:1;
	float:right;
}

.webr-ace-editor {
	height: 100%;
	border: 1px solid #CCC;
	font-size: 16px;
}

.webr-output-container {
	border: 1px solid #CCC;
	height: 100%;
	width: 100%;
	overflow: auto;
	padding: .5rem;
}

.webr-output {
	text-wrap: wrap;
	word-wrap: break-word;
	overflow-anchor: none;
}
.webr-output-stdin {
	color: darkgray;
	margin-left: 1rem;
}
.webr-output-stderr {
	color: red;
}
.webr-output-stdout {
	color: black;
}
#webr-output-anchor {
	overflow-anchor: auto;
	height: 1px;
}
.webr-plot-output {
	height: 100%;
	width: 100%;
	overflow: auto;
}
</style>

<script lang="ts">
import type { Shelter, WebR } from 'webr';
import type { VAceEditorInstance } from 'vue3-ace-editor/types';
import type { Message } from 'webr/dist/webR/chan/message';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		webR: WebR;
		codeShelter: Shelter;
	}
}
interface ROutputLine {
	type: string;
	output: string;
}
interface OutputImage {
	dataURL: string;
	width: number;
	height: number;
}

export default {
	mounted: async function () {
		console.log("Mounted", this.webR, this.codeShelter);
		await this.webR.init();
		this.codeShelter = await new this.webR.Shelter();
		this.runCaption = "Run";
		this.buttonDisabled = false;
	},
	data(): {
		input: string,
		outputs: ROutputLine[],
		images: OutputImage[],
		runCaption: string,
		buttonDisabled: boolean,
		activeImage: number|null,
	} {
		return {
			input: "head(mtcars, n=5)\n",
			outputs: [],
			images: [],
			runCaption: "Loading...",
			buttonDisabled: true,
			activeImage: null,
		};
	},
	methods: {
		outputContainer: function(_ctr: Element|null) { },
		createCanvas: function(width: number, height: number): HTMLCanvasElement {
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			canvas.style.width = "100%";
			canvas.style.aspectRatio = (width/height).toString();
			return canvas;
		},
		clearOutput: function() {
			this.outputs = [];
		},
		clearImages: function() {
			this.images = [];
			this.activeImage = null;
		},
		clearCode: function() {
			const ace = this.$refs.webrEditor as VAceEditorInstance;
			ace!.getAceInstance().setValue("");
		},
		run: async function () {
			const ace = this.$refs.webrEditor as VAceEditorInstance;
			this.buttonDisabled = true;
			try {
				await this.webR.init();
				const code:string = ace.value;
				const code2 = code.replaceAll("\r\n", "\n");
				const result = await this.codeShelter.captureR(code2, {
					withAutoprint: true,
					captureStreams: true,
					captureConditions: false,
					env: this.webR.objs.globalEnv,
				});
				await this.webR.evalRVoid('dev.off()');

				this.outputs.push({type: "stdin", output: code });
				// Get captured output
				let output = "";
				let lastt = "";
				for(let msg of result.output) {
					const type = (msg as Message).type;
					const data = (msg as Message).data;
					if(type !== lastt) {
						if(output) {
							this.outputs.push({type: lastt, output});
							output = "";
						}
						lastt = type;
					}
					if(output) output += "\n";
					output += data;
				}
				if(output) {
					this.outputs.push({type: lastt, output});
				}
				// Render plot to HTML canvas element
				const msgs = await this.webR.flush();
				let canvasx: HTMLCanvasElement|null = null;
				let canvasall: HTMLCanvasElement[] = [];
				let sawfirstdraw: boolean = false;
				msgs.forEach((msg) => {
					//console.log("msg", msg.type, msg.data.event);
					if (msg.type === 'canvas' && msg.data.event === 'canvasImage') {
						const ctx = canvasx!.getContext('2d');
						if(!sawfirstdraw) {
							// we don't get the size until the first draw command
							sawfirstdraw = true;
							canvasx!.width = msg.data.image.width;
							canvasx!.height = msg.data.image.height;
							// bkg is transparent otherwise
							ctx!.fillStyle = "white";
							ctx!.fillRect(0, 0, canvasx!.width, canvasx!.height);
						}
						ctx!.drawImage(msg.data.image, 0, 0);
					} else if (msg.type === 'canvas' && msg.data.event === 'canvasNewPage') {
						// prepare for a page
						canvasx = this.createCanvas(1000, 1000);
						sawfirstdraw = false;
						const ctx = canvasx.getContext('2d');
						// doesn't appear to have an effect
						ctx!.clearRect(0, 0, canvasx.width, canvasx.height);
						canvasall.push(canvasx);
					}
				});
				for(let cx in canvasall) {
					const canv = canvasall[cx];
					const io = { dataURL: canv.toDataURL(), width: canv.width, height: canv.height };
					this.images.push(io);
				}
			} finally {
				// Destroy sheltered R objects
				this.codeShelter.purge();
				this.buttonDisabled = false;
				this.activeImage = this.images.length === 0 ? null : this.images.length - 1;
			}
		}
	},
	components: {
		VAceEditor, Splitter, SplitterPanel, Button, Image,
	},
};
</script>
