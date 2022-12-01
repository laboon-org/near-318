import { Network, NetworkId } from '@near-wallet-selector/core';

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'dev-1669276348138-46454457071538';

export const networkInUse: Network | NetworkId = "testnet";