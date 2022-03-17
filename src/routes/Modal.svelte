<script lang="ts">
  import { modal } from "../stores";
  export let title = "Modal title goes here.."
</script>

<div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex " on:click={() => {modal.set("")}}>
  <div class="relative w-3/4 my-6 mx-auto max-w-3xl" on:click|stopPropagation>
    <!--content-->
    <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-800 outline-none focus:outline-none">
      <!--body-->
      <div class="relative p-6 flex-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</div>
<div class="opacity-25 fixed inset-0 z-40 bg-black"></div>