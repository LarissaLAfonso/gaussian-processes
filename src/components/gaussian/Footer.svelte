<script>
    import Icon from "$components/helpers/Icon.svelte";
    import IconLink from "$components/gaussian/IconLink.svelte";
  
    const iconSize = "1.5rem";
  
    const authors = [
      {
        name: "Larissa",
        github: "https://github.com/LarissaLAfonso",
        linkedin: "https://en.wikipedia.org/wiki/My_Neighbor_Totoro"   // !! TROCAR LINKEDINS !!
      },
      {
        name: "Luciano",
        github: "https://github.com/LuuSamp",
        linkedin: "https://en.wikipedia.org/wiki/My_Neighbor_Totoro"
      },
      {
        name: "Kaiky",
        github: "https://github.com/KaikyBraga",
        linkedin: "https://en.wikipedia.org/wiki/My_Neighbor_Totoro"
      }
    ];
  </script>
  
  <div class="wrapper">
    <div class="content-wrapper">
      <p><b>Connect with us:</b></p>
  
      {#each authors as author}
        <div class="author-block">
          <p>{author.name}</p>
          <div class="icons-wrapper">
            <IconLink href={author.linkedin}>
              <Icon slot="icon" name="linkedin" width={iconSize} height={iconSize} />
              <svelte:fragment slot="label">LinkedIn</svelte:fragment>
            </IconLink>
            <IconLink href={author.github}>
              <Icon slot="icon" name="github" width={iconSize} height={iconSize} />
              <svelte:fragment slot="label">GitHub</svelte:fragment>
            </IconLink>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    .wrapper {
      padding-bottom: 96px;
      padding-top: 48px;
      background-color: hsl(262, 48%, 96%);
    }
  
    .content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
  
    .author-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
  
    .icons-wrapper {
      display: flex;
      gap: 1.5rem;
    }
  
    p {
      text-align: center;
      margin: 0;
    }
  </style>
  