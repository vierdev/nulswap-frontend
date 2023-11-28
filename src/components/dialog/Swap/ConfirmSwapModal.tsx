import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
} from "@components/MaterialTailwind";

import TransactionFailDialog from "./TransactionFailModal";
import TransactionSuccessDialog from "./TransactionSuccessModal";
import { FaArrowDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Token } from "@/src/types/token";
import Image from "next/image";
import BigNumber from "bignumber.js";
import {
  swapMultiCycleFromMultiToMulti,
  swapMultiCycleFromMultiToNuls,
  swapMultiCycleFromMultiToToken,
  swapMultiCycleFromNulsToMulti,
  swapMultiCycleFromNulsToToken,
  swapMultiCycleFromTokenToMulti,
  swapMultiCycleFromTokenToNuls,
  swapMultiCycleFromTokenToToken,
  swapMultiToMulti,
  swapMultiToNuls,
  swapMultiToToken,
  swapNulsToMulti,
  swapNulsToToken,
  swapTokenToMulti,
  swapTokenToNuls,
  swapTokenToToken,
} from "@/src/api/nulsConnector";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import {
  setIsSwapSuccessed,
  setIsTransactionSuccessed,
} from "@src/redux/swap/Token";
import { getTransactionUrl, setTransactionUrl } from "@/src/redux/swap/Token";

interface ConfirmSwapDialogProps {
  open: boolean;
  fromToken: string;
  toToken: string;
  exchangeRate: string;
  priceImpact: string;
  minimumReceived: string;
  onClose: () => void;
  fromTokenIcon: Token;
  toTokenIcon: Token;
  swapType: string;
  middleTokenAddress: string;
}

const ConfirmSwapDialog: React.FC<ConfirmSwapDialogProps> = ({
  open,
  onClose,
  fromToken,
  toToken,
  exchangeRate,
  priceImpact,
  minimumReceived,
  fromTokenIcon,
  toTokenIcon,
  swapType,
  middleTokenAddress,
}) => {
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] =
    useState<boolean>(false);
  const [isTransactionFailModalOpen, setIsTransactionFailModalOpen] =
    useState<boolean>(false);

  const transaction = useAppSelector(getTransactionUrl);
  const dispatch = useAppDispatch();
  const [transactionFailed, setTransactionFailed] = useState<boolean>(false);

  const accountAddress = useAppSelector(getWalletAddress);

  async function swappping() {
    let swapAmount = new BigNumber(fromToken)
      .multipliedBy(Math.pow(10, fromTokenIcon.decimals))
      .toString();
    let minBought = new BigNumber(minimumReceived)
      .multipliedBy(Math.pow(10, fromTokenIcon.decimals))
      .toString();
    let deadline = 2000000000000;
    if (swapType == "T1") {
      if (fromTokenIcon.type == "Token" && toTokenIcon.type == "Token") {
        swapTokenToToken(
          fromTokenIcon,
          toTokenIcon,
          swapAmount,
          minBought,
          deadline,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessed(true);
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Nuls" && toTokenIcon.type == "Token") {
        swapNulsToToken(
          toTokenIcon,
          swapAmount,
          minBought,
          deadline,
          accountAddress
        )
          .then((res: any) => {
            console.log(res);
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessed(true);
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (toTokenIcon.type == "Nuls" && fromTokenIcon.type == "Token") {
        swapTokenToNuls(
          fromTokenIcon,
          swapAmount,
          minBought,
          deadline,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessed(true);
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Multi" && toTokenIcon.type == "Token") {
        swapMultiToToken(
          toTokenIcon.address,
          fromTokenIcon.chainId,
          fromTokenIcon.asset,
          swapAmount,
          minBought,
          toTokenIcon.decimals,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Token" && toTokenIcon.type == "Multi") {
        swapTokenToMulti(
          fromTokenIcon.address,
          toTokenIcon.chain,
          toTokenIcon.asset,
          swapAmount,
          minBought,
          deadline,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Multi" && toTokenIcon.type == "Multi") {
        swapMultiToMulti(
          fromTokenIcon.chainId,
          fromTokenIcon.asset,
          toTokenIcon.chainId,
          toTokenIcon.asset,
          swapAmount,
          minBought,
          fromTokenIcon.decimals,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Nuls" && toTokenIcon.type == "Multi") {
        swapNulsToMulti(
          toTokenIcon.chainId,
          toTokenIcon.asset,
          swapAmount,
          minBought,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Multi" && toTokenIcon.type == "Nuls") {
        swapMultiToNuls(
          fromTokenIcon.chainId,
          fromTokenIcon.asset,
          swapAmount,
          minBought,
          fromTokenIcon.decimals,
          accountAddress
        )
          .then((res: any) => {
            console.log(res);

            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
    } else {
      if (fromTokenIcon.type == "Token" && toTokenIcon.type == "Token") {
        swapMultiCycleFromTokenToToken(
          fromTokenIcon.address,
          middleTokenAddress,
          toTokenIcon.address,
          swapAmount,
          minBought,
          deadline,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Nuls" && toTokenIcon.type == "Token") {
        swapMultiCycleFromNulsToToken(
          fromTokenIcon.address,
          middleTokenAddress,
          toTokenIcon.address,
          swapAmount,
          minBought,
          deadline,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Token" && toTokenIcon.type == "Nuls") {
        swapMultiCycleFromTokenToNuls(
          fromTokenIcon.address,
          middleTokenAddress,
          toTokenIcon.address,
          swapAmount,
          minBought,
          deadline,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Multi" && toTokenIcon.type == "Token") {
        swapMultiCycleFromMultiToToken(
          fromTokenIcon.address,
          middleTokenAddress,
          toTokenIcon.address,
          fromTokenIcon.chainId,
          fromTokenIcon.asset,
          swapAmount,
          minBought,
          fromTokenIcon.decimals,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Token" && toTokenIcon.type == "Multi") {
        swapMultiCycleFromTokenToMulti(
          fromTokenIcon.address,
          middleTokenAddress,
          toTokenIcon.address,
          toTokenIcon.chainId,
          toTokenIcon.asset,
          swapAmount,
          minBought,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Multi" && toTokenIcon.type == "Multi") {
        swapMultiCycleFromMultiToMulti(
          fromTokenIcon.address,
          middleTokenAddress,
          toTokenIcon.address,
          fromTokenIcon.chainId,
          fromTokenIcon.asset,
          toTokenIcon.chainId,
          toTokenIcon.asset,
          swapAmount,
          minBought,
          fromTokenIcon.decimals,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Nuls" && toTokenIcon.type == "Multi") {
        swapMultiCycleFromNulsToMulti(
          fromTokenIcon.address,
          middleTokenAddress,
          toTokenIcon.address,
          toTokenIcon.chainId,
          toTokenIcon.asset,
          swapAmount,
          minBought,
          deadline,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
      if (fromTokenIcon.type == "Multi" && toTokenIcon.type == "Nuls") {
        swapMultiCycleFromMultiToNuls(
          fromTokenIcon.address,
          middleTokenAddress,
          toTokenIcon.address,
          fromTokenIcon.chainId,
          fromTokenIcon.asset,
          swapAmount,
          minBought,
          fromTokenIcon.decimals,
          accountAddress
        )
          .then((res: any) => {
            dispatch(setTransactionUrl(res));
            setIsTransactionSuccessModalOpen(true);
          })
          .catch((error) => {
            setTransactionFailed(true);
            setIsTransactionFailModalOpen(true);
          });
      }
    }
  }
  return (
    <Dialog
      open={open}
      handler={onClose}
      className="!bg-tertiary shadow-[0_0_5px_#32E08D] rounded-md py-2 md:!w-[366px] !min-w-[300px] !w-[300px] md:!h-[410px] !mx-2 !h-[350px]"
    >
      <DialogHeader className="justify-between px-8">
        <Typography variant="h5" color="blue-gray" className="text-white">
          Confirm Swap
        </Typography>
      </DialogHeader>
      <DialogBody className="px-0 pt-0 pb-5">
        <div className="flex items-center justify-start gap-2 text-[14px] font-bold mx-4 bg-secondary rounded-lg md:py-3 pl-2 py-1">
          <Image
            src={fromTokenIcon.logoURI}
            width={25}
            height={25}
            alt={fromTokenIcon.symbol}
          />
          <Typography className="uppercase text-[14px] text-white">
            {fromToken == "NaN" ? "0.00" : fromToken}
          </Typography>
        </div>
        <div className="flex justify-center items-center md:my-5 my-3">
          <div className="text-white cursor-pointer">
            <FaArrowDown />
          </div>
        </div>
        <div className="flex items-center justify-start gap-2 text-[14px] font-bold mx-4 bg-secondary rounded-lg md:py-3 py-1 pl-2">
          <Image
            src={toTokenIcon.logoURI}
            width={25}
            height={25}
            alt={toTokenIcon.symbol}
          />
          <Typography className="uppercase text-[14px] text-white">
            {toToken == "NaN" ? "0.00" : toToken}
          </Typography>
        </div>
        <div className="flex-column mt-5 px-3">
          <div className="flex justify-between items-center px-2 py-1">
            <Typography variant="small" className="text-white">
              Exchange Rate:
            </Typography>
            <Typography variant="small" className="text-[#32E08D]">
              {exchangeRate === "NaN" ? "0.00" : exchangeRate}{" "}
              {`${fromTokenIcon.symbol}/${toTokenIcon.symbol}`}
            </Typography>
          </div>
          <div className="flex justify-between items-center px-2 py-1">
            <Typography variant="small" className="text-white">
              Price Impact:
            </Typography>
            <Typography variant="small" className="text-[#32E08D]">
              {priceImpact === "NaN" ? "0.00" : priceImpact} %
            </Typography>
          </div>
          <div className="flex justify-between items-center px-2 py-1">
            <Typography variant="small" className="text-white">
              Minimum Received:
            </Typography>
            <Typography variant="small" className="text-[#32E08D]">
              {minimumReceived}
            </Typography>
          </div>
        </div>
        <div className="px-4 md:pt-5 pt-3 flex justify-between gap-2">
          <Button
            className="!w-[160px] bg-primary"
            onClick={() => {
              swappping();
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
            transactionUrl={transaction}
            onClose={() => {
              setIsTransactionSuccessModalOpen(false),
              dispatch(setIsSwapSuccessed(false));
            }}
          />
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ConfirmSwapDialog;
