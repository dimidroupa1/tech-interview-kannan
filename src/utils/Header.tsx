"use client";

import Link from "next/link";
import React, { useState } from "react";

import styled from "styled-components";
import { IoMdMenu } from "react-icons/io";
import { signOut } from "next-auth/react";

import { device } from "@/lib/breakpoints";
import { useSelector } from "react-redux";
import { useLogOutQuery } from "@/redux/features/auth/authApi";

type Props = {};

const Header = (props: Props) => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState<boolean>(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLogout(true);
      await signOut();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <Container>
      <Link href="/">
        <Logo>Homy.</Logo>
      </Link>
      <Nav>
        <Link href="">Home</Link>
        <Link href="">Features</Link>
        <Link href="">AboutUs</Link>
      </Nav>

      <ButtonContainer>
        <Button href="/" $active>
          Contact
        </Button>
        {!user ? (
          <Button href="/login">Sign up/Log in</Button>
        ) : (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        )}

        <MenuContainer>
          <IoMdMenu size={24} color="var(--primary)" />
        </MenuContainer>
      </ButtonContainer>
    </Container>
  );
};

export default Header;

const Container = styled.header`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;

  border-bottom: 1px solid var(--primary);
`;

const Logo = styled.h2`
  font-family: var(--font-robot-slab);
  color: #97256d;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 500;
  color: var(--primary);

  > a {
    opacity: 1;
    &:hover {
      opacity: 0.8;
    }
  }

  @media ${device.md} {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Button = styled(Link)<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? "var(--primary)" : "transparent")};
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "white" : "var(--primary)")};
  border: 1px solid var(--primary);
  opacity: 1;
  &:hover {
    opacity: 0.8;
  }

  @media ${device.sm} {
    display: none;
  }
`;

const MenuContainer = styled.div`
  display: none;

  @media ${device.md} {
    display: flex;
  }
`;
