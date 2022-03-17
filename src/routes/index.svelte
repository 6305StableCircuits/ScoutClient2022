<svelte:head>
  <title>Home - Stable Scout</title>
</svelte:head>

<script lang="ts">
import { db } from "../db";

  if (typeof window !== 'undefined') {
	  db.results.count().then(a => {console.log(a)})
  }
</script>

<meta name="theme-color" media="(prefers-color-scheme: light)" content="#e2e8f0">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#475569">

<div class="flex h-full flex-col xl:flex-row"> 
  <a class="w-full h-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-2 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:hover:dark:bg-slate-500 xl:active:dark:bg-slate-400  text-xl dark:text-white inline-flex items-center justify-center" href="./scan">Scan Match Roster</a>
  <a class="w-full h-full xl:h-full bg-gray-200 border-gray-400 dark:bg-slate-600 border-2 dark:border-slate-700 xl:hover:bg-gray-300 active:bg-gray-400 xl:hover:dark:bg-slate-500 xl:active:dark:bg-slate-400  text-xl dark:text-white inline-flex items-center justify-center" href="./scout">Scout</a>
</div>