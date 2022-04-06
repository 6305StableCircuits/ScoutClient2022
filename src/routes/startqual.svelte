<script lang="ts">
  import { goto } from "$app/navigation";
import { Assignment, db } from "../db";
import { onMount } from "svelte";
import { names, qualAssignments } from "../stores";
import Error from "./__error.svelte";
  let matchNum: number;
  let teamNum1: number;
  let teamNum2: number;
  let teamNum3: number;
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

  function checkDisabled(alliance: "b" | "r" | "", name: string, matchNum: number, teamNum1: number, teamNum2: number, teamNum3: number, id: number): boolean {
    if (alliance === "" || name === "" || !matchNum || !teamNum1 || !teamNum2 || !teamNum3 || !id) {
      return true;
    }
    else {
      return false;
    }
  }
</script>

<meta name="theme-color" media="(prefers-color-scheme: light)" content="#9ca3af">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#334155">

<div class="flex h-full flex-col">
  <div class="flex flex-row">
    <a class="h-full w-64 bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:dark:hover:bg-slate-500 xl:dark:active:bg-slate-400 text-2xl dark:text-white inline-flex items-center justify-center" href="./scout">Back</a>
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      {#if mode == "automatic" && Object.keys($qualAssignments).length == 0}
      <label for="matchNum" class="bg-inherit w-full text-center text-2xl cursor-text">Match Number</label>
      <input id="matchNum" type="number" class="bg-inherit w-full h-full text-xl text-center focus:outline-none" bind:value={matchNum}>
      {:else}
      <button class="bg-inherit w-full h-full text-xl text-center">{matchNum ? "Match" + matchNum : "Match Number"}</button>
      {/if}
    </div>
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="matchNum" class="mb-4 bg-inherit w-full text-2xl text-center cursor-text">Alliance</label>
      <div class="flex flex-col xl:flex-row">
        <div class="mx-auto w-2/4 xl:w-64 h-14 xl:h-24 rounded border-8 mb-2 xl:mb-8 cursor-pointer {alliance == 'b' ? 'border-blue-500 bg-blue-400' : 'border-blue-400 bg-blue-400'}" on:click="{setBlueAlliance}"></div>
        <div class="mx-auto w-2/4 xl:w-64 h-14 xl:h-24 rounded border-8 mb-2 xl:mb-0 cursor-pointer {alliance == 'r' ? 'border-red-500 bg-red-400' : 'border-red-400 bg-red-400'}" on:click="{setRedAlliance}"></div>
      </div>
    </div>
  </div>
  <div class="flex flex-row h-full">
    {#if Object.keys($qualAssignments).length == 0}
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
      <div class="w-full h-3/6 inline-flex flex-col justify-center items-center border-b-2 border-gray-400 dark:border-slate-700">
        <p class="bg-inherit w-full text-center text-2xl">Automatic</p>
        <p class="bg-inherit w-full text-center cursor-text">Pick a match and name</p>
      </div>
    </div>
    {:else}
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <div class="w-full h-3/6 inline-flex flex-col justify-center items-center border-b-2 border-gray-400 dark:border-slate-700">
        <p class="bg-inherit w-full text-center text-2xl">Manual Override</p>
      </div>
      <label for="name" class="w-full h-3/6 inline-flex flex-col justify-center items-center border-t-2 border-gray-400 dark:border-slate-700 cursor-text">
        <input id="name" type="text" class="bg-inherit w-full text-xl text-center focus:outline-none dark:text-white" placeholder="Enter Your Name" bind:value={name}>
      </label>
    </div>
    {/if}
    <div class="w-full h-full">
      <div class="flex-col w-full h-1/3 bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
        <label for="teamNum1" class="bg-inherit w-full text-2xl text-center cursor-text">Team 1</label>
        <input id="teamNum1" type="number" class="bg-inherit w-full h-full text-xl text-center focus:outline-none" bind:value={teamNum1}>
      </div>
      <div class="flex-col w-full h-1/3 bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
        <label for="teamNum2" class="bg-inherit w-full text-2xl text-center cursor-text">Team 2</label>
        <input id="teamNum2" type="number" class="bg-inherit w-full h-full text-xl text-center focus:outline-none" bind:value={teamNum2}>
      </div>
      <div class="flex-col w-full h-1/3 bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
        <label for="teamNum3" class="bg-inherit w-full text-2xl text-center cursor-text">Team 3</label>
        <input id="teamNum3" type="number" class="bg-inherit w-full h-full text-xl text-center focus:outline-none" bind:value={teamNum3}>
      </div>
    </div>
  </div>
  <div class="flex flex-row h-24">
    <div class="flex-col w-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 dark:text-white focus-within:border-gray-500 dark:focus-within:border-slate-800 inline-flex">
      <label for="scoutId" class="bg-inherit w-full text-center cursor-text text-2xl">Scout ID</label>
      <input id="scoutId" type="number" class="bg-inherit w-full text-xl text-center focus:outline-none" bind:value={id} placeholder="##">
    </div>
    <button disabled={checkDisabled(alliance, name, matchNum, teamNum1, teamNum2, teamNum3, id)} class="flex-col w-full h-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-4 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:dark:hover:bg-slate-500 xl:dark:active:bg-slate-400 text-2xl dark:text-white inline-flex items-center justify-center disabled:bg-gray-400 disabled:dark:bg-slate-700 disabled:hover:bg-gray-400 disabled:hover:dark:bg-slate-700 disabled:cursor-default" on:click={() => {goto(`/qual?match=${matchNum}&team1=${teamNum1}&team2=${teamNum2}&team3=${teamNum3}&alliance=${alliance}&id=${id}`)} }>
      <p class="">Proceed</p>
    </button>
  </div>
</div>