<script lang="ts">
	import QrScanner from 'qr-scanner';
  import Modal from './Modal.svelte';
  import { onMount } from 'svelte';
  import { Assignment, db, Match } from '../db';
import { decompressAssignments } from '../compressor';
import { assignmentCount, modal, qualAssignments, quantAssignments } from '../stores';
import { goto } from '$app/navigation';

  let matchData: Array<Assignment> = [];

  let qrScanner: QrScanner

	onMount(() => {
    const videoElem = document.getElementById('scan');
		const overlay = document.getElementById('scanOverlay');
		qrScanner = new QrScanner(
			videoElem as HTMLVideoElement,
			(result) => {matchData = decompressAssignments(result.data); modal.set("loadConfirm");},
			{ highlightScanRegion: true, highlightCodeOutline: true, returnDetailedScanResult: true }
		);
		qrScanner.start();
  });

  async function confirm() {
    try {
      let r: Record<number, Record<number, Assignment>> = {};
      await db.assignments.clear();
      await db.assignments.bulkAdd(matchData);
      qrScanner.stop();

      let qual: Record<number, Record<number, Assignment>> = {};
			let quant: Record<number, Record<number, Assignment>> = {};
			db.assignments
				.each((assignment) => {
          console.log(assignment)
					if (assignment.type == 'qual') {
						if (qual[assignment.matchNum] === undefined) {
							qual[assignment.matchNum] = { [assignment.student]: assignment };
						} else {
							qual[assignment.matchNum][assignment.student] = assignment;
						}
					} else {
						if (quant[assignment.matchNum] === undefined) {
							quant[assignment.matchNum] = { [assignment.student]: assignment };
						} else {
							quant[assignment.matchNum][assignment.student] = assignment;
						}
					}
				})
				.then(() => {
					qualAssignments.set(qual);
          quantAssignments.set(quant);

          goto('./');
				});
    }
    catch {
      console.log("dang it");
    }
    modal.set("");
  }

</script>
{#if $modal === "loadConfirm"}
<Modal>
  <h1 class="text-2xl mb-8 dark:text-white">Load Data?</h1>
  <p class="text-base dark:text-white">This will remove any current match assignments you have stored on device.</p>

  <div class="mt-4">
    <button class="px-2 py-1 rounded bg-gray-400 dark:bg-slate-400 xl:hover:bg-gray-500 xl:dark:hover:bg-slate-500 dark:active:bg-slate-600" on:click={() => {modal.set("")}}>Cancel</button>
    <button class="px-2 py-1 rounded bg-green-400 xl:hover:bg-green-500 active:bg-green-600" on:click={confirm}>Confirm</button>
  </div>
</Modal>
{/if}

<div class="w-full h-full flex flex-col">
	<div class="w-full flex flex-row h-16 bg-blue-500 items-center">
		<button
			on:click={() => {qrScanner.stop(); goto('./scan');}}
			class="absolute translate-x-3 p-2 rounded text-white text-2xl hover:bg-blue-600">Back</button>
		<h1 class="mx-auto text-white text-2xl">Import Data</h1>
	</div>
	<!-- svelte-ignore a11y-media-has-caption -->
	<div class="h-full flex items-center justify-center">
		<div id="scanContainer" class="w-1/2 max-h-full">
			<video id="scan" />
		</div>
	</div>
</div>