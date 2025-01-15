"use client";

import Header from "@/utils/Header";
import React from "react";

import styled from "styled-components";

type Props = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
};

export default HomeLayout;

const Container = styled.main`
  max-width: 980px;
  width: 100%;
  margin: 0 auto;

  padding: 20px;
`;
