<script lang="ts">
  import { walletStore } from "@portal-payments/wallet-adapter-core";
  import Button from "../atoms/Button.svelte";

  let text;

  // walletStore.wallet is actually a walletAdapter
  // TODO: fix walletStore
  $: ({ wallet: walletAdapter, connect, connecting, connected } = $walletStore);

  $: {
    text = "Connect wallet";
    if (walletAdapter) text = "Connect";
    if (connecting) text = "Connecting…";
    if (connected) text = "Connected";
  }

  function handleClick(event: MouseEvent) {
    try {
      connect();
    } catch (error) {
      // TODO: old code threw away errors, not sure if we should too.
      console.log(error);
    }
  }
</script>

<Button on:click={handleClick} isDisabled={!walletAdapter || connecting || connected} buttonVersion="capsule">
  <svelte:fragment slot="icon">
    {#if walletAdapter}
      <img src={walletAdapter.icon} class="wallet-adapter-icon" alt={`${walletAdapter.name} icon`} />
    {/if}
  </svelte:fragment>

  {text}
</Button>

<style>
</style>
