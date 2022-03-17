<script context="module">
export function load({ error, status }) {
  return {
    props: {
      title: `${status}: ${error.message}`
    }
  };
}
</script>
  
<script>
  export let title;
</script>
  
<h1 class="dark:text-white">{title}</h1>
  