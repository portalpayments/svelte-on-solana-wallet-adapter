<script lang="ts">
  // TODO: this is a single component re-used for WILDLY differing circumstances.
  // - the 'Select wallet' (or 'Connect wallet') button
  //   class is 'wallet-adapter-button-trigger'
  // - the 'Connected' button
  //   class is 'wallet-adapter-button-trigger'
  // - every button with a wallet to connect to option in the modal
  //   class is 'wallet-adapter-choice'
  export let isDisabled: boolean = false;

  export let buttonVersion: "capsule" | "option" = "capsule";
</script>

<button class={buttonVersion} disabled={isDisabled} on:click>
  {#if $$slots["icon"]}
    <slot name="icon" />
  {/if}
  <slot />
  <slot name="bonus-text" />
</button>

<style>
  /* This is any button in the wallet adapter, including the 'Connect a wallet on Solana to continue' buttons
The styling should be very boring and minimal */
  button {
    color: var(--text-color);
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-family: var(--fonts);
    font-size: 16px;
    font-weight: 600;
    height: var(--height);
    line-height: var(--height);
    padding-left: 24px;
    padding-right: 24px;
    border-radius: var(--border-radius);
    justify-content: space-between;
  }

  button:not([disabled]):focus-visible {
    outline-color: white;
  }

  button:not([disabled]):hover {
    background-color: linear-gradient(90deg, #999, #666);
    background-origin: border-box;
    color: var(--hover-text-color);
  }

  button[disabled] {
    background: var(--disabled-background-color);
    color: var(--disabled-text-color);
    cursor: not-allowed;
  }

  button:has(.profile-picture) {
    padding-left: 4px;
  }

  .capsule {
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

  button.option {
    width: 100%;
    display: grid;
    /* The icon, the name, then show the bonus text all the way to the right */
    grid-template-columns: auto auto 1fr;
    grid-auto-flow: column;
    align-content: center;
    gap: 4px;
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
