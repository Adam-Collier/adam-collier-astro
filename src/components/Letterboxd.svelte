<script>
  export let latestFilms
  let currentFilmSelection = 0
  let showRating = false

  $: ({ link, title, src, year, rating, description } =
    latestFilms[currentFilmSelection])
</script>

<section class="flex flex-col gap-16 items-center">
  <!-- letterboxd icon -->
  <div class="flex flex-col gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 110" class="h-18">
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(31 41)">
          <ellipse fill="#40BCF4" cx="79.21" cy="18" rx="18.027" ry="18" />
          <ellipse fill="#00E054" cx="48.619" cy="18" rx="18.027" ry="18" />
          <ellipse fill="#FF8000" cx="18.027" cy="18" rx="18.027" ry="18" />
          <path
            d="M33.323 27.53A17.896 17.896 0 0 1 30.59 18c0-3.5 1-6.767 2.732-9.53A17.896 17.896 0 0 1 36.054 18c0 3.5-1 6.767-2.731 9.53ZM63.914 8.47A17.896 17.896 0 0 1 66.646 18c0 3.5-1 6.767-2.732 9.53A17.896 17.896 0 0 1 61.183 18c0-3.5 1-6.767 2.731-9.53Z"
            fill="#567"
          />
        </g>
        <path
          d="M241.044 41.849c1.277 0 2.148-.117 3.309-.352 2.148-.292 2.96-1.23 3.308-4.101.174-1.407.29-2.638.349-4.044h8.706v8.497h8.01v9.435h-8.01v8.145c0 5.86.871 6.504 5.863 6.504h2.148v9.903h-5.34c-10.159 0-12.654-3.691-12.654-14.297V51.284H232.71v8.145c0 5.86.87 6.504 5.862 6.504h2.148v9.903h-5.34c-10.158 0-12.653-3.691-12.653-14.297V51.284h-5.689v-8.85c1.277 0 2.147-.116 3.308-.35 2.148-.293 2.961-1.231 3.309-4.103.174-1.406.29-3.223.348-4.63h8.708v8.498h8.333ZM150 33.821h10.913v31.527h17.471v10.488H150V33.821Zm48.465 42.894c-11.667 0-17.123-6.562-17.123-17.052v-.996c0-10.899 6.791-17.52 17.297-17.52 11.9 0 16.95 7.793 16.95 16.993v3.809h-23.74c.52 4.101 2.843 6.328 6.906 6.328 2.96 0 4.586-1.289 5.398-3.222h11.203c-1.857 7.148-7.081 11.66-16.891 11.66Zm-6.617-21.447h13.293c-.465-3.809-2.438-6.036-6.386-6.036-3.947 0-6.21 2.052-6.907 6.036Zm92.554 21.447c-11.666 0-17.123-6.562-17.123-17.052v-.996c0-10.899 6.791-17.52 17.297-17.52 11.9 0 16.95 7.793 16.95 16.993v3.809h-23.74c.522 4.101 2.843 6.328 6.906 6.328 2.961 0 4.586-1.289 5.399-3.222h11.202c-1.857 7.148-7.081 11.66-16.89 11.66Zm-6.617-21.447h13.293c-.465-3.809-2.438-6.036-6.386-6.036-3.947 0-6.21 2.052-6.907 6.036Zm28.092 20.568V41.85h8.475l1.451 6.973c1.103-5.273 4.527-7.442 10.564-7.442h1.916v11.193h-3.947c-6.154 0-7.662 2.168-7.662 8.203v15.06h-10.797Zm36.22-5.683-.814 5.684h-9.23V30.715h10.449V47.3c1.8-3.868 5.166-6.153 9.867-6.153 7.546.058 13.12 5.274 13.12 16.76v1.054c0 11.544-5.051 17.755-13.352 17.755-5.108 0-8.416-2.578-10.04-6.562ZM354.981 58.9v-.82c0-5.391-2.554-8.086-6.211-8.086-3.831 0-6.443 2.988-6.443 7.969v.762c0 5.918 2.554 8.673 6.385 8.673 3.89 0 6.27-2.52 6.27-8.498Zm13.753.762v-1.055c0-11.544 7.082-17.462 17.007-17.462 10.1 0 16.95 6.094 16.95 17.462v1.055c0 11.31-6.733 17.052-17.007 17.052-10.913 0-16.95-5.742-16.95-17.052Zm23.451-.117v-.938c0-5.566-2.322-8.438-6.385-8.438-3.948 0-6.56 2.755-6.56 8.438v.938c0 5.215 2.612 7.97 6.501 7.97 3.89 0 6.444-2.637 6.444-7.97Zm27.336 6.68-6.152 9.61h-12.422L413.37 58.14 402.11 41.849h11.957l5.515 8.614 5.513-8.614h11.9l-11.203 16.174 11.958 17.813h-12.074l-6.153-9.61Zm40.224 3.692c-1.683 3.985-5.05 6.564-10.216 6.564-8.127 0-13.235-5.92-13.235-17.58v-.997c0-11.427 5.573-16.7 13.293-16.7 4.876 0 8.069 2.05 9.752 5.508V30.715h10.39v45.122h-8.997l-.987-5.919Zm-.29-11.075v-.762c0-5.156-2.496-8.086-6.268-8.086-3.948 0-6.27 2.753-6.27 8.086v.762c0 6.095 2.496 8.556 6.094 8.556 3.89 0 6.444-2.813 6.444-8.556Z"
          fill="#567"
        />
      </g>
    </svg>
  </div>

  <section
    class="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 w-full children:w-full items-start px-4"
  >
    <div class="flex items-start gap-4 md:gap-8">
      <a
        href={link}
        class="block overflow-hidden rounded relative w-full shrink-0 w-2/5"
        aria-label={`${title} film`}
      >
        <div class="block pt-[150%]" />
        <img
          {src}
          loading="lazy"
          alt={title}
          class="absolute top-0 left-0 w-full h-full object-cover"
        />
      </a>
      <div class="flex flex-col items-stretch self-stretch">
        <h2 class="text-md md:text-lg font-semibold">
          {title}
        </h2>
        <p class="text-gray-300 text-sm md:text-md">{year}</p>
        <div class="flex gap-4">
          {#if showRating}
            <span class="w-[80px]">{rating}</span>
            <button
              class="text-sm py-1 px-2 bg-gray-50"
              on:click={() => (showRating = false)}
            >
              hide my rating</button
            >
          {:else}
            <span class="w-[80px]">☆☆☆☆☆</span>
            <button
              class="text-sm py-1 px-2 bg-gray-50"
              on:click={() => (showRating = true)}
            >
              show my rating</button
            >
          {/if}
        </div>
        <p class="mt-2 text-sm md:text-md text-clamp-05 md:text-clamp-30">
          {@html description}
        </p>
        <a
          href={link}
          class="block mt-auto text-sm pb-2 flex gap-1 items-center underline"
          >View on Letterboxd &#8594;</a
        >
      </div>
    </div>
    <div class="grid grid-cols-4 gap-3 w-4/5 md:gap-4 md:w-full mx-auto">
      {#each latestFilms as { title, src }, i}
        <div
          class="block overflow-hidden rounded relative w-full cursor-pointer transition-bounce active:scale-98 {currentFilmSelection ===
          i
            ? 'shadow-letterboxd shadow-purple-500/10'
            : ''}"
          aria-label={`${title} film`}
          on:click={() => ((currentFilmSelection = i), (showRating = false))}
        >
          <div class="block pt-[150%]" />
          <img
            {src}
            loading="lazy"
            alt={title}
            class="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      {/each}
    </div>
  </section>
</section>
