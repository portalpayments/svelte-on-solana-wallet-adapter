<script lang="ts">
  export let disabled: boolean = false;

  let className: string = "";
  export { className as class };
</script>

<button class="wallet-adapter-button {className}" style={`justify-content: space-between;`} {disabled} on:click>
  {#if $$slots["start-icon"]}
    <i class="wallet-adapter-button-start-icon">
      <slot name="start-icon" />
    </i>
  {/if}
  <slot />
  <span class="adapter-install-status">
    <slot name="status" />
  </span>
</button>

<style>
  .adapter-install-status {
    margin-left: auto;
    font-size: 14px;
    opacity: 0.6;
  }

  .wallet-adapter-button {
    width: 100%;
  }
</style>
