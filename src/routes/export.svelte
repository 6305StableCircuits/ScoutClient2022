<script lang="ts">
import { modal } from "../stores";

import { db, type Result } from "../db";
import Modal from "./Modal.svelte";
import { compressResponse } from "../compressor";

import QRCode from "qrcode";
import { onMount } from "svelte";
import { goto } from "$app/navigation";

let scouted: string = "";

onMount(() => {
	if (typeof window !== 'undefined') {
		let canvas = document.getElementById("output");
	  db.results.each((r) => {
  	  scouted += compressResponse(r) + "|"
	  }).then(() => {
  	  scouted = scouted.substring(0,scouted.length-1);
			QRCode.toCanvas(canvas, scouted, {scale:5});
  	})
	}
})

function save() {
	modal.set("exportConfirm");
}

async function confirm() {
	await db.results.clear();
	modal.set("");
	goto("/");
}
</script>
{#if $modal === "exportConfirm"}
<Modal>
  <h1 class="text-2xl mb-8 dark:text-white">Are you done?</h1>
  <p class="text-base dark:text-white">This will clear any scouting data you have stored on device.</p>

  <div class="mt-4">
    <button class="px-2 py-1 rounded bg-gray-400 dark:bg-slate-400 xl:hover:bg-gray-500 xl:dark:hover:bg-slate-500 dark:active:bg-slate-600" on:click={() => {modal.set("")}}>Cancel</button>
    <button class="px-2 py-1 rounded bg-green-400 xl:hover:bg-green-500 active:bg-green-600" on:click={async () => {await confirm()}}>Confirm</button>
  </div>
</Modal>
{/if}

<div class="w-full h-full flex flex-col">
	<div class="w-full flex flex-row h-16 bg-blue-500 items-center">
		<a
			href="./scan"
			class="absolute translate-x-3 p-2 rounded text-white text-2xl hover:bg-blue-600">Back</a
		>
		<h1 class="mx-auto text-white text-2xl">Export Data</h1>
	</div>
	<div class="h-full flex flex-col items-center justify-center">
    <canvas id="output" class="w-32 h-32 my-auto"></canvas>
		<button class="w-[87.3%] h-16 text-2xl rounded bg-green-300 border-4 border-green-500 xl:hover:bg-green-400 active:bg-green-500 mb-14" on:click={save}>Confirm</button>
	</div>
</div>