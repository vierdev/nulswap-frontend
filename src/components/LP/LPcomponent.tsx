import { Button, Input, Typography } from "@material-tailwind/react";
import { BiChevronDown } from "react-icons/bi";
import TransactionFailDialog from "../dialog/Swap/TransactionFailModal";
import TransactionSuccessDialog from "../dialog/Swap/TransactionSuccessModal";
import { useState } from "react";
import { LP } from "@src/types/liquidityPosition";
import BigNumber from "bignumber.js";
import { removeLiquidity, updatePair } from "@/src/api/nulsConnector";
import { Token } from "@/src/types/token";
import tokenList from "@/src/tokens/tokenList";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import {
  getIsRemovedLiquidity,
  getTransactionUrl,
  setIsRemovedLiquidity,
  setRemovedPairAddress,
  setTransactionUrl,
} from "@/src/redux/swap/Token";

interface LPcomponentProps {
  LPaccount: LP;
}

const LPcomponent: React.FC<LPcomponentProps> = ({ LPaccount }) => {
  const [isShowRemoveButton, setIsShowRemoveButton] = useState<boolean>(true);
  const [removeAmount, setRemoveAmount] = useState<string>("");
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] =
    useState<boolean>(false);
  const [isTransactionFailModalOpen, setIsTransactionFailModalOpen] =
    useState<boolean>(false);
  const [isAccountInfoShow, setIsAccountInfoShow] = useState<boolean>(false);

  const transactionUrl = useAppSelector(getTransactionUrl);

  const address = useAppSelector(getWalletAddress);

  const isRemovedLiquidity = useAppSelector(getIsRemovedLiquidity);

  const dispatch = useAppDispatch();

  async function excuteRemoveLiquidity() {
    let tokenA: Token | undefined = tokenList.tokens.find(
      (token) => token.address === LPaccount.addressTokenA
    );
    let tokenB: Token | undefined = tokenList.tokens.find(
      (token) => token.address === LPaccount.addressTokenB
    );

    tokenA = tokenA ? tokenA : tokenList.from;

    tokenB = tokenB ? tokenB : tokenList.to;

    let amount = BigNumber(LPaccount.LPamount)
      .multipliedBy(BigNumber(removeAmount))
      .dividedBy(100)
      .toFixed(0)
      .toString();

    removeLiquidity(tokenA, tokenB, amount, 1, 1, address)
      .then((res: any) => {
        dispatch(setTransactionUrl(res));
        dispatch(setIsRemovedLiquidity(!isRemovedLiquidity));
        dispatch(setRemovedPairAddress(LPaccount.pair))
        setIsTransactionSuccessModalOpen(true);
      })
      .catch((err: any) => {
        setIsTransactionFailModalOpen(true);
        console.log(err);
      });
  }

  return (
    <>
      <div className="flex justify-between bg-secondary px-4 rounded-xl mb-2 items-center">
        <Typography className="text-center text-white">
          {LPaccount.pair.substring(0, 8) +
            "..." +
            LPaccount.pair.substring(LPaccount.pair.length - 5)}
        </Typography>
        <div
          className="flex justify-center bg-transparent items-center py-4 hover:cursor-pointer"
          onClick={() => {
            setIsAccountInfoShow((prev) => !prev);
          }}
        >
          <div className="text-[20px] text-white ">
            <BiChevronDown />
          </div>
          <Typography className="text-white">Manage</Typography>
        </div>
      </div>
      {isAccountInfoShow && (
        <>
          <div className="flex justify-between mb-4">
            <Typography className="text-white">
              Your total pool tokens:
            </Typography>
            <Typography className="text-[#32E08D]">
              {BigNumber(LPaccount.LPamount)
                .dividedBy(Math.pow(10, 8))
                .toString()}
            </Typography>
          </div>
          <div className="flex justify-between mb-4">
            <Typography className="text-white">
              Pooled {LPaccount.pooledTokenAname}:
            </Typography>
            <Typography className="text-[#32E08D]">
              {BigNumber(LPaccount.LPamount)
                .multipliedBy(LPaccount.tokenAreserve)
                .dividedBy(LPaccount.totalAmount)
                .dividedBy(Math.pow(10, LPaccount.tokenADecimal))
                .toFixed(5)
                .toString()}
            </Typography>
          </div>
          <div className="flex justify-between mb-4">
            <Typography className="text-white">
              Pooled {LPaccount.pooledTokenBname}:
            </Typography>
            <Typography className="text-[#32E08D]">
              {BigNumber(LPaccount.LPamount)
                .multipliedBy(LPaccount.tokenBreserve)
                .dividedBy(LPaccount.totalAmount)
                .dividedBy(Math.pow(10, LPaccount.tokenBDecimal))
                .toFixed(5)
                .toString()}
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography className="text-white">Your Pool Share:</Typography>
            <Typography className="text-[#32E08D]">
              {BigNumber(LPaccount.LPamount)
                .dividedBy(BigNumber(LPaccount.totalAmount))
                .toFixed(5)
                .toString()}
            </Typography>
          </div>

          {isShowRemoveButton && (
            <Button
              variant="filled"
              className="bg-primary w-full my-4"
              onClick={() => setIsShowRemoveButton(false)}
            >
              Remove
            </Button>
          )}
          {!isShowRemoveButton && (
            <>
              <Typography className="mt-4 mb-2 text-white font-bold">
                Select Amount To Remove
              </Typography>
              <Input
                type="number"
                value={removeAmount}
                onChange={(e) => setRemoveAmount(String(e.target.value))}
                placeholder="Ex:50"
                className="!bg-white rounded !border-t-blue-gray-200 focus:!border-t-gray-900 h-[30px]"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
                crossOrigin={undefined}
              />
              <div className="flex gap-3 pt-2">
                <Button
                  className="text-white !bg-tertiary !border border-[#32E08D] !px-3"
                  onClick={() => setRemoveAmount("25")}
                >
                  25%
                </Button>
                <Button
                  className="text-white !bg-tertiary !border border-[#32E08D] !px-3"
                  onClick={() => setRemoveAmount("50")}
                >
                  50%
                </Button>
                <Button
                  className="text-white !bg-tertiary !border border-[#32E08D] !px-3"
                  onClick={() => setRemoveAmount("75")}
                >
                  75%
                </Button>
                <Button
                  className="text-white !bg-tertiary !border border-[#32E08D] !px-2"
                  onClick={() => setRemoveAmount("100")}
                >
                  100%
                </Button>
              </div>
              <div className="flex justify-center gap-2 mt-3 mb-[30px]">
                <Button
                  className="bg-primary w-1/2"
                  onClick={() => {
                    excuteRemoveLiquidity();
                  }}
                >
                  Remove Liquidity
                </Button>
                <Button
                  className="bg-gray-600 w-1/2"
                  onClick={() => setIsShowRemoveButton(true)}
                >
                  Cancel
                </Button>
              </div>
              {
                <TransactionFailDialog
                  open={isTransactionFailModalOpen}
                  onClose={() => setIsTransactionFailModalOpen(false)}
                />
              }
              {
                <TransactionSuccessDialog
                  open={isTransactionSuccessModalOpen}
                  onClose={() => setIsTransactionSuccessModalOpen(false)}
                  transactionUrl={transactionUrl}
                />
              }
            </>
          )}
        </>
      )}
    </>
  );
};

export default LPcomponent;
