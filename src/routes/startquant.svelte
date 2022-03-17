<script lang="ts">
  import { goto } from "$app/navigation";
import { matches } from "../stores";

  let matchNum: number;
  let teamNum: number;
  let alliance: "b" | "r" | "" = "";
  let name: string = "";
  let mode: "manual" | "automatic" = "automatic";
  let id: number;

  let ready: boolean = false;

  function setBlueAlliance() {
    alliance = 'b';
  }

  function setRedAlliance() {
    alliance = 'r';
  }

  function checkDisabled(alliance: "b" | "r" | "", name: string, matchNum: number, teamNum: number, id: number): boolean {
    if (alliance === "" || name === "" || !matchNum || !teamNum || !id) {
      return true;
    }
    else {
      return false;
    }
  }
</script>

<meta name="theme-color" media="(prefers-color-scheme: light)" content="#e2e8f0">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#475569">

<div class="flex h-full flex-col">
  <div class="flex flex-row">
    <a class="h-full w-64 bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:dark:hover:bg-slate-500 xl:dark:active:bg-slate-400 text-2xl dark:text-white inline-flex items-center justify-center" href="./">Back</a>
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="matchNum" class="bg-inherit w-full text-center text-2xl cursor-text">Match Number</label>
      <input id="matchNum" type="number" class="bg-inherit w-full text-xl text-center focus:outline-none" bind:value={matchNum}>
    </div>
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="teamNum" class="bg-inherit w-full text-2xl text-center cursor-text">Team Number</label>
      <input id="teamNum" type="number" class="bg-inherit w-full text-xl text-center focus:outline-none" bind:value={teamNum}>
    </div>
  </div>
  <div class="flex flex-row h-full">
    {#if Object.keys($matches).length == 0}
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white">
      <div class="w-full h-3/6 inline-flex flex-col justify-center items-center border-b-2 border-gray-400 dark:border-slate-700">
        <p class="bg-inherit w-full text-center text-2xl">Manual Override</p>
        <p class="bg-inherit w-full text-center cursor-text">No Data Loaded</p>
      </div>
      <label for="name" class="w-full h-3/6 inline-flex flex-col justify-center items-center border-t-2 border-gray-400 dark:border-slate-700 cursor-text">
        <input id="name" type="text" class="bg-inherit w-full text-xl text-center focus:outline-none dark:text-white" placeholder="Enter Your Name" bind:value={name}>
      </label>
    </div>
    {:else if mode == "automatic"}
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="matchNum" class="bg-inherit w-full text-center cursor-text">Assigned Matches</label>
    </div>
    {:else}
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="name" class="bg-inherit w-full text-center cursor-text">Manual Override</label>
    </div>
    {/if}
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="matchNum" class="mb-16 xl:mb-4 bg-inherit w-full text-2xl text-center cursor-text">Alliance</label>
      <div class="mx-auto w-3/4 h-2/6 xl:h-64 rounded border-8 mb-8 cursor-pointer {alliance == 'b' ? 'border-blue-500 bg-blue-400' : 'border-blue-400 bg-blue-400'}" on:click="{setBlueAlliance}"></div>

      <div class="mx-auto w-3/4 h-2/6 xl:h-64 rounded border-8 cursor-pointer {alliance == 'r' ? 'border-red-500 bg-red-400' : 'border-red-400 bg-red-400'}" on:click="{setRedAlliance}"></div>
    </div>
  </div>
  <div class="flex flex-row h-24">
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="scoutId" class="bg-inherit w-full text-center cursor-text text-2xl">Scout ID</label>
      <input id="scoutId" type="number" class="bg-inherit w-full text-xl text-center focus:outline-none" bind:value={id} placeholder="##">
    </div>
    <button disabled={checkDisabled(alliance, name, matchNum, teamNum, id)} class="flex-col w-full h-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:dark:hover:bg-slate-500 xl:dark:active:bg-slate-400 text-2xl dark:text-white inline-flex items-center justify-center disabled:bg-gray-400 disabled:dark:bg-slate-700 disabled:hover:bg-gray-400 disabled:hover:dark:bg-slate-700 disabled:cursor-default" on:click={() => {goto(`/quant?match=${matchNum}&team=${teamNum}&alliance=${alliance}&id=${id}`)} }>
      <p class="">Proceed</p>
    </button>
  </div>
</div>