# `@portal-payments/wallet-adapter`

> A (hopefully temporary) fork of https://github.com/svelte-on-solana/wallet-adapter with a large amount of fixes, built for current JS standards and tooling (fixing warnings, using normal JS formatting, npm, ESM, current SvelteKit, updated documentation, etc).

Notable changes:

 - Support wallet names.
 - Support profile pictures ('PFPs').
 - Wallet adapters that are installed are shown first
 - Old types are in the process of being renamed. Eg wallet adapters are called 'WalletAdapter' not 'wallet'. This is intended to make code easier to read, avoiding code that confuses wallet adapters with wallet addresses.
 - TODO: support wallet standard, as individual wallet adapters are no longer necessary.

TypeScript wallet adapter and UI components for Solana applications using [Svelte](https://svelte.dev/). This package supports [SvelteKit](https://kit.svelte.dev/), making it possible to build Solana Dapps in SPA or SSR mode, as well as Svelte stores for both vanilla Solana and Anchor connections.

Updated original docs below:

---------------------------------------------------------

[View demo](https://solana-svelte-counter.netlify.app/) / [Browse demo code](https://github.com/silvestrevivo/solana-svelte-counter/)

## Packages

- [Core](https://github.com/svelte-on-solana/wallet-adapter/blob/master/packages/core/README.md/) - Svelte Store which exposes methods and properties to connect to wallet adapters  your application
- [UI](https://github.com/svelte-on-solana/wallet-adapter/blob/master/packages/ui/README.md) - Pre-built components for integrating with Solana wallets using Svelte
- [Anchor](https://github.com/svelte-on-solana/wallet-adapter/blob/master/packages/anchor/README.md) - Helper components for working with Anchor

## Build from Source

1. Clone the project:
```shell
git clone https://github.com/svelte-on-solana/wallet-adapter.git
```

2. Install dependencies:
```shell
cd wallet-adapter
npm install
```

3. Build all packages:
```shell
npm run build
```

4. Run locally:
```shell
cd packages/ui/
npm start
```

