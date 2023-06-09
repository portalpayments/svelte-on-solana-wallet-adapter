<script lang="ts">
  import { walletStore } from '@portal-payments/wallet-adapter-core';
  import WalletButton from './WalletButton.svelte';
  import WalletConnectButton from './WalletConnectButton.svelte';
  import WalletModal from './WalletModal.svelte';
  import type { PublicKey} from "@solana/web3.js";
  import './styles.css';

  export let maxNumberOfWallets = 3;

  export let walletAddressToNameAndProfilePicture = async (publicKey: PublicKey) => {
    return {
      walletName: null,
      profilePicture: null,
    };
  };

  const log = console.log 

  $: ({ publicKey, wallet, disconnect, connect, select } = $walletStore);

  let isDropDrownVisible = false,
    isModalVisible = false,
    hasRecentlyCopied = false;

  // Was previously called 'base58'
  $: walletAddress = publicKey?.toBase58();

  let truncatedWalletAddress: string | null = null
  let walletName: string | null = null
  let profilePicture: string | null = null
  
  walletStore.subscribe(async (newValue) => {
    const walletAddress = newValue.publicKey?.toBase58();
    if (!newValue.wallet || !walletAddress) {
      return null; 
    }
    truncatedWalletAddress = truncateWalletAddress(walletAddress);
    const walletNameAndProfilePicture = await walletAddressToNameAndProfilePicture(newValue.publicKey);
    walletName = walletNameAndProfilePicture.walletName;
    profilePicture = walletNameAndProfilePicture.profilePicture;    
  });


  const copyAddress = async () => {
    if (!walletAddress) return;
    await navigator.clipboard.writeText(walletAddress);
    hasRecentlyCopied = true;
    setTimeout(() => (hasRecentlyCopied = false), 400);
  };

  const openDropdown = () => (isDropDrownVisible = true);
  const closeDropdown = () => (isDropDrownVisible = false);

  const truncateWalletAddress = (walletAddress: string ) => {
    return walletAddress.slice(0, 4) + '..' + walletAddress.slice(-4);
  }

  const openModal = () => {
    isModalVisible = true;
    closeDropdown();
  };
  
  const closeModal = () => (isModalVisible = false);


  async function connectWallet(event) {
    closeModal();
    await select(event.detail);
    await connect();
  }

  async function disconnectWallet(event) {
    closeDropdown();
    await disconnect();
  }

  interface CallbackType {
    (arg?: string): void;
  }

  function clickOutside(
    element: HTMLElement,
    callbackFunction: CallbackType,
  ): unknown {
    function onClick(event: MouseEvent) {
      if (
        element &&
        event.target instanceof Node &&
        !element.contains(event.target) &&
        !event.defaultPrevented
      ) {
        callbackFunction();
      }
    }

    document.body.addEventListener('click', onClick, true);

    return {
      update(newCallbackFunction: CallbackType) {
        callbackFunction = newCallbackFunction;
      },
      destroy() {
        document.body.removeEventListener('click', onClick, true);
      },
    };
  }
</script>

{#if !wallet}
  <WalletButton class="wallet-adapter-button-trigger" on:click={openModal}>
    <slot>Select Wallet</slot>
  </WalletButton>
{:else if !walletAddress}
  <WalletConnectButton />
{:else}
  <div class="wallet-adapter-dropdown">
    <WalletButton
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
    </WalletButton>
    {#if isDropDrownVisible}
      <!-- TODO: fix accessability and remove the warning below -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <ul
        aria-label="dropdown-list"
        class="wallet-adapter-dropdown-list wallet-adapter-dropdown-list-active"
        role="menu"
        use:clickOutside={() => {
          if (isDropDrownVisible) {
            closeDropdown();
          }
        }}
      >
        <li
          on:click={copyAddress}
          class="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          {hasRecentlyCopied ? 'Copied' : 'Copy address'}
        </li>
        <li
          on:click={openModal}
          class="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          Connect a different wallet
        </li>
        <li
          on:click={disconnectWallet}
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
    on:connect={connectWallet}
    {maxNumberOfWallets}
  />
{/if}
