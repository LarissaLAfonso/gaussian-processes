<script>
    import Icon from "$components/helpers/Icon.svelte";
    import IconLink from "$components/gaussian/IconLink.svelte";
    import scrollY from "$stores/scrollY.js";
    import Link from "$components/gaussian/Link.svelte";
    import MaxWidthWrapper from "$components/layouts/MaxWidthWrapper.svelte";
    import { onMount } from "svelte";
  
    const iconSize = "1.5rem";
  
    const authors = [
      {
        name: "Larissa",
        github: "https://github.com/LarissaLAfonso",
        linkedin: "https://www.linkedin.com/in/larissa-lemos-afonso-087b78196/"   
      },
      {
        name: "Luciano",
        github: "https://github.com/LuuSamp",
        linkedin: "https://www.linkedin.com/in/luciano-pereira-sampaio-689200242/"
      },
      {
        name: "Kaiky",
        github: "https://github.com/KaikyBraga",
        linkedin: "https://www.linkedin.com/in/kaiky-braga-8a84962aa/"
      }
    ];
  </script>
  
  <div class="wrapper">
    <MaxWidthWrapper maxWidth={"70ch"}>
    <div class="content-wrapper">

    <div class="thanks-wrapper">
      <h1>Thank you! (○ﾟεﾟ○)</h1>
    </div>

    <div class="acknowledgements">
      <p style="margin-bottom: 0.9rem;"><strong>Acknowledgements</strong></p>
      <p>We must thank Yizhe Ang for <Link href="https://github.com/yizhe-ang/k-means-explorable/blob/main">his amazing exploration</Link>
      of the K-Means algorithm, whose implementing framework inspired ours.</p> 
      <p>We also thank Görtler, Kehlbeck and Deussen for <Link href="https://distill.pub/2019/visual-exploration-gaussian-processes">their publication</Link> on the subject,
      which was a great source of knowledge and inspiration for us.</p>
    </div>

    <p><strong>Contact us:</strong></p>
    {#each authors as author}
      <div class="author-block">
        <p>{author.name}</p>
        <div class="icons-wrapper">
          <IconLink href={author.linkedin}>
            <Icon slot="icon" name="linkedin" width={iconSize} height={iconSize} />
            <span slot="label">LinkedIn</span>
          </IconLink>
          
          <IconLink href={author.github}>
            <Icon slot="icon" name="github" width={iconSize} height={iconSize} />
            <span slot="label">GitHub</span>
          </IconLink>                
        </div>
      </div>
    {/each}

    </div>
  </MaxWidthWrapper>
  </div>
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');
    .wrapper {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 1;
      font-family: 'Fredoka', sans-serif;
      text-align: center;
      padding-bottom: 96px;
      padding-top: 15px;
      border-radius: 1.4rem;
      overflow: hidden;
    }

    .thanks-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 1rem;
      font-size: 2rem;
    }

    .acknowledgements {
      font-style: italic;
      font-size: 1rem;
      padding-bottom: 3rem;
    }
  
    .author-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .wrapper.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 100;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgb(254, 255, 215);
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
  