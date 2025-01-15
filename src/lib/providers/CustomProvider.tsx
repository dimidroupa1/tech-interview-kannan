"use client";

import React from "react";

import StyledComponentsRegistry from "@/lib/registry";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
};

const CustomProvider = ({ children }: Props) => {
  return (
    <>
      <StyledComponentsRegistry>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </StyledComponentsRegistry>
    </>
  );
};

export default CustomProvider;
