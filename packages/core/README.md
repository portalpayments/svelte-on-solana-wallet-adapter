# `@portal-payments/wallet-adapter-core`

The core of the wallet adapter is a Svelte Store which exposes methods and properties to run the wallet in your application. This allows to share this data among all components in your application.

## Changelog

### 2.1

- Rename the wallet adapters list from 'wallets' to 'walletAdapters'
- Make walletAdapters be a list of adapters rather than writing an extra object with each wallet's 'readyState' duplicated in the top level
- Remove 'wallet' which duplicated 'adapter' and which was not 

### 2.0

- Update to use current gen JavaScript tooling - npm, prettier, etc.
## Install

```shell
npm install @solana/wallet-adapter-base @solana/wallet-adapter-wallets @solana/web3.js @portal-payments/wallet-adapter-core
```

## Usage

Once the `walletStore` is installed, you can use it and subscribe to its methods as an usual Svelte Store:

```html
<script>
  import { walletStore } from '@portal-payments/wallet-adapter-core';
  //...
</script>

{#if $walletStore?.connected}
  <div>My wallet is connected</div>
{/if}
```

## UI

You will need to add some components for your [SvelteKit](https://kit.svelte.dev/) app, for users to connect, disconnect and see their wallet name or addresses. See `@portal-payments/wallet-adapter-ui`.

[Using SvelteKit](https://github.com/svelte-on-solana/wallet-adapter/blob/master/packages/ui/README.md#sveltekit)
