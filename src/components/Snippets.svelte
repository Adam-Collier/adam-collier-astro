<script>
  import { searchValue } from '../stores/input'
  export let snippets

  $: filteredSnippets = snippets.filter((snippet) => {
    return snippet.title.toLowerCase().includes($searchValue.toLowerCase())
  })
</script>

{#if filteredSnippets.length}
  {#each filteredSnippets as { id, title, code, updatedAt } (id)}
    <div
      class=" flex flex-col bg-black/60 shadow-[0_0_1px_rgb(255,255,255,0.3)] text-white rounded-lg overflow-hidden"
    >
      <p
        class="bg-black/25 py-3 px-4 font-mono font-regular text-xs text-gray-300"
      >
        {title}
      </p>
      <pre class="p-4 grow-1">
            {@html code}
        </pre>
      <small
        class="bg-black/15 py-3 px-4 font-mono font-regular text-xs text-white/35"
      >
        {updatedAt}
      </small>
    </div>
  {/each}
{:else}
  <div class="flex justify-center items-center p-8">
    <p>Oh no! There's no resources with that name</p>
  </div>
{/if}
