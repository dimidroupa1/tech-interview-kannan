"use client";

import React, { useEffect, useState } from "react";

import styled from "styled-components";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { z } from "zod";
import {
  useLoginMutation,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const LogIn = () => {
  const [language, setLanguage] = useState("EN");
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({
    email: undefined,
    password: undefined,
  });
  const { data: dataSocial, status } = useSession();

  const [login, { isSuccess, error }] = useLoginMutation();
  const [socialAuth, { isSuccess: isSuccessSocial, error: errorSocial }] =
    useSocialAuthMutation();

  useEffect(() => {
    const fetchDataSocial = async () => {
      if (status === "authenticated" && dataSocial) {
        try {
          console.log(dataSocial);

          const response = await socialAuth({
            email: dataSocial?.user?.email,
            name: dataSocial?.user?.name,
          }).unwrap(); // `unwrap` для проверки ошибок.

          if (response) {
            toast.success("Login successfully!");
            window.location.href = "/";
          }
        } catch (error: any) {
          console.error("Social authentication failed:", error);

          if (error?.data?.message) {
            toast.error(error.data.message); // Выводим сообщение ошибки.
          } else {
            toast.error("Social authentication failed.");
          }
        }
      }
    };

    fetchDataSocial();
  }, [status, dataSocial, socialAuth]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successfully!");

      window.location.href = "/";
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const handleContinueWithEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(1)
    try {
      loginSchema.parse({ email, password });
      await login({ email, password });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const fieldErrors = validationError.errors.reduce(
          (acc, error) => ({
            ...acc,
            [error.path[0]]: error.message,
          }),
          {}
        );
        setErrors(fieldErrors);
        console.log(fieldErrors); 
      }
    }
  };

  const handleLanguageChange = (event: any) => {
    setLanguage(event.target.value);
    console.log(`Language changed to: ${event.target.value}`);
  };

  const handleAltLogin = (method: any) => {
    // Handle alternative login methods
    console.log(`Login with ${method} clicked`);
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
          <h1>Welcome to Binaryx</h1>
          <p>Log In with your email or wallets</p>
        </Header>

        <FormContainer onSubmit={handleContinueWithEmail}>
          <InputContainer>
            <label>Email</label>
            <input
              type="email"
              placeholder="name@domain.com"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
          </InputContainer>

          <InputContainer>
            <label>Password</label>
            <input
              type="password"
              placeholder="*******"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
          </InputContainer>

          <SubmitButton type="submit">Continue with Email</SubmitButton>
        </FormContainer>

        <DividerOrDivider>
          <Divider />
          <span>OR</span>
          <Divider />
        </DividerOrDivider>

        <SocialButtonContainer>
          <SocialButton onClick={() => signIn("google")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clipPath="url(#clip0_338_15128)">
                <path
                  d="M23.363 12.2576C23.363 11.3045 23.2857 10.609 23.1183 9.88776H12.2324V14.1895H18.6222C18.4934 15.2586 17.7977 16.8686 16.2518 17.9504L16.2301 18.0944L19.672 20.7602L19.9105 20.784C22.1005 18.7619 23.363 15.7866 23.363 12.2576Z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12.2327 23.5918C15.3631 23.5918 17.9912 22.5614 19.9107 20.784L16.252 17.9504C15.273 18.633 13.9589 19.1096 12.2327 19.1096C9.16663 19.1096 6.56435 17.0875 5.63671 14.2926L5.50074 14.3041L1.9218 17.0733L1.875 17.2034C3.78161 20.99 7.69795 23.5918 12.2327 23.5918Z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.63514 14.2926C5.39037 13.5714 5.24872 12.7985 5.24872 12C5.24872 11.2014 5.39037 10.4287 5.62226 9.70742L5.61578 9.55381L1.99199 6.74017L1.87342 6.79656C1.08762 8.36791 0.636719 10.1325 0.636719 12C0.636719 13.8676 1.08762 15.6321 1.87342 17.2034L5.63514 14.2926Z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12.2327 4.89033C14.4098 4.89033 15.8784 5.83055 16.7158 6.61627L19.988 3.42207C17.9784 1.55451 15.3631 0.408203 12.2327 0.408203C7.69795 0.408203 3.78161 3.0099 1.875 6.79652L5.62384 9.70738C6.56436 6.91248 9.16663 4.89033 12.2327 4.89033Z"
                  fill="#EB4335"
                ></path>
              </g>
            </svg>
          </SocialButton>

          <SocialButton>
            <Image
              src="https://s3.eu-west-1.amazonaws.com/media.binaryx.com/manually_uploaded_media/sign_in/wallet_connect_icon_square.png"
              alt="WalletConnect"
              unoptimized
              width={25}
              height={25}
              quality={100}
            />
          </SocialButton>

          <SocialButton>
            <Image
              src="https://s3.eu-west-1.amazonaws.com/media.binaryx.com/manually_uploaded_media/sign_in/meta_mask_icon_sm.png"
              alt="MetaMask"
              unoptimized
              width={25}
              height={25}
              quality={100}
            />
          </SocialButton>
        </SocialButtonContainer>

        <Info>
          By connecting you wallet, you agree to our <a>Terms of Service</a> and
          our <a>Privacy Policy</a>
        </Info>

        <Info>
          Not have any account?
          <Link href="/signup">&nbsp; Sign up</Link>`
        </Info>
      </Content>
      <Nav>
        <a>Terms</a>
        <a>Privacy Policy</a>
        <a>Cookie Policy</a>
        <a>Back to App</a>
      </Nav>

      <Footer>
        <p>2024 © Binaryx. All rights reserved</p>
      </Footer>
    </Container>
  );
};

export default LogIn;

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

const LanguageOption = styled.span<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#47bfd7" : "#b5bcc9")};
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #47bfd7;
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

const DividerOrDivider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.3;
  > span {
    text-transform: uppercase;
  }
`;

const Divider = styled.div`
  width: 100%;
  background-color: black;
  height: 1px;
`;

const SocialButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const SocialButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid #b5bcc9;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Info = styled.div`
  color: #b5bcc9;
  font-size: 14px;
  width: 100%;
  text-align: center;

  > a {
    color: #47bfd7;
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  width: 100%;
  max-width: 440px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 20px;
  flex-wrap: wrap;

  > a {
    font-size: 14px;
    font-weight: 600;
    opacity: 0.7;
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
