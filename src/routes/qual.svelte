<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { db, QualitativeData, QuantitativeData, Result } from "../db";
  import { modal } from "../stores";
  import Modal from "./Modal.svelte";
  
  
    let notes: boolean = false;    
    const URLParams = new URLSearchParams($page.url.searchParams);
    const team1ID = parseInt(URLParams.get("team1"));
    const team2ID = parseInt(URLParams.get("team2"));
    const team3ID = parseInt(URLParams.get("team3"));
    
    let team1 = {id: team1ID, driverSkill: 0, sturdiness: 0, compatibility: 0, notes: ""};
    let team2 = {id: team2ID, driverSkill: 0, sturdiness: 0, compatibility: 0, notes: ""};
    let team3 = {id: team3ID, driverSkill: 0, sturdiness: 0, compatibility: 0, notes: ""};

    const teams = [team1, team2, team3];
    const match = parseInt(URLParams.get("match"));
    const alliance = URLParams.get("alliance");
    const id = parseInt(URLParams.get("id"));
  
    if (team1ID === null || team2ID === null || team3ID === null || match === null) {
      goto('/');
    }
    
    function incrementSkill(team: number) {
      teams[team].driverSkill += (teams[team].driverSkill < 10 ? 1 : 0);
    }

    function deincrementSkill(team: number) {
      teams[team].driverSkill -= (teams[team].driverSkill > 0 ? 1 : 0);
    }

    function incrementSturdiness(team: number) {
      teams[team].sturdiness += (teams[team].sturdiness < 10 ? 1 : 0);
    }

    function deincrementSturdiness(team: number) {
      teams[team].sturdiness -= (teams[team].sturdiness > 0 ? 1 : 0);
    }

    function incrementCompatibility(team: number) {
      teams[team].compatibility += (teams[team].compatibility < 10 ? 1 : 0);
    }

    function deincrementCompatibility(team: number) {
      teams[team].compatibility -= (teams[team].compatibility > 0 ? 1 : 0);
    }

    function toggleNotes() {
      notes = !notes;
    }
  
    function save() {
      const matchResult1: Result = {
        type: 'qual',
        id: id,
        matchNum: match,
        team: team1.id,
        data: {
          alliance: (alliance as 'b' | 'r'),
          driverSkill: team1.driverSkill,
          sturdiness: team1.sturdiness,
          compatibility: team1.compatibility,
          notes: team1.notes
        }
      }

      const matchResult2: Result = {
        type: 'qual',
        id: id,
        matchNum: match,
        team: team2.id,
        data: {
          alliance: (alliance as 'b' | 'r'),
          driverSkill: team2.driverSkill,
          sturdiness: team2.sturdiness,
          compatibility: team2.compatibility,
          notes: team2.notes
        }
      }
      const matchResult3: Result = {
        type: 'qual',
        id: id,
        matchNum: match,
        team: team3.id,
        data: {
          alliance: (alliance as 'b' | 'r'),
          driverSkill: team3.driverSkill,
          sturdiness: team3.sturdiness,
          compatibility: team3.compatibility,
          notes: team3.notes
        }
      }
  
      db.results.add(matchResult1).then(r => {
        db.results.add(matchResult2).then(r => {
          db.results.add(matchResult3).then(r => {
            goto('/');
          })
          .catch(e => {console.log(e)})
        })
        .catch(e => {console.log(e)})
      })
      .catch(e => {console.log(e)})
    }
  </script>
  <svelte:head>
    <meta name="theme-color" content="#14b8a6">
  </svelte:head>
  
  
  <div class="flex h-full flex-col items-center dark:bg-slate-700">
    <div class="flex flex-row w-full h-12 justify-center items-center bg-teal-500">
      <p class="text-xl text-white font-bold">Superscout</p>
    </div>
    {#each teams as team, i}
    <h1 class="text-center text-xl dark:text-white my-1">{team.id}</h1>
    {#if notes}
    <textarea class="w-[91.6%] h-32 p-2 resize-none rounded border-4 bg-gray-100 border-gray-300 dark:text-white dark:bg-slate-800 dark:border-slate-900 focus:outline-none focus:border-gray-500 focus:dark:border-black" bind:value={team.notes}></textarea>
    {:else}
    <div class="flex flex-row w-full items-center justify-center">
      <div class="w-4/12 flex flex-col items-center justify-center">
        <div class="w-3/4">
          <button class="w-full h-8 rounded-t bg-green-300 border-4 border-green-500 xl:hover:bg-green-400 active:bg-green-500" on:click={() => {incrementSkill(i)}}>+</button>
          <div class="w-full h-16 bg-purple-300 border-4 border-purple-500">
            <h1 class="text-base xl:text-xl text-center">Driver Skill</h1>
            <h1 class="text-lg text-center">{team.driverSkill}</h1>
          </div>
          <button class="w-full h-8 rounded-b bg-red-300 border-4 border-red-500 xl:hover:bg-red-400 active:bg-red-500" on:click={() => {deincrementSkill(i)}}>-</button>
        </div>
      </div>
      <div class="w-4/12 flex items-center justify-center">
        <div class="w-3/4">
          <button class="w-full h-8 rounded-t bg-green-300 border-4 border-green-500 xl:hover:bg-green-400 active:bg-green-500" on:click={() => {incrementSturdiness(i)}}>+</button>
          <div class="w-full h-16 bg-amber-300 border-4 border-amber-500">
            <h1 class="text-base xl:text-xl text-center">Sturdiness</h1>
            <h1 class="text-lg text-center">{team.sturdiness}</h1>
          </div>
          <button class="w-full h-8 rounded-b bg-red-300 border-4 border-red-500 xl:hover:bg-red-400 active:bg-red-500" on:click={() => {deincrementSturdiness(i)}}>-</button>
        </div>
      </div>
      <div class="w-4/12 flex items-center justify-center">
        <div class="w-3/4">
          <button class="w-full h-8 rounded-t bg-green-300 border-4 border-green-500 xl:green:bg-yellow-400 active:bg-green-500" on:click={() => {incrementCompatibility(i)}}>+</button>
          <div class="w-full h-16 bg-sky-300 border-4 border-sky-500">
            <h1 class="text-base xl:text-xl text-center">Compat</h1>
            <h1 class="text-lg text-center">{team.compatibility}</h1>
          </div>
          <button class="w-full h-8 rounded-b bg-red-300 border-4 border-red-500 xl:hover:bg-red-400 active:bg-red-500" on:click={() => {deincrementCompatibility(i)}}>-</button>
        </div>
      </div>
    </div>
    {/if}
    {/each}
    <div class="flex flex-row w-full items-center justify-center mt-4">
      <button class="w-[91.6%] h-16 text-2xl rounded bg-indigo-300 border-4 border-indigo-500 xl:hover:bg-indigo-400 active:bg-indigo-500" on:click={toggleNotes}>{notes ? "Attributes" : "Notes"}</button>
    </div>
    <div class="flex flex-row w-full items-center justify-center mt-4">
      <button class="w-[91.6%] h-16 text-2xl rounded bg-green-300 border-4 border-green-500 xl:hover:bg-green-400 active:bg-green-500" on:click={async () => {await save()}}>Save</button>
    </div>
  </div>