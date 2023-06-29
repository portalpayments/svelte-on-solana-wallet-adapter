<script lang="ts">
  import { stringify, log } from "../../utils";
  import { onMount } from "svelte";

  export let status: string | null = null;
  export let walletAdapterIcon: string | null = null;
  export let profilePicture: string | null = null;
  export let isLoadingNameAndProfilePicture: boolean = false;
  export let isDisabled: boolean = false;
</script>

<button
  disabled={isDisabled}
  class={`
      ${isLoadingNameAndProfilePicture ? "is-loading-name-and-profile-picture" : ""} 
      ${profilePicture ? "has-profile-picture" : ""}
    }`}
  on:click
>
  <div class="sweeper" />
  {#if status !== "Connect wallet"}
    {#if walletAdapterIcon || walletAdapterIcon}
      <!-- Wrapper element is necessary to avoid text jumping around while icons zoom in -->
      <div class="icons">
        <!-- These are two seperate images, because one will fade away and be replaced by the other -->

        <img class="wallet-adapter icon" src={walletAdapterIcon} alt="icon" />

        <img class="profile-picture icon" src={profilePicture} alt="icon" />
      </div>
    {/if}
  {/if}
  <div class={`status ${status !== "Connect wallet" ? "sliding" : ""}`}>{status}</div>
</button>

<style>
  button {
    /* Requied for absolutely positioned elements elsewhere */
    position: relative;
    /* Expand when we get a name (since it's probably longer than the wallet address) */
    transition: all 500ms ease-in-out;
    /* Gradient border hack below 
      Colors from https://solana.com/branding 
      Then ran through https://www.learnui.design/tools/gradient-generator.html to remove gray dead-zone
      with Precision set to 1 */
    background: linear-gradient(90deg, #9945ff, #00c2ff, #14f195);
    /* Fill the inside with white */
    background-origin: border-box;
    box-shadow: inset 0 1000px white;
    /* A transaprent border, so the very edge of the button shows through */
    border: 2px solid transparent;
  }

  button:has(.icon) {
    padding-left: 4px;
    padding-right: 16px;
  }

  /* Sweeps subtle waves from left to right while we load */
  .sweeper {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    padding: 1px;
    border-radius: 0px 24px 24px 0px;
    width: 20%;
    opacity: 0;
    background: linear-gradient(90deg, #ffffff00, #9945ff22);
    transform-origin: left center;
  }

  button.is-loading-name-and-profile-picture .sweeper {
    animation: sweep 500ms ease-out 0s infinite normal none;
  }

  /* Wrapper element is necessary to avoid text jumping around while icons zoom in */
  .icons {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    border-radius: 50%;
    aspect-ratio: 1;
  }

  button.has-profile-picture .icon.wallet-adapter {
    display: none;
  }

  .icon {
    max-width: 100%;
    border-radius: 50%;
  }

  .icon.wallet-adapter {
    animation: fadeInAndScale 1000ms;
  }

  .icon.profile-picture {
    display: none;
  }

  button.has-profile-picture .icon.profile-picture {
    display: grid;
    animation: fadeInAndScale 2000ms;
  }
  .status.sliding {
    animation: fadeInAndSlide 500ms;
  }

  @keyframes sweep {
    0% {
      width: 20%;
      opacity: 0;
      background: linear-gradient(90deg, #ffffff00, #9945ff22);
    }

    50% {
      background: linear-gradient(90deg, #ffffff00, #00c2ff22);
    }

    100% {
      width: 100%;
      opacity: 1;
      background: linear-gradient(90deg, #ffffff00, #14f19522);
    }
  }

  @keyframes fadeInAndScale {
    from {
      opacity: 0;
      transform: scale(0.4);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeInAndSlide {
    from {
      transform: translateX(-24px);
      opacity: 0;
    }

    to {
      opacity: 1;
      transform: translateX(0px);
    }
  }
</style>
