import {
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Typography,
} from "@components/MaterialTailwind";
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import Image from "next/image";
import tokenList from "@tokens/tokenList";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  getFromToken,
  getToToken,
  getTokenBalanceList,
  setFromToken,
  setSearchedToken,
  setToToken,
} from "@/src/redux/swap/Token";
import { Token } from "@/src/types/token";
import {
  getTokenDecimals,
  getTokenName,
  getTokenSymbol,
} from "@/src/api/nulsConnector";

interface TokenSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectToken: (newToken: Token) => void;
  type: string;
}

const TokenSelectDialog: React.FC<TokenSelectDialogProps> = ({
  open,
  onClose,
  onSelectToken,
  type,
}) => {
  const [name, setName] = useState("");
  const [newToken, setNewToken] = useState<Token>(tokenList.initial);
  const [foundTokens, setFoundTokens] = useState(tokenList.tokens);
  const fromToken = useAppSelector(getFromToken);
  const toToken = useAppSelector(getToToken);
  const tokenBalanceList = useAppSelector(getTokenBalanceList);
  const dispatch = useAppDispatch();

  const filter = (e: { target: { value: any } }) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      if (keyword.substring(0, 6) == ("NULSd6" || "NNULSd")) {
        const result = tokenList.tokens.filter((token) => {
          console.log(token.address == keyword, token.symbol);

          return token.address == keyword;
        });
        if (result == null) {
          getTokenName(keyword).then((name: any) => {
            getTokenSymbol(keyword).then((symbol: any) => {
              getTokenDecimals(keyword).then((decimal: any) => {
                let newToken: Token;
                newToken = {
                  id: 100,
                  name: name.tokenName,
                  address: keyword,
                  symbol: symbol.tokenSymbol,
                  tags: [""],
                  decimals: decimal.tokenDecimal,
                  chainId: 0,
                  logoURI: "/tokens/nswap.png",
                  type: "Token",
                  chain: 0,
                  asset: 0,
                };
                setNewToken(newToken);
              });
            });
          });
        } else {
          setFoundTokens(result);
        }
      } else {
        console.log(keyword);

        const results = tokenList.tokens.filter((token) => {
          return token.symbol.toLowerCase().startsWith(keyword.toLowerCase());
        });
        setFoundTokens(results);
      }
    } else {
      setFoundTokens(tokenList.tokens);
    }

    setName(keyword);
  };

  const popularToken = (token: Token) => (
    <>
      <div
        className="flex md:gap-2 items-center hover:cursor-pointer"
        onClick={() => {
          onSelectToken(token);
          console.log(type);

          if (type == "To" || type == "Token B") dispatch(setToToken(token));
          else dispatch(setFromToken(token));
          onClose();
        }}
      >
        <Image src={token.logoURI} alt={token.symbol} width={30} height={30} />
        <Typography className="text-white uppercase text-[12px] md:text-[18px]">
          {token.symbol}
        </Typography>
      </div>
    </>
  );

  useEffect(() => {
    if (newToken != tokenList.initial) {
      dispatch(setSearchedToken(newToken));
      setFoundTokens([newToken]);
    }
  }, [newToken]);

  return (
    <Dialog
      size="xs"
      open={open}
      handler={onClose}
      className="!bg-tertiary shadow-[0_0_15px_#32E08D] rounded-3xl py-2 md:!w-[500px] md:!min-w-[500px] md:!max-w-[500px]"
    >
      <DialogHeader className="justify-between px-8">
        <Typography variant="h5" color="blue-gray" className="text-white">
          Select a token
        </Typography>
        <div className="hover:text-gray-500 cursor-pointer text-white">
          <RxCross2 onClick={onClose} />
        </div>
      </DialogHeader>
      <DialogBody className="overflow-y-auto px-0 pt-0" >
        <div className="px-8">
          <Input
            className="!bg-secondary text-white !border-none focus:!border-t-gray-500 focus:!border-gray-500 h-[50px] flex-1 pr-5"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            containerProps={{
              className: "min-w-0 flex flex-1 items-center",
            }}
            icon={<FiSearch />}
            value={name}
            placeholder="Search name or address"
            onChange={filter}
            crossOrigin={undefined}
            autoFocus={false}
            tabIndex={-1}
          >
          </Input>
        </div>

        <div className="md:mt-6 border-b border-b-gray-700 pb-2 md:px-8 px-1 mt-3" tabIndex={0}>
          <Typography
            variant="h5"
            color="blue-gray"
            className="text-white text-[16px] md:text-[20px] px-2"
          >
            Popular tokens
          </Typography>
          <div className="md:mt-3 mt-1 flex md:gap-4 items-center justify-between">
            {popularToken(tokenList.tokens[0])}
            {popularToken(tokenList.tokens[1])}
            {popularToken(tokenList.tokens[3])}
            {popularToken(tokenList.tokens[4])}
          </div>
        </div>

        <div className="mt-2 px-4 md:h-[400px] overflow-y-auto relative token-list h-[200px]">
          <div className="flex justify-between w-full pl-4 items-center sticky top-0 left-0 bg-tertiary">
            <Typography
              variant="h6"
              color="gray"
              className="font-normal md:text-[20px] text-[16px] text-white"
              id="token1"
            >
              Token
            </Typography>
            <Typography
              variant="h6"
              className="font-normal md:text-[20px] text-[16px] text-white"
            >
              Balance
            </Typography>
          </div>
          <div className="flex flex-col gap-1">
            {foundTokens.map((token, i) => {
              if (
                token.name !== toToken.name &&
                (type == "From" || type == "Token A")
              )
                return (
                  <div
                    key={`token-${i}`}
                    className="rounded-lg bg-transparent hover:bg-white/20 flex items-center justify-between md:px-2 py-2"
                    onClick={() => {
                      onSelectToken(token);
                      dispatch(setFromToken(token));
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={token.logoURI}
                        alt="nswap"
                        width={24}
                        height={24}
                        className="md:w-10"
                      />
                      <Typography className="text-white md:text-base uppercase text-[14px]">
                        {token.symbol}
                      </Typography>
                    </div>
                    <Typography className="text-white text-base">
                      {tokenBalanceList.find(
                        (tokenbalance) => tokenbalance.name === token.name
                      )?.balance || "0.00000"}
                    </Typography>
                  </div>
                );
              else if (
                token.name !== fromToken.name &&
                (type == "To" || type == "Token B")
              )
                return (
                  <div
                    key={`token-${i}`}
                    className="rounded-lg bg-transparent hover:bg-white/20 flex items-center justify-between md:px-2 py-2"
                    onClick={() => {
                      onSelectToken(token);
                      dispatch(setToToken(token));
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={token.logoURI}
                        alt="nswap"
                        width={24}
                        height={24}
                        className="md:w-10"
                      />
                      <Typography className="text-white text-base uppercase text-[14px] md:text-[18px] ">
                        {token.symbol}
                      </Typography>
                    </div>
                    <Typography className="text-white text-base text-[14px] md:text-[18px]">
                      {tokenBalanceList.find(
                        (tokenbalance) => tokenbalance.name === token.name
                      )?.balance || "0.00000"}
                    </Typography>
                  </div>
                );
            })}
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default TokenSelectDialog;
