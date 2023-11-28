import {
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
  Button
} from "@components/MaterialTailwind";
import { IoIosWarning } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

interface TransactionFailDialogProps {
  open: boolean;
  onClose: () => void;
}

const TransactionFailDialog: React.FC<TransactionFailDialogProps> = ({
  open,
  onClose,
}) => {

  const newLocal = "text-[12px] text-white";
  return (
    <Dialog
      open={open}
      handler={onClose}
      className="!bg-tertiary  !border border-[#32E08D] rounded-lg py-2 md:!w-[340px] !w-[300px] !min-w-[290px] !mx-2"
    >
      <DialogHeader className="justify-end px-8">
        <div className="hover:text-gray-500 cursor-pointer text-white">
          <RxCross2 onClick={onClose} />
        </div>
      </DialogHeader>
      <DialogBody className="overflow-y-auto px-0 pt-0">
      <div className="flex justify-center text-[60px] ">
          <IoIosWarning className="text-red" />
        </div>
        <div className="flex-col justify-center">
          <div className="flex justify-center">
            <Typography className="text-[20px] my-5 text-white font-bold">
              Transaction Failed
            </Typography>
          </div>
          <div className="flex-col justify-center">
          <div className="flex justify-center">
            <Typography className={newLocal}>
              We&apos;re sorry, but the transaction couldn&apos;t be 
            </Typography>
          </div>
          <div className="flex justify-center">
            <Typography className="text-[12px] text-white">
              completed
            </Typography>
          </div>
          </div>
          <div className="flex justify-center mt-5">
            <Typography className="text-[12px] text-white">
              Please retry the operation
            </Typography>
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <Button className="!border border-[#32E08D] rounded-xl mt-[10px] !w-[180px] px-0" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default TransactionFailDialog;
