<script lang="ts">
  import { walletStore } from '@portal-payments/wallet-adapter-core';
  import ChooseWalletAdapterButton from './ChooseWalletAdapterButton.svelte';
  import WalletConnectButton from './WalletConnectButton.svelte';
  import WalletModal from './WalletModal.svelte';
  import { copyToClipboard, truncateWalletAddress, sleep } from './utils';
  import type { PublicKey} from "@solana/web3.js";
  import './styles.css';

  const log = console.log 

  export let maxNumberOfWallets = 3;

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

  let truncatedWalletAddress: string | null = null
  let walletName: string | null = null
  let profilePicture: string | null = null

  

  const copyWalletName = async () => {
    if (!walletAddress) {
      return;
    }
    await copyToClipboard(walletName);
    hasRecentlyCopiedWalletName = true;
    await sleep(400)
    hasRecentlyCopiedWalletName = false;
  };

  const copyWalletAddress = async () => {
    if (!walletAddress) {
      return;
    }
    await copyToClipboard(walletAddress);
    hasRecentlyCopiedWalletAddress = true;
    await sleep(400)
    hasRecentlyCopiedWalletAddress = false;
  };

  const openDropdown = () => {
    isDropDrownVisible = true
  };

  const closeDropdown = () => {
    isDropDrownVisible = false
  };

  const openModal = () => {
    isModalVisible = true;
    closeDropdown();
  };
  
  const closeModal = () => {
    isModalVisible = false
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
  const setClickHandlerForOutsideElement = (
    element: HTMLElement,
    clickHandler: ClickHandler,
  ): unknown => {
    let currentClickHandler = clickHandler;
    const onClick = (event: MouseEvent) => {
      if (
        element &&
        event.target instanceof Node &&
        !element.contains(event.target) &&
        !event.defaultPrevented
      ) {
        currentClickHandler();
      }
    }

    document.body.addEventListener('click', onClick, true);

    return {
      update(newClickHandler: ClickHandler) {
        currentClickHandler = newClickHandler;
      },
      destroy() {
        document.body.removeEventListener('click', onClick, true);
      },
    };
  };
</script>

<!-- Really 'wallet' means 'walletAdapter'
TODO: fix wallet-adapter-core -->
{#if !wallet}
  <ChooseWalletAdapterButton class="wallet-adapter-button-trigger" on:click={openModal}>
    <slot>Select Wallet</slot>
  </ChooseWalletAdapterButton>
{:else if !walletAddress}
  <WalletConnectButton />
{:else}
  <div class="wallet-adapter-dropdown">
    <ChooseWalletAdapterButton
      on:click={openDropdown}
      class="wallet-adapter-button-trigger"
    >
      <svelte:fragment slot="start-icon">
        {#if profilePicture}
          <img class="profile-picture" src={profilePicture} alt={truncatedWalletAddress} />
        {:else}
          <!-- Show the wallet *app* icon and wallet *app* name -->
          <img class="wallet-adapter-icon" src={wallet.icon} alt={`${wallet.name} icon`} />
        {/if}
      </svelte:fragment>
      {walletName || truncatedWalletAddress}
    </ChooseWalletAdapterButton>
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
          <li
            on:click={copyWalletName}
            class="wallet-adapter-dropdown-list-item"
            role="menuitem"
          >
            {hasRecentlyCopiedWalletName ? 'Copied' : 'Copy wallet name'}
          </li>
        {/if}
        {#if ! walletName && ! hideWalletAddressIfUserHasName }
          <li
            on:click={copyWalletAddress}
            class="wallet-adapter-dropdown-list-item"
            role="menuitem"
          >
            {hasRecentlyCopiedWalletAddress ? 'Copied' : 'Copy wallet address'}
          </li>
        {/if}
        <li
          on:click={openModal}
          class="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          Connect a different wallet
        </li>
        <li
          on:click={disconnectWalletAdapter}
          class="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          Disconnect
        </li>
      </ul>
    {/if}
  </div>
{/if}

{#if isModalVisible}
  <WalletModal
    on:close={closeModal}
    on:connect={connectWalletAdapter}
    {maxNumberOfWallets}
  />
{/if}
