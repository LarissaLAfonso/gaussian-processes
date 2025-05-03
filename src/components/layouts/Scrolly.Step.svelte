<script>
  export let active;
</script>

<div class:active>
<slot />
</div>

<style>
div {
  width: min(90%, 700px);
  margin: 0 auto 0.5rem;
  box-sizing: border-box;

  /* Typography */
  font-size: clamp(1.5rem, 1vw + 0.8rem, 2rem);
  line-height: 1.5;

  /* Layout */
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;

  /* Border styling */
  --border-color: var(--hsl-gray-100);
  --border-size: clamp(12px, 0.5vw, 20px);
  border-left: var(--border-size) solid transparent;
  transition: 
    border-left-color 500ms ease,
    opacity 300ms ease;
  opacity: 0.7;

  /* Border radius */
  border-radius: 0.5rem;

  /* Mobile-first adjustments */
  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem;
    --border-size: 12px;
  }
}

div.active {
  opacity: 1;
}

/* Touchscreen optimization */
@media (hover: none) and (pointer: coarse) {
  div {
    transition-duration: 250ms;
    --border-size: 14px;
  }
}
</style>