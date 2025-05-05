<script>
  import Icon from "$components/helpers/Icon.svelte";
  import IconLink from "$components/gaussian/IconLink.svelte";
  import Link from "$components/gaussian/Link.svelte";
  import MaxWidthWrapper from "$components/layouts/MaxWidthWrapper.svelte";

  const iconSize = "clamp(1.25rem, 2vw, 1.75rem)";

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
  <MaxWidthWrapper maxWidth={"min(90%, 70ch)"}>
      <div class="content-wrapper">
          <div class="thanks-wrapper">
              <h1>Thank you! (○ﾟεﾟ○)</h1>
          </div>

          <div class="acknowledgements">
              <p><strong>Acknowledgements</strong></p>
              <p>We must thank Yizhe Ang for <Link href="https://github.com/yizhe-ang/k-means-explorable/blob/main">his amazing exploration</Link>
              of the K-Means algorithm, whose implementing framework inspired ours.</p> 
              <p>We also thank Görtler, Kehlbeck and Deussen for <Link href="https://distill.pub/2019/visual-exploration-gaussian-processes">their publication</Link> on the subject,
              which was a great source of knowledge and inspiration for us.</p>
          </div>

          <p><strong>Contact us:</strong></p>
          <div class="authors-container">
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
      padding: clamp(1rem, 5vw, 3rem) 0;
  }

  .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: clamp(0.5rem, 1vw, 1rem);
      width: 100%;
  }

  .thanks-wrapper h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: clamp(0.5rem, 2vw, 1rem);
      margin-top: clamp(2rem, 2vw + 2rem, 4rem);
  }

  .acknowledgements {
      font-style: italic;
      font-size: clamp(0.9rem, 1.2vw, 1.1rem);
      line-height: 1.6;
      padding-bottom: clamp(1rem, 3vw, 3rem);
  }

  .authors-container {
      display: flex;
      flex-direction: column;
      align-items: center;
  }

  .author-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.5rem, 1vw, 0.75rem);
  }

  .author-block p {
      font-size: clamp(1rem, 1.3vw, 1.25rem);
      font-weight: 500;
  }

  .icons-wrapper {
      display: flex;
      gap: clamp(1rem, 2vw, 1.5rem);
  }

  p {
      text-align: center;
      margin: 0;
  }
</style>