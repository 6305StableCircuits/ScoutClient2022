<script lang="ts">
  import { goto } from "$app/navigation";
import { modal, names, quantAssignments } from "../stores";
import Modal from "./Modal.svelte";

  let matchNum: number;
  let teamNum: number;
  let alliance: "b" | "r" | "" = "";
  let name: string = "";
  let mode: "manual" | "automatic" = "manual";
  let id: number;

  let ready: boolean = false;

  if (typeof window !== "undefined") {
    if (Object.keys($quantAssignments).length !== 0) {
      mode = "automatic";
    }
  }

  function setBlueAlliance() {
    if (mode !== "automatic") {
      alliance = 'b';
    }
  }

  function setRedAlliance() {
    if (mode !== "automatic") {
      alliance = 'r';
    }
  }

  function checkDisabled(alliance: "b" | "r" | "", name: string, matchNum: number, teamNum: number, id: number): boolean {
    console.log("test");
    if (alliance === "" || name === "" || !matchNum || !teamNum || (id !== 0 && !id)) {
      return true;
    }
    else {
      return false;
    }
  }

  function fillName(identifier: number, nm: string) {
    id = identifier;
    name = nm;
    teamNum = $quantAssignments[matchNum][identifier].team;
    alliance = $quantAssignments[matchNum][identifier].alliance;
    modal.set("");
  }

  function changeMatch(num: number) {
    matchNum = num;
    id = undefined;
    name = "";
    teamNum = undefined;
    alliance = undefined;
    modal.set("");
  }
</script>

<meta name="theme-color" media="(prefers-color-scheme: light)" content="#9ca3af">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#334155">

{#if $modal == "matchNum"}
<Modal>
<h1 class="text-2xl text-white">Select a Match Number</h1>
{#each Object.keys($quantAssignments) as assign}
	<button class="w-full my-2 bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:dark:hover:bg-slate-500 xl:dark:active:bg-slate-400 text-2xl dark:text-white" on:click={() => {changeMatch(parseInt(assign));}}>Match {assign}</button>
{/each}

</Modal>
{/if}

{#if $modal == "name"}
<Modal>
<h1 class="text-2xl text-white">Find a Name</h1>
{#each Object.keys($quantAssignments[matchNum]) as nam}
	<button class="w-full my-2 bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:dark:hover:bg-slate-500 xl:dark:active:bg-slate-400 text-2xl dark:text-white" on:click={() => {fillName(parseInt(nam), $names[nam])}}>{$names[nam]}</button>
{/each}
</Modal>
{/if}

<div class="flex h-full flex-col">
  <div class="flex flex-row">
    <a class="h-full w-64 bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:dark:hover:bg-slate-500 xl:dark:active:bg-slate-400 text-2xl dark:text-white inline-flex items-center justify-center" href="./scout">Back</a>
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      {#if mode == "automatic" && Object.keys($quantAssignments).length == 0}
      <label for="matchNum" class="bg-inherit w-full text-center text-2xl cursor-text">Match Number</label>
      <input id="matchNum" type="number" class="bg-inherit w-full h-full text-xl text-center focus:outline-none" bind:value={matchNum}>
      {:else}
      <button class="bg-inherit w-full h-full text-xl text-center" on:click={() => {modal.set("matchNum")}}>{matchNum ? "Match " + matchNum : "Match Number"}</button>
      {/if}
    </div>
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="teamNum" class="bg-inherit w-full text-2xl text-center cursor-text">Team Number</label>
      <input id="teamNum" type="number" class="bg-inherit w-full text-xl text-center focus:outline-none" bind:value={teamNum} disabled={(mode === "automatic") ? true : false}>
    </div>
  </div>
  <div class="flex flex-row h-full">
    {#if mode == "manual"}
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white">
      <div class="w-full h-3/6 inline-flex flex-col justify-center items-center border-b-2 border-gray-400 dark:border-slate-700" on:click={() => {if (Object.keys($quantAssignments).length !== 0) {mode = "automatic"}}}>
        <p class="bg-inherit w-full text-center text-2xl">Manual Override</p>
        {#if Object.keys($quantAssignments).length == 0}
        <p class="bg-inherit w-full text-center cursor-text">No Data Loaded</p>
        {/if}
      </div>
      <label for="name" class="w-full h-3/6 inline-flex flex-col justify-center items-center border-t-2 border-gray-400 dark:border-slate-700 cursor-text">
        <input id="name" type="text" class="bg-inherit w-full text-xl text-center focus:outline-none dark:text-white" placeholder="Enter Your Name" bind:value={name}>
      </label>
    </div>
    {:else if mode == "automatic"}
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white">
      <div class="w-full h-3/6 inline-flex flex-col justify-center items-center border-b-2 border-gray-400 dark:border-slate-700" on:click={() => {mode = "manual"}}>
        <p class="bg-inherit w-full text-center text-2xl">Assigned Matches</p>
      </div>
      <button for="name" class="w-full h-3/6 inline-flex flex-col justify-center items-center border-t-2 border-gray-400 dark:border-slate-700" on:click={() => {modal.set("name")}} disabled={typeof matchNum !== "number"}>
        <p id="name" type="text" class="bg-inherit w-full text-xl text-center focus:outline-none dark:text-white">{(name !== "") ? name : ((matchNum) ? "Select A Name" : "First Select Match Number")}</p>
      </button>
    </div>
    {/if}
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="matchNum" class="mb-16 xl:mb-4 bg-inherit w-full text-2xl text-center cursor-text">Alliance</label>
      <button class="mx-auto w-3/4 h-2/6 xl:h-64 rounded border-8 mb-8 {alliance == 'b' ? 'border-blue-500 bg-blue-400' : 'border-blue-400 bg-blue-400'}" on:click={setBlueAlliance} disabled={(mode === "automatic") ? true : false}></button>

      <button class="mx-auto w-3/4 h-2/6 xl:h-64 rounded border-8 {alliance == 'r' ? 'border-red-500 bg-red-400' : 'border-red-400 bg-red-400'}" on:click="{setRedAlliance}" disabled={(mode === "automatic") ? true : false}></button>
    </div>
  </div>
  <div class="flex flex-row h-24">
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="scoutId" class="bg-inherit w-full text-center cursor-text text-2xl">Scout ID</label>
      <input id="scoutId" type="number" class="bg-inherit w-full text-xl text-center focus:outline-none" bind:value={id} placeholder="##" disabled={(mode === "automatic") ? true : false}>
    </div>
    <button disabled={checkDisabled(alliance, name, matchNum, teamNum, id)} class="flex-col w-full h-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:dark:hover:bg-slate-500 xl:dark:active:bg-slate-400 text-2xl dark:text-white inline-flex items-center justify-center disabled:bg-gray-400 disabled:dark:bg-slate-700 disabled:hover:bg-gray-400 disabled:hover:dark:bg-slate-700 disabled:cursor-default" on:click={() => {goto(`/quant?match=${matchNum}&team=${teamNum}&alliance=${alliance}&id=${id}`)} }>
      <p class="">Proceed</p>
    </button>
  </div>
</div>