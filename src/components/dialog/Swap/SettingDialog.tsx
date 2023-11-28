import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Typography,
} from "@components/MaterialTailwind";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getTolerance, setTolerance } from "@/src/redux/swap/tolerance";
import { useAppSelector } from "@/src/redux/hooks";

interface SettingDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingDialog: React.FC<SettingDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const tolerance = useAppSelector(getTolerance);
  // const [tolerance, setStateTolerance] = useState<string>("");
  return (
    <Dialog
      open={open}
      handler={onClose}
      className="!bg-tertiary shadow-[0_0_5px_#32E08D] rounded-md py-2 md:!w-[366px] !w-[300px] !min-w-[280px] !h-[300px] mx-2"
    >
      <DialogHeader className="justify-between px-8">
        <Typography variant="h5" color="blue-gray" className="text-white">
          Transaction Settings
        </Typography>
        <div className="hover:text-gray-500 cursor-pointer text-white">
          <RxCross2 onClick={onClose} />
        </div>
      </DialogHeader>
      <DialogBody className="px-0 pt-0 pb-5" tabIndex={0}>
        <div className="mt-6 pb-2 px-8">
          <Typography variant="small" color="blue-gray" className="text-white">
            Slippage Tolerance
          </Typography>
        </div>
        <Input
          type="text"
          className="!bg-tertiary text-white !border-t-[#32E08D] !border-[#32E08D] focus:!border-t-gray-700 focus:!border-gray-700 !h-[50px] flex-1 mr-10 ml-4 mt-2"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          containerProps={{
            className: "min-w-0 flex flex-1 items-center",
          }}
          onChange={(e) => {
            dispatch(setTolerance(e.target.value));
          }}
          crossOrigin={undefined}
          value={tolerance}
          placeholder="3%"
          tabIndex={-1}
          pattern="[0-9]*"
          inputMode="numeric"
        />
        <div className="flex gap-3 px-4 pt-5">
          <Button
            className="text-white !bg-tertiary !border border-[#32E08D] !px-2"
            onClick={() => dispatch(setTolerance("1.5"))}
          >
            1.5%
          </Button>
          <Button
            className="text-white !bg-tertiary !border border-[#32E08D] !px-3"
            onClick={() => dispatch(setTolerance("2"))}
          >
            2%
          </Button>
          <Button
            className="text-white !bg-tertiary !border border-[#32E08D] !px-3"
            onClick={() => dispatch(setTolerance("5"))}
          >
            5%
          </Button>
          <Button
            className="text-white !bg-tertiary !border border-[#32E08D] !px-2"
            onClick={() => dispatch(setTolerance("10"))}
          >
            10%
          </Button>
        </div>
        <div className="px-4 pt-5 flex justify-between gap-2">
          <Button
            className="!w-[160px] bg-primary"
            onClick={() => {
              const temp = tolerance;
              dispatch(setTolerance(Number(temp)));
              onClose();
            }}
          >
            Confirm
          </Button>
          <Button className="!w-[160px] bg-gray-600" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default SettingDialog;
