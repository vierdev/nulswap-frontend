export type Token = {
  id: number;
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
  type: string;
  chain: number;
  asset: number;
  tags: string[];
}

export type TokenList = {
  destination: string;
  from: Token;
  to: Token;
  initial: Token;
  tokens: Token[];
}

export type TokenBalance = {
  name: string;
  balance: string;
}