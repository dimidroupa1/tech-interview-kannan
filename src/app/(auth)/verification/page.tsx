"use client";

import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Verification = () => {
  const [language, setLanguage] = useState("EN");
  const [otp, setOtp] = useState<string>("");

  const [activation, { isSuccess, error }] = useActivationMutation();
  const { token } = useSelector((state: any) => state.auth);

  console.log("TOKEN ==>", token);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully!");
      window.location.href = "/login";
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      } else {
        console.log("An error occured:", error);
      }
    }
  }, [isSuccess, error]);

  const verificationHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await activation({
        activation_token: localStorage.getItem("activation_token"),
        activation_code: otp,
      });
      localStorage.removeItem("activation_token")
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleLanguageChange = (event: any) => {
    setLanguage(event.target.value);
    console.log(`Language changed to: ${event.target.value}`);
  };

  return (
    <Container>
      <LogoAndLanguageSwitcher>
        <h1>Binaryx</h1>
        <LanguageSwitcher>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="EN">EN</option>
            <option value="UA">UA</option>
          </select>
        </LanguageSwitcher>
      </LogoAndLanguageSwitcher>
      <Content>
        <Header>
          <h2>Verify your account</h2>
        </Header>

        <FormContainer onSubmit={verificationHandler}>
          <InputContainer>
            <label></label>
            <input
              type="text"
              placeholder="1234"
              name="otp"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            />
          </InputContainer>

          <SubmitButton type="submit">Verify OTP</SubmitButton>
        </FormContainer>
      </Content>

      <Footer>
        <p>2024 © Binaryx. All rights reserved</p>
      </Footer>
    </Container>
  );
};

export default Verification;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background: linear-gradient(
      206deg,
      rgba(34, 223, 221, 0.07) 22.21%,
      rgba(0, 159, 200, 0.07) 85.84%
    ),
    #edf0f5;

  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;

  position: relative;
  font-family: var(--font-family--primary);
`;

const LogoAndLanguageSwitcher = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LanguageSwitcher = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #fff;
  border-radius: 20px;
  padding: 5px 15px;
  border: 1px solid #b5bcc9;
  cursor: pointer;

  > select {
    font-size: 16px;
    font-weight: 600;
    color: #47bfd7;
    border: none;
    background-color: transparent;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }
`;

const Content = styled.main`
  width: 100%;
  max-width: 440px;
  background-color: white;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 40px;
`;

const Header = styled.div`
  width: 100%;

  > h1 {
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
  }

  > p {
    font-size: 16px;
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
`;

const FormContainer = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  > label {
    font-size: 16px;
  }

  > input {
    border: 1px solid gray;
    width: 100%;
    padding: 10px 15px;
    border-radius: 7px;
    margin-top: -5px;

    &:focus {
      border: 1px solid black;
      outline: none;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px 0;
  background: #47bfd7;
  color: white;
  border-radius: 10px;
  opacity: ${({ disabled }) => (disabled ? 0.8 : 1)};
  transition: opacity 0.3s ease;

  &:disabled {
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50px;

  > p {
    opacity: 0.7;
    font-size: 14px;
  }
`;
