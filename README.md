# `@svelte-on-solana/wallet-adapter`

![Wallets](wallets-adapter.png)

Modular TypeScript wallet adapter and UI components for Solana/Anchor applications using [SvelteJS](https://svelte.dev/) as framework. This package contains a solution for [SvelteKit](https://kit.svelte.dev/), making it possible to build Solana Dapps in SPA or SSR mode.

[View demo](https://solana-svelte-counter.netlify.app/) / [Browse demo code](https://github.com/silvestrevivo/solana-svelte-counter/)

## Packages

- [Core](https://github.com/svelte-on-solana/wallet-adapter/blob/master/packages/core/README.md/) - Svelte Store which exposes methods and properties to run the wallet in your application
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

