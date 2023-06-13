<script lang="ts">
  import { walletStore } from "@portal-payments/wallet-adapter-core";
  import Button from "../atoms/Button.svelte";

  let text;

  $: ({ wallet, connect, connecting, connected } = $walletStore);

  $: {
    text = "Connect Wallet";
    if (wallet) text = "Connect";
    if (connecting) text = "Connecting ...";
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

<Button on:click={handleClick} isDisabled={!wallet || connecting || connected} buttonVersion="capsule">
  <svelte:fragment slot="icon">
    {#if wallet}
      <img src={wallet.icon} class="wallet-adapter-icon" alt={`${wallet.name} icon`} />
    {/if}
  </svelte:fragment>

  <slot />

  <slot name="bonus-text" />
</Button>

<style>
</style>
