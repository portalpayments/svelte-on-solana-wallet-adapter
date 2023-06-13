<script lang="ts">
  import { walletStore } from "@portal-payments/wallet-adapter-core";
  import Button from "./atoms/Button.svelte";
  import WalletConnectButton from "./molecules/WalletConnectButton.svelte";
  import WalletModal from "./molecules/WalletModal.svelte";
  import { copyToClipboard, truncateWalletAddress, sleep } from "../utils";
  import type { PublicKey } from "@solana/web3.js";
  import "./styles.css";

  const log = console.log;

  // A stub function if the user isn't providing their own mechanism
  // for mapping wallet addresses to wallet names and profile pictures.
  export let walletAddressToNameAndProfilePicture = async (publicKey: PublicKey) => {
    return {
      walletName: null,
      profilePicture: null,
    };
  };

  export let hideWalletAddressIfUserHasName = true;

  // Was called CallbackType but TS doesn't use Hungarian notation.
  // and this isn't used to control flow.
  interface ClickHandler {
    (arg?: string): void;
  }

  // wallet is a WalletAdapter
  // TODO: fix wallet-adapter-core
  $: ({ publicKey, wallet, disconnect, connect, select } = $walletStore);

  let isDropDrownVisible = false,
    isModalVisible = false,
    hasRecentlyCopiedWalletName = false,
    hasRecentlyCopiedWalletAddress = false;

  // Was previously called 'base58'
  $: walletAddress = publicKey?.toBase58();

  let truncatedWalletAddress: string | null = null;
  let walletName: string | null = null;
  let profilePicture: string | null = null;

  const copyWalletName = async () => {
    if (!walletAddress) {
      return;
    }
    await copyToClipboard(walletName);
    hasRecentlyCopiedWalletName = true;
    await sleep(400);
    hasRecentlyCopiedWalletName = false;
  };

  const copyWalletAddress = async () => {
    if (!walletAddress) {
      return;
    }
    await copyToClipboard(walletAddress);
    hasRecentlyCopiedWalletAddress = true;
    await sleep(400);
    hasRecentlyCopiedWalletAddress = false;
  };

  const openDropdown = () => {
    isDropDrownVisible = true;
  };

  const closeDropdown = () => {
    isDropDrownVisible = false;
  };

  const openModal = () => {
    isModalVisible = true;
    closeDropdown();
  };

  const closeModal = () => {
    isModalVisible = false;
  };

  walletStore.subscribe(async (newValue) => {
    const walletAddress = newValue.publicKey?.toBase58();
    // The walletStore has a misnamed variable called 'wallet' which is actually a wallet adapter.
    // Let's give it a better name so the next line makes sense.
    const walletAdapter = newValue.wallet;
    if (!walletAdapter || !walletAddress) {
      return null;
    }
    truncatedWalletAddress = truncateWalletAddress(walletAddress);
    const walletNameAndProfilePicture = await walletAddressToNameAndProfilePicture(newValue.publicKey);
    walletName = walletNameAndProfilePicture.walletName;
    profilePicture = walletNameAndProfilePicture.profilePicture;
  });

  const connectWalletAdapter = async (event) => {
    closeModal();
    await select(event.detail);
    await connect();
  };

  const disconnectWalletAdapter = async (event) => {
    closeDropdown();
    await disconnect();
  };

  // Was called clickOutside
  // For Svelte 'use' directive, see https://svelte.dev/docs#template-syntax-element-directives-use-action
  const setClickHandlerForOutsideElement = (element: HTMLElement, clickHandler: ClickHandler): unknown => {
    let currentClickHandler = clickHandler;
    const onClick = (event: MouseEvent) => {
      if (element && event.target instanceof Node && !element.contains(event.target) && !event.defaultPrevented) {
        currentClickHandler();
      }
    };

    document.body.addEventListener("click", onClick, true);

    return {
      update(newClickHandler: ClickHandler) {
        currentClickHandler = newClickHandler;
      },
      destroy() {
        document.body.removeEventListener("click", onClick, true);
      },
    };
  };
</script>

<!-- Really 'wallet' means 'walletAdapter'
TODO: fix wallet-adapter-core -->
{#if !wallet}
  <Button buttonVersion="capsule" on:click={openModal}>
    <slot>Select Wallet</slot>
  </Button>
{:else if !walletAddress}
  <WalletConnectButton />
{:else}
  <div class="wallet-adapter-dropdown">
    <Button buttonVersion="capsule" on:click={openDropdown}>
      <svelte:fragment slot="icon">
        {#if profilePicture}
          <img class="profile-picture" src={profilePicture} alt={truncatedWalletAddress} />
        {:else}
          <!-- Show the wallet *adapter* icon and wallet *adapter* name -->
          <img class="wallet-adapter-icon" src={wallet.icon} alt={`${wallet.name} icon`} />
        {/if}
      </svelte:fragment>
      {walletName || truncatedWalletAddress}
    </Button>
    {#if isDropDrownVisible}
      <!-- TODO: fix accessability and remove the warning below -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <ul
        aria-label="dropdown-list"
        class="wallet-adapter-dropdown-list wallet-adapter-dropdown-list-active"
        role="menu"
        use:setClickHandlerForOutsideElement={() => {
          if (isDropDrownVisible) {
            closeDropdown();
          }
        }}
      >
        {#if walletName}
          <li on:click={copyWalletName} class="wallet-adapter-dropdown-list-item" role="menuitem">
            {hasRecentlyCopiedWalletName ? "Copied" : "Copy wallet name"}
          </li>
        {/if}
        {#if !walletName && !hideWalletAddressIfUserHasName}
          <li on:click={copyWalletAddress} class="wallet-adapter-dropdown-list-item" role="menuitem">
            {hasRecentlyCopiedWalletAddress ? "Copied" : "Copy wallet address"}
          </li>
        {/if}
        <li on:click={openModal} class="wallet-adapter-dropdown-list-item" role="menuitem">
          Connect a different wallet
        </li>
        <li on:click={disconnectWalletAdapter} class="wallet-adapter-dropdown-list-item" role="menuitem">Disconnect</li>
      </ul>
    {/if}
  </div>
{/if}

{#if isModalVisible}
  <WalletModal on:close={closeModal} on:connect={connectWalletAdapter} />
{/if}

<style>
  .wallet-adapter-dropdown {
    position: relative;
    display: inline-block;
  }

  .wallet-adapter-dropdown-list {
    color: var(--text-color);
    background-color: var(--background-color);
    position: absolute;
    z-index: 99;
    display: grid;
    grid-template-rows: 1fr;
    grid-row-gap: 10px;
    padding: 10px;
    top: 100%;
    right: 0;
    margin: 0;
    list-style: none;
    border-radius: 10px;
    box-shadow: var(--shadow);
    opacity: 0;
    visibility: hidden;
    transition: opacity 200ms ease, transform 200ms ease, visibility 200ms;
    font-family: var(--fonts);
  }

  .wallet-adapter-dropdown-list-active {
    opacity: 1;
    visibility: visible;
    transform: translateY(10px);
  }

  .wallet-adapter-dropdown-list-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    cursor: pointer;
    white-space: nowrap;
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    height: 37px;
    color: var(--text-color);
  }

  .wallet-adapter-dropdown-list-item:not([disabled]):hover {
    background-color: var(--hover-background-color);
  }
</style>
