<script lang="ts">
  import { stringify } from "../../utils";
  export let text: string | null = null;
  export let icon: string | null = null;
  export let isLoadingNameAndProfilePicture: boolean = false;
  export let isIconAProfilePicture: boolean = false;
  export let isDisabled: boolean = false;
</script>

<button
  disabled={isDisabled}
  class={isLoadingNameAndProfilePicture ? "is-loading-name-and-profile-picture" : ""}
  on:click
>
  <div class="sweeper" />
  {#if icon}
    <img class={`icon ${isIconAProfilePicture ? "profile-picture" : ""}`} src={icon} alt="icon" />
  {/if}
  {text}
</button>

<style>
  button {
    /* Requied for absolutely positioned elements elsewhere */
    position: relative;
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

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    aspect-ratio: 1;
  }

  button:has(.profile-picture) {
    padding-left: 4px;
  }

  /* User pictures are bigger and round */
  .icon.profile-picture {
    border-radius: 50%;
    width: 38px;
  }

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
    animation: sweep 4500ms ease-out 0s infinite normal none;
  }

  @keyframes sweep {
    0% {
      width: 20%;
      opacity: 0;
      background: linear-gradient(90deg, #ffffff00, #9945ff22);
    }

    32% {
      width: 100%;
      opacity: 1;
      background: linear-gradient(90deg, #ffffff00, #9945ff22);
    }

    33% {
      width: 20%;
      opacity: 0;
      background: linear-gradient(90deg, #ffffff00, #00c2ff22);
    }

    65% {
      width: 100%;
      opacity: 1;
      background: linear-gradient(90deg, #ffffff00, #00c2ff22);
    }

    66% {
      width: 20%;
      opacity: 0;
      background: linear-gradient(90deg, #ffffff00, #14f19522);
    }

    100% {
      width: 100%;
      opacity: 1;
      background: linear-gradient(90deg, #ffffff00, #14f19522);
    }
  }
</style>
