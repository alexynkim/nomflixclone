import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

interface IFnProps {
  slidingIndex: (isRight: boolean) => void;
}

const BtnContainer = styled.div<{ $isRight: boolean }>`
  position: absolute;
  top: 100px;
  ${(props) => (props.$isRight ? { left: "30px" } : { right: "30px" })};

  background: transparent;
  display: block;

  &:hover {
    display: block;
  }
  z-index: 99;
`;

const ArrowBtn = styled(motion.button)`
  color: rgba(156, 136, 255, 1);
  width: 30px;
  height: 30px;
  background: transparent;

  &:hover {
    background-color: rgba(0, 168, 255, 0.8);
  }
`;

function Arrow({ slidingIndex }: IFnProps) {
  return (
    <>
      <BtnContainer $isRight={true}>
        <ArrowBtn
          whileHover={{ scale: 1.2 }}
          onClick={() => slidingIndex(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
        </ArrowBtn>
      </BtnContainer>
      <BtnContainer $isRight={false}>
        <ArrowBtn
          whileHover={{ scale: 1.2 }}
          onClick={() => slidingIndex(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
          </svg>
        </ArrowBtn>
      </BtnContainer>
    </>
  );
}

export default Arrow;
