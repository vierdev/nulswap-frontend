import {
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
  Button,
} from "@components/MaterialTailwind";
14;
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";

import TransactionFailDialog from "../Swap/TransactionFailModal";
import TransactionSuccessDialog from "../Swap/TransactionSuccessModal";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  getTransactionUrl,
  setIsTransactionSuccessed,
  setIsUnstakeSuccessed,
  setTransactionUrl,
} from "@/src/redux/swap/Token";
import { unstakeNswap, unstakeNuls } from "@/src/api/nulsConnector";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";

interface UnstakeDialogDialogProps {
  open: boolean;
  onClose: () => void;
}

const UnstakeDialogDialog: React.FC<UnstakeDialogDialogProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] =
    useState<boolean>(false);
  const [isTransactionFailModalOpen, setIsTransactionFailModalOpen] =
    useState<boolean>(false);

  const transactionUrl = useAppSelector(getTransactionUrl);

  const address = useAppSelector(getWalletAddress);

  return (
    <Dialog
      open={open}
      handler={onClose}
      className="!bg-tertiary  shadow-[0_0_15px_#32E08D] rounded-3xl py-2 md:!w-[340px] !w-[300px] !min-w-[300px] mx-2"
    >
      <DialogHeader className="justify-between px-8">
        <Typography variant="h5" className="text-white">
          Unstake NSWAP
        </Typography>
        <div className="hover:text-gray-500 cursor-pointer text-white">
          <RxCross2 onClick={onClose} />
        </div>
      </DialogHeader>
      <DialogBody className="overflow-y-auto px-0 pt-0">
        <div className="flex-col justify-center">
          <div className="flex justify-center">
            <Typography className="text-white text-[22px] font-bold">
              Getting Ready to
            </Typography>
          </div>
          <div className="flex justify-center pt-0">
            <Typography className="text-white text-[22px] font-bold">
              Unstake Your $
            </Typography>
            <Typography className="text-[#32E08D] text-[22px] font-bold">
              NSWAP
            </Typography>
            <Typography className="text-white text-[22px] font-bold">
              ?
            </Typography>
          </div>
        </div>
        <div className="flex-col justify-center">
          <div className="flex justify-center">
            <Typography className="text-[14px] mt-5 mb-4 text-white">
              Here&apos;s what you need to know:
            </Typography>
          </div>
          <div className="flex-col justify-center">
            <div className="flex justify-center">
              <Typography className="text-[14px] text-white">
                If you&apos;ve staked in the last&nbsp;
              </Typography>
              <Typography className="text-primary text-[14px]">
                21 days
              </Typography>
              <Typography className="text-[14px] text-white">,</Typography>
            </div>
            <div className="flex justify-center">
              <Typography className="text-[14px] text-white">
                hold on a bit longer to unstake your $NSWAP.
              </Typography>
            </div>
          </div>
          <div className="flex-col justify-center mt-3">
            <div className="flex justify-center">
              <Typography className="text-[14px] text-white">
                If you&apos;re staking $aNSWAP on
              </Typography>
            </div>
            <div className="flex justify-center">
              <Typography className="text-[14px] text-white">
                ohter platforms, start by unstaking there.
              </Typography>
            </div>
          </div>
          <div className="flex-col justify-center my-3">
            <div className="flex justify-center">
              <Typography className="text-[14px] text-white">
                Enjoy your well-earned rewards
              </Typography>
            </div>
            <div className="flex justify-center">
              <Typography className="text-[14px] text-white">
                and keep staking happily!
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <Button
            className="!bg-primary rounded-xl mt-[10px] !w-[180px] px-0"
            onClick={() => {
              unstakeNswap(address)
                .then((res: any) => {
                  dispatch(setTransactionUrl(res));
                  setIsTransactionSuccessModalOpen(true);
                })
                .catch((err: any) => {
                  setIsTransactionFailModalOpen(true);
                });
            }}
          >
            Unstake
          </Button>
        </div>
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
            dispatch(setIsUnstakeSuccessed(false));
          }}
          transactionUrl={transactionUrl}
        />
      </DialogBody>
    </Dialog>
  );
};

export default UnstakeDialogDialog;
