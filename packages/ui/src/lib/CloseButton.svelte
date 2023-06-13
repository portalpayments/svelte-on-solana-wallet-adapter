<script lang="ts">
  export let clickHandler: () => void;
</script>

<button on:click={clickHandler} class="wallet-adapter-modal-button-close">
  <svg width="14" height="14">
    <path
      d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z"
    />
  </svg>
</button>
