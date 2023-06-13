<script lang="ts">
  import { slide } from "svelte/transition";
  import { byInstalledStatus } from "./utils";
  import { walletStore } from "@portal-payments/wallet-adapter-core";
  import { createEventDispatcher } from "svelte";
  import ChooseWalletAdapterButton from "./ChooseWalletAdapterButton.svelte";
  import GenericWalletPicture from "./GenericWalletPicture.svelte";
  import RotatingArrow from "./RotatingArrow.svelte";
  import CloseButton from "./CloseButton.svelte";

  let isShowingUninstalledWallets = false,
    backdrop: HTMLDivElement,
    container: HTMLDivElement;

  // Show installed wallet adapters first.
  // 'wallet-adapter-core' incorrectly uses 'Wallet' but this is a combination of a wallet adapter and a ready state.
  $: installedWalletAdaptersWithReadyState = $walletStore.wallets
    .filter((walletAdapterAndReadyState) => {
      return walletAdapterAndReadyState.readyState === "Installed";
    })
    .sort((walletAdapterAndReadyStateA, walletAdapterAndReadyStateB) => {
      return byInstalledStatus(walletAdapterAndReadyStateA.adapter.name, walletAdapterAndReadyStateB.adapter.name);
    });

  $: uninstalledWalletAdaptersWithReadyState = $walletStore.wallets
    .filter((walletAdapterAndReadyState) => {
      return walletAdapterAndReadyState.readyState !== "Installed";
    })
    .sort((walletAdapterAndReadyStateA, walletAdapterAndReadyStateB) => {
      return byInstalledStatus(walletAdapterAndReadyStateA.adapter.name, walletAdapterAndReadyStateB.adapter.name);
    });

  const dispatch = createEventDispatcher();

  const connect = (name) => {
    dispatch("connect", name);
  };

  const toggleShowingUninstalledWallets = () => {
    isShowingUninstalledWallets = !isShowingUninstalledWallets;
  };

  const closeModal = (event) => {
    if (event.target === backdrop || event.target === container) {
      dispatch("close");
    }
  };

  const handleKeyup = (event) => {
    if (event.key == "Escape") {
      dispatch("close");
    }
  };

  const getStarted = () => {
    // TODO: Torus clearly needs some kind of special attention
    // but nobody bothered commenting why
    const torusWallet = $walletStore.wallets.find((wallet) => wallet.adapter.name === "Torus");
    if (torusWallet) {
      connect(torusWallet.adapter.name);
    } else {
      // TODO: close the modal if people don't have a wallet? Shouldn't we open solana.com or something?
      dispatch("close");
    }
  };
</script>

<svelte:window on:keyup={handleKeyup} />

<!-- TODO: fix name. It's effectively the shade for the modal -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="wallet-adapter-modal wallet-adapter-modal-fade-in"
  aria-labelledby="wallet-adapter-modal-title"
  aria-modal="true"
  role="dialog"
  bind:this={backdrop}
  on:click={(event) => closeModal(event)}
>
  <div class="wallet-adapter-modal-content">
    <h1 class="wallet-adapter-modal-title">
      {installedWalletAdaptersWithReadyState.length
        ? "Connect a wallet on Solana to continue"
        : `You'll need a wallet on Solana to continue`}
    </h1>

    <CloseButton clickHandler={() => dispatch("close")} />

    {#if installedWalletAdaptersWithReadyState.length}
      <!-- TODO: rename to something like installed-wallet-adapters -->
      <ul class="wallet-adapter-modal-list">
        {#each installedWalletAdaptersWithReadyState as walletAdapterWithReadyState}
          <li>
            <ChooseWalletAdapterButton on:click={() => connect(walletAdapterWithReadyState.adapter.name)}>
              {walletAdapterWithReadyState.adapter.name}

              <svelte:fragment slot="start-icon">
                <img
                  class="wallet-adapter-icon"
                  src={walletAdapterWithReadyState.adapter.icon}
                  alt={`${walletAdapterWithReadyState.adapter.name} icon`}
                />
              </svelte:fragment>

              <svelte:fragment slot="status">
                {walletAdapterWithReadyState.readyState === "Installed" ? "Detected" : ""}
              </svelte:fragment>
            </ChooseWalletAdapterButton>
          </li>
        {/each}
      </ul>
      {#if uninstalledWalletAdaptersWithReadyState.length}
        <button
          class="wallet-adapter-modal-list-more"
          style="justify-content: space-between;"
          class:wallet-adapter-modal-collapse-button-active={isShowingUninstalledWallets}
          on:click={() => toggleShowingUninstalledWallets()}
        >
          <span>
            {isShowingUninstalledWallets ? "Less" : "More"} options
          </span>

          <RotatingArrow isRotated={isShowingUninstalledWallets} />
        </button>
      {/if}
    {:else}
      <div class="wallet-adapter-modal-middle">
        <GenericWalletPicture />
        <p>You'll need a Solana wallet.</p>
        <button type="button" class="wallet-adapter-modal-middle-button" on:click={getStarted}>Get started</button>
      </div>
    {/if}

    {#if uninstalledWalletAdaptersWithReadyState.length}
      <ul class="wallet-adapter-modal-list" transition:slide={{ duration: 300 }}>
        {#each uninstalledWalletAdaptersWithReadyState as walletAdapterWithReadyState}
          <li>
            <ChooseWalletAdapterButton on:click={() => connect(walletAdapterWithReadyState.adapter.name)}>
              {walletAdapterWithReadyState.adapter.name}

              <svelte:fragment slot="start-icon">
                <img
                  class="wallet-adapter-icon"
                  src={walletAdapterWithReadyState.adapter.icon}
                  alt={`${walletAdapterWithReadyState.adapter.name} icon`}
                />
              </svelte:fragment>

              <svelte:fragment slot="status">
                {walletAdapterWithReadyState.readyState === "Installed" ? "Detected" : ""}
              </svelte:fragment>
            </ChooseWalletAdapterButton>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
