"use client";

import React from "react";
import StyledComponentsRegistry from "@/lib/registry";
import WalletConnectProvider from "@/lib/providers/WalletConnect";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  cookies: string;
};

const CustomProvider = ({ children, cookies }: Props) => {
  return (
    <SessionProvider>
      <ReduxProvider>
        <StyledComponentsRegistry>
          <WalletConnectProvider cookies={cookies}>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </WalletConnectProvider>
        </StyledComponentsRegistry>
      </ReduxProvider>
    </SessionProvider>
  );
};

export default CustomProvider;
