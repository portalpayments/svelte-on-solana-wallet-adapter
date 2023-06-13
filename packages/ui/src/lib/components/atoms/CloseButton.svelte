<script lang="ts">
  export let clickHandler: () => void;
</script>

<button on:click={clickHandler}>
  <svg width="14" height="14">
    <path
      d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z"
    />
  </svg>
</button>

<style>
  button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 18px;
    right: 18px;
    padding: 12px;
    cursor: pointer;
    background: transparent;
    border: none;
  }

  button:focus-visible {
    outline-color: white;
  }

  button svg {
    fill: #777;
    transition: fill 200ms ease 0s;
  }

  button:hover svg {
    fill: #999;
  }
</style>
