<script>
  import { searchValue } from '../stores/input'
  export let placeholder
</script>

<input
  class="outline-none bg-white/20 text-current px-3 py-2 rounded-md text-sm shadow-[inset_0_0_0_1px_rgb(255,255,255,0.15)] w-75"
  type="text"
  {placeholder}
  bind:value={$searchValue}
/>
