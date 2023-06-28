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
  button:not([disabled]):focus-visible {
    outline-color: white;
  }

  button:not([disabled]):hover {
    background-color: var(--hover-background-color);
    color: var(--hover-text-color);
  }

  button[disabled] {
    background-color: linear-gradient(90deg, #999, #666);
    background-origin: border-box;
    color: var(--disabled-text-color);
    cursor: not-allowed;
  }

  button {
    width: 100%;
    display: grid;
    /* The icon, the name, then show the bonus text all the way to the right */
    grid-template-columns: auto auto 1fr;
    grid-auto-flow: column;
    align-content: center;
    gap: 4px;
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
