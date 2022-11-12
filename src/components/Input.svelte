<script>
  import { searchValue } from '../stores/input'
  export let placeholder
</script>

<input
  class="outline-none grow-1 bg-transparent pt-1"
  type="text"
  {placeholder}
  bind:value={$searchValue}
/>
