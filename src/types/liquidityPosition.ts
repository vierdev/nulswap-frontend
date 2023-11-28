import { Token } from "./token"

export type LP = {
  LPamount: string,
  addressTokenA: string,
  addressTokenB: string,
  pooledTokenAname: string,
  pooledTokenBname: string,
  tokenADecimal: number,
  tokenBDecimal: number,
  tokenAreserve: string,
  tokenBreserve: string,
  pair: string,
  totalAmount:string
}