<script lang="ts">
  import { WalletButton, workSpace } from '@portal-payments/wallet-adapter-ui';
  import { walletAddressToNameAndProfilePicture } from '@portal-payments/solana-wallet-names';
  import type { PublicKey } from '@solana/web3.js';
  import { walletStore } from '@portal-payments/wallet-adapter-core';
  import { onMount, tick } from 'svelte';
  import { log, stringify } from '../lib/functions';
  const appName = `Wallet Connect Demo App`;

  const connection = $workSpace.connection;

  const walletAddressToNameAndProfilePictureWrapper = async (publicKey: PublicKey) => {
    return walletAddressToNameAndProfilePicture(connection, publicKey);
  };

  walletStore.subscribe(async newValue => {
    if (newValue?.publicKey) {
      log(`🚀 $walletStore.connected has updated!`, $walletStore.connected);
      // $walletStore.publicKey.toBase58(); now has our wallet address
    }
  });

  onMount(async () => {});
</script>

<header>
  <title>{appName}</title>
  <div class="user">
    <WalletButton walletAddressToNameAndProfilePicture={walletAddressToNameAndProfilePictureWrapper} />
  </div>
</header>

<main>
  {#if !$walletStore?.connected}
    <h1>Sign in with your Solana<br /> wallet to continue.</h1>
  {:else}
    Connected to {$walletStore.publicKey.toBase58()}.
  {/if}
</main>

<style>
  /* Padding goes inside boxes */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  /* Use grid by default */
  :global(div, footer, header, main, nav, title, section) {
    display: grid;
    place-items: center;
  }

  /* Sensible links */
  :global(a, a:visited, a:hover, a:active) {
    text-decoration: none;
    color: var(--black);
  }

  :global(body) {
    min-height: 100dvh;
    display: grid;
    grid-auto-flow: row;
    justify-items: center;
    padding: 0;
    margin: 0;
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    background: linear-gradient(135deg, #edfff8, #e9fffe);
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
  }

  h1 {
    font-size: 32px;
    line-height: 40px;
    font-weight: 800;
    text-align: center;
    margin: 0;
  }

  header {
    height: 64px;
    grid-auto-flow: column;
    justify-content: space-between;
    width: 100%;
    position: absolute;
    top: 0;
    padding: 0 24px;
  }

  header title {
    width: 192px;
    font-size: 18px;
    font-weight: 800;
    text-transform: uppercase;
  }

  main {
    /* 64px header height plus some extra space */
    padding-top: 128px;
    gap: 32px;
    align-content: start;
    max-width: 900px;
    width: 100%;
  }
</style>
