<script lang="ts">
  export let isDisabled: boolean = false;
</script>

<button disabled={isDisabled} on:click>
  {#if $$slots["icon"]}
    <slot name="icon" />
  {/if}
  <slot />
  <slot name="bonus-text" />
</button>

<style>
  button:has(.profile-picture) {
    padding-left: 4px;
  }

  button {
    /* Gradient border hack below */
    /* Colors from https://solana.com/branding 
  Then ran through https://www.learnui.design/tools/gradient-generator.html to remove gray dead-zone
  with Precision set to 1 */
    background: linear-gradient(90deg, #9945ff, #00c2ff, #14f195);
    /* Fill the inside with white */
    background-origin: border-box;
    box-shadow: inset 0 1000px white;
    /* A transaprent border, so the very edge of the button shows through */
    border: 2px solid transparent;
  }

  button :global(.profile-picture) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    aspect-ratio: 1;
    border-radius: 50%;
  }

  button :global(.wallet-adapter-icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    aspect-ratio: 1;
  }

  button :global(.bonus-text) {
    margin-left: auto;
    font-size: 14px;
    opacity: 0.6;
  }
</style>
