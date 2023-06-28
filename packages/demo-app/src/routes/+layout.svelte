<script lang="ts">
  import { onMount } from 'svelte';
  import { WalletProvider, ConnectionProvider } from '@portal-payments/wallet-adapter-ui';

  const localStorageKey = 'walletAdapter';
  const network = 'http://127.0.0.1:8899';

  let walletAdapters;

  onMount(async () => {
    // Svelte adapter doesn't yet support wallet standard. See
    // https://github.com/solana-labs/wallet-adapter/issues/788
    // TODO: update when that's fixed to remove all these unneccessary wallet adapters
    const { PhantomWalletAdapter, GlowWalletAdapter, SolflareWalletAdapter, BackpackWalletAdapter } = await import(
      '@solana/wallet-adapter-wallets'
    );

    walletAdapters = [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ];
  });
</script>

<WalletProvider {localStorageKey} wallets={walletAdapters} autoConnect />
<ConnectionProvider {network} />
<slot />
