import React from "react";
import styled from "styled-components";
import { makeImagePath } from "../utils.ts";
import { IMovie } from "../api.ts";

const BannerContainer = styled.div<{ $bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Banner({ movie }: { movie: IMovie }) {
  return (
    <>
      <BannerContainer $bgphoto={makeImagePath(movie?.backdrop_path || "")}>
        <Title>{movie?.title}</Title>
        <Overview>{movie?.overview}</Overview>
      </BannerContainer>
    </>
  );
}

export default Banner;
