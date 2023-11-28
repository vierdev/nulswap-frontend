"use client";

import {
  Button,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@components/MaterialTailwind";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { useEffect, useState } from "react";
import NaboxWindow from "@/src/types/NaboxWindow";
import {
  getWalletAddress,
  setChainID,
  setWalletAddress,
} from "@/src/redux/swap/walletConnect";

import toast, { Toaster } from "react-hot-toast";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const address = useAppSelector(getWalletAddress);
  const shortenAddress = (addr: string) => {
    return addr.substring(0, 8) + "..." + addr.substring(addr.length - 5);
  };

  const connectWallet = async () => {
    if (address != "") return;
    if (typeof (window as unknown as NaboxWindow).nabox != "undefined") {
      localStorage.setItem(
        "chainID",
        (window as unknown as NaboxWindow).nabox.chainId
      );
      if (localStorage.getItem("chainID") === "0x-1") {
        try {
          var account: any = await (
            window as unknown as NaboxWindow
          ).nabox.createSession();

          localStorage.setItem("address", account[0]);
          dispatch(setWalletAddress(account[0]));
        } catch (error) {}
      } else {
        toast.error("You are connected wrong chain");
      }
    } else {
      toast.error("Please install Nabox wallet");
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem("address");
    dispatch(setWalletAddress(""));
    localStorage.removeItem("chainID");
    dispatch(setChainID(""));
  };

  useEffect(() => {
    const addressFromLocalstorage = localStorage.getItem("address");
    if (addressFromLocalstorage !== null)
      dispatch(setWalletAddress(addressFromLocalstorage));
  }, []);

  useEffect(() => {
    var userDevice = navigator.userAgent;
    if (
      !userDevice.match(/Android|webOS|iPhone|iPod|BlackBerry/i) &&
      typeof (window as unknown as NaboxWindow).nabox != "undefined"
    ) {
      (window as unknown as NaboxWindow).nabox.on(
        "accountsChanged",
        (accounts) => {
          if (accounts.length) {
            localStorage.setItem("address", accounts[0]);
            dispatch(setWalletAddress(accounts[0]));
          }
        }
      );
    }
  }, []);

  return (
    <header className="px-3 pt-2">
      <div className="flex justify-between">
        <Link href={"/swap"} className="pt-3">
          <Image
            className="logo"
            src={`/logo.png`}
            alt={"logo"}
            width={70}
            height={70}
          />
        </Link>

        <div className="flex pt-3">
          <div className="flex items-center">
            <div className="md:flex hidden">
              <Link href={"/swap"} className="md:text-center">
                <Typography
                  variant="h5"
                  className="font-bold hover:text-primary pr-8"
                >
                  Swap
                </Typography>
              </Link>
              <Link href={"/pools"} className="md:text-center">
                <Typography
                  variant="h5"
                  className="font-bold hover:text-primary pr-8"
                >
                  Pools
                </Typography>
              </Link>
              <Link href={"/stake"} className="md:text-center">
                <Typography
                  variant="h5"
                  className="font-bold hover:text-primary pr-8"
                >
                  Stake
                </Typography>
              </Link>
              <Link href={"/ainuls"} className="md:text-center">
                <Typography
                  variant="h5"
                  className="font-bold hover:text-primary pr-8"
                >
                  aiNULS
                </Typography>
              </Link>
              <Link href={"/lend"} className="md:text-center">
                <Typography
                  variant="h5"
                  className="font-bold hover:text-primary pr-8"
                >
                  Lend
                </Typography>
              </Link>
            </div>
            <div className="flex">
              <Button
                onClick={connectWallet}
                className="bg-primary mr-3 !border-2 border-[#757575] normal-case text-[16px] py-2 px-2"
              >
                {address !== "" && address !== null
                  ? shortenAddress(address)
                  : "Connect Wallet"}
              </Button>
              <div className="pr-[10px]">
                <Menu placement="top-start">
                  <MenuHandler>
                    <Button className="bg-primary px-3 !border-2 border-[#757575]">
                      ...
                    </Button>
                  </MenuHandler>
                  <MenuList className="rounded-lg border-2 border-[#] flex flex-col w-[200px] h-[270px] bg-[#343a40] p-0">
                    <MenuItem
                      className="flex flex-1 justify-center items-center "
                      onClick={() => {
                        router.push("/swap");
                        // window.location.href="/swap"
                      }}
                    >
                      <Typography className="text-white font-bold !px-5">
                        Swap
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className="flex flex-1 justify-center items-center "
                      onClick={() => {
                        router.push("/pools");
                      }}
                    >
                      <Typography className="text-white font-bold">
                        Pools
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className="flex flex-1 justify-center items-center "
                      onClick={() => {
                        router.push("/stake");
                      }}
                    >
                      <Typography className="text-white font-bold">
                        Stake
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className="flex flex-1 justify-center items-center "
                      onClick={() => {
                        router.push("/ainuls");
                      }}
                    >
                      <Typography className="text-white font-bold">
                        aiNuls
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className="flex flex-1 justify-center items-center "
                      onClick={() => {
                        router.push("/lend");
                      }}
                    >
                      <Typography className="text-white font-bold">
                        Lend
                      </Typography>
                    </MenuItem>
                    <MenuItem className="flex flex-1 justify-center items-center ">
                      <div onClick={() => disconnectWallet()}>
                        <Typography className="text-white font-bold">
                          Disconnect
                        </Typography>
                      </div>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          </div>

          <Toaster />
        </div>
      </div>
    </header>
  );
};

export default Header;
