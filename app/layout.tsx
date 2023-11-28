"use client";

import "./globals.css";
import "@style/layout.scss";
import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "@components/layout/header";
import { store } from "@/src/redux/store";

import { ThemeProvider, Typography } from "@components/MaterialTailwind";
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <html lang="en">
          <body className={`${inter.className} flex flex-col min-h-screen`}>
            <Header />
            {children}
            <footer className="flex justify-center mt-auto mb-5">
              <Typography className="md:text-[16px] text-[12px]">
                Powered By Nulswap @ {new Date().getFullYear()} - All rights
                reserved.
              </Typography>
            </footer>
          </body>
        </html>
      </ThemeProvider>
    </Provider>
  );
}

export default RootLayout;
