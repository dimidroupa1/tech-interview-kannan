"use client";

import React from "react";
import styled from "styled-components";
import { BiPlus } from "react-icons/bi";

// import { bannerData } from "../data";
import Apartment1Lg from "@public/images/apartments/a1lg.png";
import Apartment6Lg from "@public/images/apartments/a6lg.png";
import Image from "next/image";
import { device } from "@/lib/breakpoints";

type BannerItem = {
  [key: string]: string;
};

const bannerData = [
  {
    count: 1200,
    desc: "Premium Product",
  },
  {
    count: 4500,
    desc: "Happy Customer",
  },
  {
    count: 240,
    desc: "Award Winning",
  },
];

const Banner = () => {
  return (
    <Container>
      <LeftSection>
        <TextContainer>
          <Heading>Find Real Estate That Suits You.</Heading>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            fugit illo? Delectus, voluptas unde quae cupiditate at amet beatae
            totam!
          </Description>
          <ButtonContainer>
            <Button>Get Started</Button>
          </ButtonContainer>

          <ItemList>
            {bannerData.map((item, index: number) => (
              <Item key={index}>
                <ItemHeader>
                  <ItemTitle>{item.count}</ItemTitle>
                  <BiPlus style={{ color: "#ED64A6" }} />
                </ItemHeader>
                <ItemDescription>{item.desc}</ItemDescription>
              </Item>
            ))}
          </ItemList>
        </TextContainer>
      </LeftSection>

      <RightSection>
        <ImageContainer>
          <Images src={Apartment1Lg} alt="house" />
        </ImageContainer>
        <ImageContainer $isRight>
          <Images src={Apartment6Lg} alt="house" />
        </ImageContainer>
      </RightSection>
    </Container>
  );
};

export default Banner;

// Styled Components

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 24px;
  overflow: hidden;
`;

const LeftSection = styled.div`
  flex-grow: 1;
  padding: 16px 32px;
  background-color: #fed7e2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 16px;
  min-height: 450px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Heading = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  font-family: var(--font-robot-slab);
`;

const Description = styled.p`
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  padding-top: 12px;
  padding-bottom: 32px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const Item = styled.div`
  background-color: #fbb6ce;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
`;

const ItemTitle = styled.p`
  font-size: 1rem;
  font-weight: 500;
`;

const ItemDescription = styled.p`
  font-size: 0.875rem;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;

const ImageContainer = styled.div<{ $isRight?: boolean }>`
  height: 50%;

  @media ${device.mdL} {
    display: ${({ $isRight }) => $isRight && "none"};
    height: 100%;
  }

  @media ${device.md} {
    display: none;
  }
`;

const Images = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;

  @media ${device.mdS} {
    width: auto;
  }
`;
