<script>
  export let latestFilms
  let currentFilmSelection = 0
  let showRating = false

  $: ({ link, title, src, year, rating, description } =
    latestFilms[currentFilmSelection])
</script>

<section class="flex flex-col gap-16 items-center">
  <section
    class="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 w-full children:w-full items-start px-4"
  >
    <div class="flex flex-col md:flex-row items-start gap-4 md:gap-15">
      <div
        class="flex justify-center items-center relative shrink-0 w-full md:w-2/5 p-8 md:p-0 aspect-1/1 md:aspect-2/3 overflow-hidden md:overflow-visible rounded-lg shadow-inner md:shadow-none"
      >
        <img
          {src}
          loading="lazy"
          alt={title}
          class="absolute top-0 left-0 md:top-4 md:-left-16 w-full md:w-9/10 h-full object-cover rounded blur-25 md:blur-40 -z-1 scale-120 md:scale-100"
        />

        <a
          href={link}
          aria-label={`${title} film`}
          class="h-auto w-auto max-w-full max-h-full aspect-2/3"
        >
          <img
            {src}
            loading="lazy"
            alt={title}
            class="h-auto w-auto max-w-full max-h-full aspect-2/3 rounded-md shadow-lg"
          />
        </a>
      </div>

      <div class="flex flex-col items-stretch self-stretch">
        <h2 class="text-md md:text-lg font-semibold">
          {title}
        </h2>
        <p class="text-gray-300 text-sm md:text-md">{year}</p>
        <div class="flex items-center gap-4">
          {#if showRating}
            <span class="w-[80px]">{rating}</span>
            <button
              class="text-sm py-2 px-3 bg-gray-50 rounded"
              on:click={() => (showRating = false)}
            >
              Hide my rating</button
            >
          {:else}
            <span class="w-[80px]">☆☆☆☆☆</span>
            <button
              class="text-sm py-2 px-3 bg-gray-50 rounded"
              on:click={() => (showRating = true)}
            >
              Show my rating</button
            >
          {/if}
        </div>
        <p
          class="mt-2 text-sm md:text-md text-clamp-05 md:text-clamp-30 leading-normal"
        >
          {@html description}
        </p>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-3 md:gap-4 w-full mx-auto">
      {#each latestFilms as { title, src }, i}
        <div
          class="block overflow-hidden rounded relative w-full cursor-pointer transition-bounce active:scale-98 {currentFilmSelection ===
          i
            ? 'shadow-letterboxd shadow-md'
            : ''}"
          aria-label={`${title} film`}
          on:click={() => ((currentFilmSelection = i), (showRating = false))}
        >
          <div class="block pt-[150%]" />
          <img
            {src}
            loading="lazy"
            alt={title}
            class="absolute top-0 left-0 w-full h-full object-cover shadow-inner"
          />
        </div>
      {/each}
    </div>
  </section>
</section>
