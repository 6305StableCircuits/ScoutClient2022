<script lang="ts">
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { db, QuantitativeData, Result } from "../db";
import { modal } from "../stores";
import Modal from "./Modal.svelte";


  let cmode: "Autonomous" | "Teleoperated" = "Autonomous";
  let autoLeave: boolean = false;
  let autoLow: number = 0;
  let autoHigh: number = 0;
  let teleopLow: number = 0;
  let teleopHigh: number = 0;
  let rung: -1 | 0 | 1 | 2 | 3 | 4 = -1;
  let fouls: number = 0;
  let techFouls: number = 0;
  let lastAction: Array<string> = [];
  let undone: Array<string> = [];
  let incapacitatedTime: number = -1;
    
  const URLParams = new URLSearchParams($page.url.searchParams);
  const team = parseInt(URLParams.get("team"));
  const match = parseInt(URLParams.get("match"));
  const alliance = URLParams.get("alliance");
  const id = parseInt(URLParams.get("id"));

  if (team === null || match === null) {
    goto('/');
  }
  
  function toggleLeave(undo=false, redo=false) {
    autoLeave = !autoLeave;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "toggleLeave"];
    }
    else {
      lastAction = [...lastAction, "toggleLeave"];
    }
  }

  function incrementALow(undo=false, redo=false) {
    autoLow++;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "deincrementALow"];
    }
    else {
      lastAction = [...lastAction, "incrementALow"];
    }
  }

  function deincrementALow(undo=false, redo=false) {
    autoLow--;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "incrementALow"];
    }
    else {
      lastAction = [...lastAction, "deincrementALow"];
    }
  }

  function incrementAHigh(undo=false, redo=false) {
    autoHigh++;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "deincrementAHigh"];
    }
    else {
      lastAction = [...lastAction, "incrementAHigh"];
    }
  }

  function deincrementAHigh(undo=false, redo=false) {
    autoHigh--;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "incrementAHigh"];
    }
    else {
      lastAction = [...lastAction, "deincrementAHigh"];
    }
  }
  
  function incrementTLow(undo=false, redo=false) {
    teleopLow++;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "deincrementTLow"];
    }
    else {
      lastAction = [...lastAction, "incrementTLow"];
    }
  }

  function deincrementTLow(undo=false, redo=false) {
    teleopLow--;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "incrementTLow"];
    }
    else {
      lastAction = [...lastAction, "deincrementTLow"];
    }
  }

  function incrementTHigh(undo=false, redo=false) {
    teleopHigh++;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "deincrementTHigh"];
    }
    else {
      lastAction = [...lastAction, "incrementTHigh"];
    }
  }

  function deincrementTHigh(undo=false, redo=false) {
    teleopHigh--;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "incrementTHigh"];
    }
    else {
      lastAction = [...lastAction, "deincrementTHigh"];
    }
  }

  function incrementFouls(undo=false, redo=false) {
    fouls++;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "deincrementFouls"];
    }
    else {
      lastAction = [...lastAction, "incrementFouls"];
    }
  }

  function deincrementFouls(undo=false, redo=false) {
    fouls--;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "incrementFouls"];
    }
    else {
      lastAction = [...lastAction, "deincrementFouls"];
    }
  }

  function incrementTechFouls(undo=false, redo=false) {
    techFouls++;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "deincrementTechFouls"];
    }
    else {
      lastAction = [...lastAction, "incrementTechFouls"];
    }
  }

  function deincrementTechFouls(undo=false, redo=false) {
    techFouls--;
    if (!redo && !undo) {
      undone = [];
    }
    if (undo) {
      undone = [...undone, "incrementTechFouls"];
    }
    else {
      lastAction = [...lastAction, "deincrementTechFouls"];
    }
  }

  function setClimb(undo=false, redo=false, num: -1 | 0 | 1 | 2 | 3 | 4) {
    rung = num;
    if (!redo && !undo) {
      modal.set("");
      undone = [];
    }
    if (!undo) {
      lastAction = [...lastAction, `setClimb${num}`];
    }
  }

  function setIncap(undo=false, redo=false, num: number) {
    if (!undo) {
      lastAction = [...lastAction, `setIncap${incapacitatedTime}`];
    }
    else {
      undone = [...undone, `setIncap${incapacitatedTime}`];
    }
    incapacitatedTime = num;
    if (!redo && !undo) {
      modal.set("");
      undone = [];
    }
  }

  function toTeleop() {
    lastAction = [];
    undone = [];
    cmode = "Teleoperated";
  }

  function undo() {
    if (lastAction.length !== 0) {
      let action = lastAction[lastAction.length-1]
      switch (action) {
        case "toggleLeave":
          toggleLeave(true, false);
          break;
          case "incrementALow":
          deincrementALow(true, false);
          break;
        case "deincrementALow":
          incrementALow(true, false);
          break;
        case "incrementAHigh":
          deincrementAHigh(true, false);
          break;
        case "deincrementAHigh":
          incrementAHigh(true, false);
          break;
        case "incrementTLow":
          deincrementTLow(true, false);
          break;
        case "deincrementTLow":
          incrementTLow(true, false);
          break;
        case "incrementTHigh":
          deincrementTHigh(true, false);
          break;
        case "deincrementTHigh":
          incrementTHigh(true, false);
          break;
        case "incrementFouls":
          deincrementFouls(true, false);
          break;
        case "deincrementFouls":
          incrementFouls(true, false);
          break;
        case "incrementTechFouls":
          deincrementTechFouls(true, false);
          break;
        case "deincrementTechFouls":
          incrementTechFouls(true, false);
          break;
        case "setClimb-1":
          setClimb(true, false, -1);
          undone = [...undone, `setClimb-1`];
          break;
        case "setClimb0":
          setClimb(true, false, -1);
          undone = [...undone, `setClimb0`];
          break;
        case "setClimb1":
          setClimb(true, false, -1);
          undone = [...undone, `setClimb1`];
          break;
        case "setClimb2":
          setClimb(true, false, -1);
          undone = [...undone, `setClimb2`];
          break;
        case "setClimb3":
          setClimb(true, false, -1);
          undone = [...undone, `setClimb3`];
          break;
        case "setClimb4":
          setClimb(true, false, -1);
          undone = [...undone, `setClimb4`];
          break;
        case "setIncap90":
          setIncap(true, false, 90);
          break;
        case "setIncap60":
          setIncap(true, false, 60);
          break;
        case "setIncap30":
          setIncap(true, false, 30);
          break;
        case "setIncap15":
          setIncap(true, false, 15);
          break;
        case "setIncap0":
          setIncap(true, false, 0);
          break;
        case "setIncap-1":
          setIncap(true, false, -1);
          break;
      }
      lastAction.pop();
      lastAction = lastAction;
    }
  }

  function redo() {
    if (undone.length !== 0) {
      let action = undone[undone.length-1];
      switch (action) {
        case "toggleLeave":
          toggleLeave(false, true);
          break;
          case "incrementALow":
          incrementALow(false, true);
          break;
        case "deincrementALow":
          deincrementALow(false, true);
          break;
        case "incrementAHigh":
          incrementAHigh(false, true);
          break;
        case "deincrementAHigh":
          deincrementAHigh(false, true);
          break;
        case "incrementTLow":
          incrementTLow(false, true);
          break;
        case "deincrementTLow":
          deincrementTLow(false, true);
          break;
        case "incrementTHigh":
          incrementTHigh(false, true);
          break;
        case "deincrementTHigh":
          deincrementTHigh(false, true);
          break;
        case "incrementFouls":
          incrementFouls(false, true);
          break;
        case "deincrementFouls":
          deincrementFouls(false, true);
          break;
        case "incrementTechFouls":
          incrementTechFouls(false, true);
          break;
        case "deincrementTechFouls":
          deincrementTechFouls(false, true);
          break;
        case "setClimb-1":
          setClimb(false, true, -1);
          break;
        case "setClimb0":
          setClimb(false, true, 0);
          break;
        case "setClimb1":
          setClimb(false, true, 1);
          break;
        case "setClimb2":
          setClimb(false, true, 2);
          break;
        case "setClimb3":
          setClimb(false, true, 3);
          break;
        case "setClimb4":
          setClimb(false, true, 4);
          break;
        case "setIncap90":
          setIncap(false, true, 90);
          break;
        case "setIncap60":
          setIncap(false, true, 60);
          break;
        case "setIncap30":
          setIncap(false, true, 30);
          break;
        case "setIncap15":
          setIncap(false, true, 15);
          break;
        case "setIncap0":
          setIncap(false, true, 0);
          break;
        case "setIncap-1":
          setIncap(false, true, -1);
          break;
      }
      undone.pop();
      undone = undone;
    }
  }

  function save() {
    const data: QuantitativeData = {
      alliance: (alliance as 'b' | 'r'),
      autoLeave: autoLeave,
      autoLow: autoLow,
      autoHigh: autoHigh,
      teleopLow: teleopLow,
      teleopHigh: teleopHigh,
      rung: rung,
      fouls: fouls,
      techFouls: techFouls,
      incap: incapacitatedTime
    }

    const matchResult: Result = {
      id: id,
      matchNum: match,
      team: team,
      data: data
    }

    db.results.add(matchResult).then(r => {
      goto('/');
    })
    .catch(e => {console.log(e)})
  }
</script>
<svelte:head>
  {#if cmode == "Autonomous"}
  <meta name="theme-color" content="#3b82f6">
  {:else}
  <meta name="theme-color" content="#a855f7">
  {/if}
</svelte:head>
{#if $modal=="climb"}
<Modal>
  <p class="text-2xl text-center dark:text-white">Hang Attempt</p>
  <button class="w-full h-16 mt-5 text-2xl rounded-t bg-purple-300 border-4 border-purple-500 xl:hover:bg-purple-400 active:bg-purple-500" on:click={() => {setClimb(false, false, 4)}}>Transversal</button>
  <button class="w-full h-16 text-2xl bg-cyan-300 border-4 border-cyan-500 xl:hover:bg-cyan-400 active:bg-cyan-500" on:click={() => {setClimb(false, false, 3)}}>High</button>
  <button class="w-full h-16 text-2xl bg-lime-300 border-4 border-lime-500 xl:hover:bg-lime-400 active:bg-lime-500" on:click={() => {setClimb(false, false, 2)}}>Medium</button>
  <button class="w-full h-16 text-2xl bg-amber-300 border-4 border-amber-500 xl:hover:bg-amber-400 active:bg-amber-500" on:click={() => {setClimb(false, false, 1)}}>Low</button>
  <button class="w-full h-16 text-2xl rounded-b bg-red-300 border-4 border-red-500 xl:hover:bg-red-400 active:bg-red-500" on:click={() => {setClimb(false, false, 0)}}>Big Fail So Sad</button>
  <button class="w-full h-16 mt-5 text-2xl rounded bg-rose-300 border-4 border-rose-500 xl:hover:bg-rose-400 active:bg-rose-500" on:click={() => {modal.set("")}}>Cancel</button>
</Modal>
{/if}

{#if $modal=="incapacitated"}
<Modal>
  <p class="text-2xl text-center dark:text-white">Total Time Incapacitated</p>
  <button class="w-full h-16 mt-5 text-2xl rounded-t bg-cyan-300 border-4 border-cyan-500 xl:hover:bg-cyan-400 active:bg-cyan-500" on:click={() => {setIncap(false, false, 90)}}>1 min 30 seconds +</button>
  <button class="w-full h-16 text-2xl bg-cyan-300 border-4 border-cyan-500 xl:hover:bg-cyan-400 active:bg-cyan-500" on:click={() => {setIncap(false, false, 60)}}>1 minute +</button>
  <button class="w-full h-16 text-2xl bg-cyan-300 border-4 border-cyan-500 xl:hover:bg-cyan-400 active:bg-cyan-500" on:click={() => {setIncap(false, false, 30)}}>30 seconds +</button>
  <button class="w-full h-16 text-2xl bg-cyan-300 border-4 border-cyan-500 xl:hover:bg-cyan-400 active:bg-cyan-500" on:click={() => {setIncap(false, false, 15)}}>15 seconds +</button>
  <button class="w-full h-16 text-2xl rounded-b bg-cyan-300 border-4 border-cyan-500 xl:hover:bg-cyan-400 active:bg-cyan-500" on:click={() => {setIncap(false, false, 0)}}>{"< 15 seconds"}</button>
  <button class="w-full h-16 mt-5 text-2xl rounded bg-rose-300 border-4 border-rose-500 xl:hover:bg-rose-400 active:bg-rose-500" on:click={() => {modal.set("")}}>Cancel</button>
</Modal>
{/if}


<div class="flex h-full flex-col items-center dark:bg-slate-700">
  <div class="flex flex-row w-full h-16 justify-center items-center {cmode === "Autonomous" ? "bg-blue-500" : "bg-purple-500"}">
    <p class="text-xl text-white font-bold">{cmode} | Match {match} | Team {team}</p>
  </div>
  <div class="flex flex-row w-full my-8">
    <div class="w-6/12 flex items-center justify-center">
      <button disabled={lastAction.length === 0} class="w-3/4 h-16 text-2xl rounded bg-red-300 border-4 border-red-500 xl:hover:bg-red-400 active:bg-red-500 disabled:bg-gray-300 disabled:border-gray-500 disabled:xl:hover:bg-gray-300 disabled:active:bg-gray-300" on:click={undo}>Undo</button>
    </div>
    <div class="w-6/12 flex items-center justify-center">
      <button disabled={undone.length === 0} class="w-3/4 h-16 text-2xl rounded bg-green-300 border-4 border-green-500 xl:hover:bg-green-400 active:bg-green-500 disabled:bg-gray-300 disabled:border-gray-500 disabled:xl:hover:bg-gray-300 disabled:active:bg-gray-300" on:click={redo}>Redo</button>
    </div>
  </div>
  <div class="flex flex-row w-full">
    <div class="w-6/12 flex items-center justify-center">
      {#if cmode == "Autonomous"}
      <button class="w-3/4 h-64 rounded bg-yellow-300 border-4 border-yellow-500 xl:hover:bg-yellow-400 active:bg-yellow-500" on:click={() => {incrementALow()}}>
        <p class="text-2xl">Low Goal</p>
        <p class="text-xl">{autoLow}</p>
      </button>
      {:else}
      <button class="w-3/4 h-64 rounded bg-yellow-300 border-4 border-yellow-500 xl:hover:bg-yellow-400 active:bg-yellow-500" on:click={() => {incrementTLow()}}>
        <p class="text-2xl">Low Goal</p>
        <p class="text-xl">{teleopLow}</p>
      </button>
      {/if}
    </div>
    <div class="w-6/12 flex items-center justify-center">
      {#if cmode == "Autonomous"}
      <button class="w-3/4 h-64 rounded bg-yellow-300 border-4 border-yellow-500 xl:hover:bg-yellow-400 active:bg-yellow-500" on:click={() => {incrementAHigh()}}>
        <p class="text-2xl">High Goal</p>
        <p class="text-xl">{autoHigh}</p>
      </button>
      {:else}
      <button class="w-3/4 h-64 rounded bg-yellow-300 border-4 border-yellow-500 xl:hover:bg-yellow-400 active:bg-yellow-500" on:click={() => {incrementTHigh()}}>
        <p class="text-2xl">High Goal</p>
        <p class="text-xl">{teleopHigh}</p>
      </button>
      {/if}
    </div>
  </div>
  <div class="flex flex-row w-full my-8">
    <div class="w-6/12 flex items-center justify-center">
      {#if cmode == "Autonomous"}
      <button class="w-3/4 h-16 text-2xl rounded {autoLeave ? 'bg-green-300 border-4 border-green-500 xl:hover:bg-green-400 active:bg-green-500' : 'bg-red-300 border-4 border-red-500 xl:hover:bg-red-400 active:bg-red-500'}" on:click={() => {toggleLeave()}}>Exited Hub</button>
      {:else}
        {#if rung === -1}
        <button class="w-3/4 h-16 text-2xl rounded bg-fuchsia-300 border-4 border-fuchsia-500 xl:hover:bg-fuchsia-400 active:bg-fuchsia-500" on:click={() => {modal.set("climb")}}>Climb</button>
        {:else}
        <button disabled class="w-3/4 h-16 text-2xl rounded bg-gray-300 border-4 border-gray-500 xl:hover:bg-gray-400 active:bg-gray-500">Climb - {rung}</button>
        {/if}
      {/if}
    </div>
    <div class="w-6/12 flex items-center justify-center">
      <button class="w-3/4 h-16 text-2xl rounded {incapacitatedTime === -1 ? 'bg-cyan-300 border-4 border-cyan-500 xl:hover:bg-cyan-400 active:bg-cyan-500' : 'bg-blue-300 border-4 border-blue-500 xl:hover:bg-blue-400 active:bg-blue-500'}" on:click={() => {modal.set("incapacitated")}}>
        <p>Incap Time</p>
        <p class="text-lg">{ incapacitatedTime > -1 ? (incapacitatedTime > 0 ? `${incapacitatedTime}+` : `< ${incapacitatedTime + 15}`) : ""}</p>
      </button>
    </div>
  </div>
  <div class="flex flex-row w-full mb-8">
    <div class="w-6/12 flex items-center justify-center">
      <button class="w-3/4 h-16 text-2xl rounded bg-orange-300 border-4 border-orange-500 xl:hover:bg-orange-400 active:bg-orange-500" on:click={() => {incrementFouls()}}>
        <p>Foul</p>
        <p class="text-lg">{fouls}</p>
      </button>
    </div>
    <div class="w-6/12 flex items-center justify-center">
      <button class="w-3/4 h-16 text-2xl rounded bg-orange-300 border-4 border-orange-500 xl:hover:bg-orange-400 active:bg-orange-500" on:click={() => {incrementTechFouls()}}>
        <p>Tech Foul</p>
        <p class="text-lg">{techFouls}</p>
      </button>
    </div>
  </div>
  <div class="flex flex-row w-full items-center justify-center mb-8">
    {#if cmode == "Autonomous"}
    <button class="w-[87.3%] h-16 text-2xl rounded bg-purple-300 border-4 border-purple-500 xl:hover:bg-purple-400 active:bg-purple-500" on:click={() => {toTeleop()}}>To Teleoperated</button>
    {:else}
    <button class="w-[87.3%] h-16 text-2xl rounded bg-green-300 border-4 border-green-500 xl:hover:bg-green-400 active:bg-green-500" on:click={async () => {await save()}}>Save</button>
    {/if}
  </div>
</div>