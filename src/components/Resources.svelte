<script>
  import { searchValue } from '../stores/input'
  export let resources

  $: filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().startsWith($searchValue.toLowerCase()),
  )

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
</script>

{#if filteredResources.length}
  <div
    class="relative w-full grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  >
    {#each filteredResources as { url, image, title, content, createdAt, id } (id)}
      <a
        href={url}
        rel="prefetch"
        target="_blank"
        class="w-full bg-gradient-to-br from-white/25 to-white/15 hover:bg-white/25 flex flex-col gap-4 block p-2 sm:p-4 border-gray-200 rounded-md"
      >
        {#if image}
          <div class="w-full">
            <img
              src={image.src}
              class="w-full rounded-md shadow-[inset_0_0_0_1px_rgb(255,255,255)] aspect-800/418 object-cover opacity-75"
              alt="resource"
              width={600}
              aspectRatio="800:418"
            />
          </div>
        {:else}
          <div class="aspect-800/418 bg-white/40 rounded-md w-full" />
        {/if}
        <div class="flex flex-col gap-1 flex-grow">
          <p class="text-md">{title}</p>
          <div class="flex flex-col gap-2 flex-grow">
            <span class="leading-5 font-regular text-sm">
              {@html content}
            </span>
            <span class="text-xs text-gray-500 block mt-auto">
              Created: {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </a>
    {/each}
    <!-- <div
      class="absolute inset-0 shadow-[inset_0_0_0_1px_rgb(249,250,251)] pointer-events-none"
    /> -->
  </div>
{:else}
  <div class="flex justify-center items-center p-8">
    <p>Oh no! There's no resources with that name</p>
  </div>
{/if}
