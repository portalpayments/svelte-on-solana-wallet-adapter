<script lang="ts">
  import { slide } from "svelte/transition";
  import { byInstalledStatus } from "../../utils";
  import { walletStore } from "@portal-payments/wallet-adapter-core";
  import { createEventDispatcher } from "svelte";
  import Button from "../atoms/Button.svelte";
  import GenericWalletPicture from "../atoms/GenericWalletPicture.svelte";
  import RotatingArrow from "../atoms/RotatingArrow.svelte";
  import CloseButton from "../atoms/CloseButton.svelte";

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
    <CloseButton clickHandler={() => dispatch("close")} />

    {#if installedWalletAdaptersWithReadyState.length}
      <h1 class="wallet-adapter-modal-title">Connect a wallet on Solana to continue</h1>
      <div class="wallet-adapters">
        {#each installedWalletAdaptersWithReadyState as walletAdapterWithReadyState}
          <Button buttonVersion="option" on:click={() => connect(walletAdapterWithReadyState.adapter.name)}>
            {walletAdapterWithReadyState.adapter.name}

            <svelte:fragment slot="icon">
              <img
                class="wallet-adapter-icon"
                src={walletAdapterWithReadyState.adapter.icon}
                alt={`${walletAdapterWithReadyState.adapter.name} icon`}
              />
            </svelte:fragment>

            <svelte:fragment slot="bonus-text">
              <div class="bonus-text">
                {walletAdapterWithReadyState.readyState === "Installed" ? "Detected" : ""}
              </div>
            </svelte:fragment>
          </Button>
        {/each}
      </div>
      {#if uninstalledWalletAdaptersWithReadyState.length}
        <button
          class="wallet-adapters-more"
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

      {#if isShowingUninstalledWallets}
        <div class="wallet-adapters" transition:slide={{ duration: 300 }}>
          {#each uninstalledWalletAdaptersWithReadyState as walletAdapterWithReadyState}
            <Button buttonVersion="option" on:click={() => connect(walletAdapterWithReadyState.adapter.name)}>
              {walletAdapterWithReadyState.adapter.name}

              <svelte:fragment slot="icon">
                <img
                  class="wallet-adapter-icon"
                  src={walletAdapterWithReadyState.adapter.icon}
                  alt={`${walletAdapterWithReadyState.adapter.name} icon`}
                />
              </svelte:fragment>

              <svelte:fragment slot="bonus-text">
                <div class="bonus-text">
                  {walletAdapterWithReadyState.readyState === "Installed" ? "Detected" : ""}
                </div>
              </svelte:fragment>
            </Button>
          {/each}
        </div>
      {/if}
    {:else}
      <!-- TODO: maybe rename -no-wallet-get-started or similar? -->
      <h1 class="wallet-adapter-modal-title">You'll need a wallet on Solana to continue</h1>
      <div class="wallet-adapter-modal-middle">
        <button type="button" class="wallet-adapter-modal-middle-button" on:click={getStarted}>
          <GenericWalletPicture />
          <p>Get started</p>
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .wallet-adapter-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity linear 150ms;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1040;
    overflow-y: auto;
  }

  .wallet-adapter-modal.wallet-adapter-modal-fade-in {
    opacity: 1;
  }

  .wallet-adapter-modal-content {
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 1050;
    max-width: 400px;
    border-radius: 10px;
    background: var(--modal-background-color);
    box-shadow: var(--shadow);
    font-family: var(--fonts);
    flex: 1;
  }

  .wallet-adapter-modal-title {
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    margin: 0;
    padding: 64px 48px 48px 48px;
    text-align: center;
    color: var(--text-color);
  }

  .wallet-adapter-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity linear 150ms;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1040;
    overflow-y: auto;
  }

  .wallet-adapter-modal.wallet-adapter-modal-fade-in {
    opacity: 1;
  }

  .wallet-adapter-modal-content {
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 1050;
    max-width: 400px;
    border-radius: 10px;
    background: var(--modal-background-color);
    box-shadow: var(--shadow);
    font-family: var(--fonts);
    flex: 1;
  }

  .wallet-adapter-modal-title {
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    margin: 0;
    padding: 64px 48px 48px 48px;
    text-align: center;
    color: var(--text-color);
  }

  @media (max-width: 374px) {
    .wallet-adapter-modal-title {
      font-size: 18px;
    }
  }

  .wallet-adapters {
    margin: 0 0 12px 0;
    padding: 0;
    width: 100%;
    list-style: none;
  }

  .wallet-adapters-more {
    cursor: pointer;
    border: none;
    padding: 12px 24px 24px 12px;
    align-self: flex-end;
    display: flex;
    align-items: center;
    background-color: transparent;
    color: var(--text-color);
    font-family: var(--fonts);
  }

  .wallet-adapters-more span {
    font-size: 16px;
  }

  .wallet-adapter-modal-middle {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px 24px 24px;
    box-sizing: border-box;
  }

  .wallet-adapter-modal-middle-button {
    display: block;
    cursor: pointer;
    margin-top: 48px;
    width: 100%;
    background-color: var(--background-color);
    padding: 12px;
    font-size: 18px;
    border: none;
    border-radius: 8px;
    color: var(--text-color);
  }

  @media (max-width: 374px) {
    .wallet-adapter-modal-title {
      font-size: 18px;
    }
  }

  .wallet-adapters {
    margin: 0 0 12px 0;
    padding: 0;
    width: 100%;
    list-style: none;
  }

  .wallet-adapters-more {
    cursor: pointer;
    border: none;
    padding: 12px 24px 24px 12px;
    align-self: flex-end;
    display: flex;
    align-items: center;
    background-color: transparent;
    color: var(--text-color);
    font-family: var(--fonts);
  }

  .wallet-adapters-more span {
    font-size: 16px;
  }

  .wallet-adapter-modal-middle {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px 24px 24px;
    box-sizing: border-box;
  }

  .wallet-adapter-modal-middle-button {
    display: block;
    cursor: pointer;
    margin-top: 48px;
    width: 100%;
    background-color: var(--background-color);
    padding: 12px;
    font-size: 18px;
    border: none;
    border-radius: 8px;
    color: var(--text-color);
  }
</style>
