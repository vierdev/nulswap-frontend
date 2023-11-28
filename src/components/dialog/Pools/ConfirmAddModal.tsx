"use client";

import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Typography,
} from "@components/MaterialTailwind";

import Image from "next/image";

import TransactionFailDialog from "../Swap/TransactionFailModal";
import TransactionSuccessDialog from "../Swap/TransactionSuccessModal";
import { BsPlusLg } from "react-icons/bs";

import { useState } from "react";
import { Token } from "@/src/types/token";
import {
  addLiquidityMultitoMulti,
  addLiquidityNulstoMulti,
  addLiquidityNulsToToken,
  addLiquidityTokentoMulti,
  addLiquidityTokentoToken,
  getPair,
  updatePair,
} from "@/src/api/nulsConnector";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import {
  getTransactionUrl,
  setIsAddLiquiditySuccessed,
  setTransactionUrl,
} from "@/src/redux/swap/Token";
import BigNumber from "bignumber.js";
import { getTolerance } from "@/src/redux/swap/tolerance";

interface ConfirmSwapDialogProps {
  open: boolean;
  amountTokenA: string;
  amountTokenB: string;
  liquidityMinted: string;
  poolShare: string;
  tokenA: Token;
  tokenB: Token;
  onClose: () => void;
}

const ConfirmSwapDialog: React.FC<ConfirmSwapDialogProps> = ({
  open,
  onClose,
  amountTokenA,
  amountTokenB,
  tokenA,
  tokenB,
  liquidityMinted,
  poolShare,
}) => {
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] =
    useState<boolean>(false);
  const [isTransactionFailModalOpen, setIsTransactionFailModalOpen] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();

  const address = useAppSelector(getWalletAddress);

  const slippage = useAppSelector(getTolerance);

  const transactionUrl = useAppSelector(getTransactionUrl);

  let minLPtoken = new BigNumber(liquidityMinted)
    .multipliedBy(BigNumber(100).minus(BigNumber(slippage)))
    .dividedBy(100)
    .multipliedBy(Math.pow(10, 8));

  async function addingLiquidity() {
    if (tokenA.type == "Nuls" && tokenB.type == "Token") {
      addLiquidityNulsToToken(
        tokenB.address,
        Number(minLPtoken.minus(1).toFixed(0)),
        amountTokenA,
        amountTokenB,
        tokenA.decimals,
        tokenB.decimals,
        address
      )
        .then((res: string) => {
          dispatch(setTransactionUrl(res));
          setIsTransactionSuccessModalOpen(true);
        })
        .catch((err) => {
          console.log(err);
          setIsTransactionFailModalOpen(true);
        });
    }
    if (tokenB.type == "Nuls" && tokenA.type == "Token") {
      addLiquidityNulsToToken(
        tokenA.address,
        Number(minLPtoken.minus(1).toFixed(0)),
        amountTokenB,
        amountTokenA,
        tokenB.decimals,
        tokenA.decimals,
        address
      )
        .then((res: string) => {
          dispatch(setTransactionUrl(res));
          setIsTransactionSuccessModalOpen(true);
          // updatePair(pairAddress, address)
          //   .then((res: any) => {
          //     console.log(res);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err) => {
          console.log(err);
          setIsTransactionFailModalOpen(true);
        });
    }
    if (tokenA.type == "Nuls" && tokenB.type == "Multi") {
      addLiquidityNulstoMulti(
        tokenB.chain,
        tokenB.asset,
        "1",
        amountTokenA,
        amountTokenB,
        tokenA.decimals,
        tokenB.decimals,
        address
      )
        .then((res: string) => {
          dispatch(setTransactionUrl(res));
          setIsTransactionSuccessModalOpen(true);
          // updatePair(pairAddress, address)
          //   .then((res: any) => {
          //     console.log(res);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err) => {
          console.log(err);
          setIsTransactionFailModalOpen(true);
        });
    }
    if (tokenB.type == "Nuls" && tokenA.type == "Multi") {
      addLiquidityNulstoMulti(
        tokenA.chain,
        tokenA.asset,
        "1",
        amountTokenB,
        amountTokenA,
        tokenB.decimals,
        tokenA.decimals,
        address
      )
        .then((res: string) => {
          dispatch(setTransactionUrl(res));
          setIsTransactionSuccessModalOpen(true);
          // updatePair(pairAddress, address)
          //   .then((res: any) => {
          //     console.log(res);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err) => {
          console.log(err);
          setIsTransactionFailModalOpen(true);
        });
    }
    if (tokenA.type == "Token" && tokenB.type == "Token") {
      addLiquidityTokentoToken(
        tokenA.address,
        tokenB.address,
        "1",
        amountTokenA,
        amountTokenB,
        tokenA.decimals,
        tokenB.decimals,
        address
      )
        .then((res: string) => {
          dispatch(setTransactionUrl(res));
          setIsTransactionSuccessModalOpen(true);
          // updatePair(pairAddress, address)
          //   .then((res: any) => {
          //     console.log(res);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err) => {
          console.log(err);
          setIsTransactionFailModalOpen(true);
        });
    }
    if (tokenA.type == "Token" && tokenB.type == "Multi") {
      addLiquidityTokentoMulti(
        tokenA.address,
        tokenB.chain,
        tokenB.asset,
        "1",
        amountTokenA,
        amountTokenB,
        tokenA.decimals,
        tokenB.decimals,
        address
      )
        .then((res: string) => {
          dispatch(setTransactionUrl(res));
          setIsTransactionSuccessModalOpen(true);
          // updatePair(pairAddress, address)
          //   .then((res: any) => {
          //     console.log(res);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err) => {
          console.log(err);
          setIsTransactionFailModalOpen(true);
        });
    }
    if (tokenB.type == "Token" && tokenA.type == "Multi") {
      addLiquidityTokentoMulti(
        tokenB.address,
        tokenA.chain,
        tokenA.asset,
        "1",
        amountTokenB,
        amountTokenA,
        tokenB.decimals,
        tokenA.decimals,
        address
      )
        .then((res: string) => {
          dispatch(setTransactionUrl(res));
          setIsTransactionSuccessModalOpen(true);
          // updatePair(pairAddress, address)
          //   .then((res: any) => {
          //     console.log(res);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err) => {
          console.log(err);
          setIsTransactionFailModalOpen(true);
        });
    }
    if (tokenA.type == "Multi" && tokenB.type == "Multi") {
      addLiquidityMultitoMulti(
        tokenA.chain,
        tokenB.chain,
        tokenA.asset,
        tokenB.asset,
        "1",
        amountTokenA,
        amountTokenB,
        tokenA.decimals,
        tokenB.decimals,
        address
      )
        .then((res: string) => {
          dispatch(setTransactionUrl(res));
          setIsTransactionSuccessModalOpen(true);
          // updatePair(pairAddress, address)
          //   .then((res: any) => {
          //     console.log(res);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err: any) => {
          setIsTransactionFailModalOpen(true);
        });
    }
  }

  return (
    <Dialog
      open={open}
      handler={onClose}
      className="!bg-tertiary shadow-[0_0_5px_#32E08D] rounded-md py-2 md:!w-[366px] !min-w-[300px] !w-[300px] md:!h-[380px] mx-2"
    >
      <DialogHeader className="justify-between px-8">
        <Typography
          variant="h5"
          color="blue-gray"
          className="text-white md:text-[20px] text-[18px]"
        >
          Confirm Add Liquidity
        </Typography>
      </DialogHeader>
      <DialogBody className="px-0 pt-0 pb-5">
        <div className="flex items-center justify-start gap-2 text-[14px] font-bold mx-4 bg-secondary rounded-lg py-3 pl-2">
          <Image
            src={tokenA.logoURI}
            width={25}
            height={25}
            alt={tokenA.symbol}
          />
          <Typography className="uppercase text-[14px] text-white">
            {amountTokenA == "NaN" || amountTokenA == "0"
              ? "0.00"
              : amountTokenA}
          </Typography>
        </div>
        <div className="flex justify-center items-center my-5">
          <div className="text-white">
            <BsPlusLg />
          </div>
        </div>
        <div className="flex items-center justify-start gap-2 text-[14px] font-bold mx-4 bg-secondary rounded-lg py-3 pl-2">
          <Image
            src={tokenB.logoURI}
            width={25}
            height={25}
            alt={tokenB.symbol}
          />
          <Typography className="uppercase text-[14px] text-white">
            {amountTokenB == "NaN" || amountTokenB == "0"
              ? "0.00"
              : amountTokenB}
          </Typography>
        </div>
        <div className="flex-column md:mt-5 mt-3 px-3">
          <div className="flex justify-between items-center px-2 py-1">
            <Typography variant="small" className="text-white">
              Liquidity Minted:
            </Typography>
            <Typography variant="small" className="text-[#32E08D]">
              {liquidityMinted} LP
            </Typography>
          </div>
          <div className="flex justify-between items-center px-2 py-1">
            <Typography variant="small" className="text-white">
              Share of Pool:
            </Typography>
            <Typography variant="small" className="text-[#32E08D]">
              {poolShare} %
            </Typography>
          </div>
        </div>
        <div className="px-4 md:pt-5 flex justify-between gap-2 pt-2">
          <Button
            className="!w-[160px] bg-primary"
            onClick={() => {
              addingLiquidity();
            }}
          >
            Confirm
          </Button>
          <Button className="!w-[160px] bg-gray-600" onClick={onClose}>
            Cancel
          </Button>
          <TransactionFailDialog
            open={isTransactionFailModalOpen}
            onClose={() => {
              setIsTransactionFailModalOpen(false);
            }}
          />
          <TransactionSuccessDialog
            open={isTransactionSuccessModalOpen}
            onClose={() => {
              setIsTransactionSuccessModalOpen(false);
              dispatch(setIsAddLiquiditySuccessed(false));
            }}
            transactionUrl={transactionUrl}
          />
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ConfirmSwapDialog;
