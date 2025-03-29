import React from "react";
import styled from "styled-components";
import { makeImagePath } from "../utils.ts";
import { IMedia, isMovie } from "../api.ts";

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
  width: 100%;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 70%;
  max-height: 60%;
  overflow: hidden;
`;

const Container = styled.div`
  background-color: rgba(255, 255, 255, 0.4);
  padding: 50px;
  width: 70%;
  max-height: 50%;
  border-radius: 20px;
`;

function Banner({ media }: { media: IMedia }) {
  return (
    <>
      <BannerContainer $bgphoto={makeImagePath(media?.backdrop_path || "")}>
        <Container>
          {isMovie(media) ? (
            <Title>{media?.title}</Title>
          ) : (
            <Title>{media?.name}</Title>
          )}
          <Overview>{media?.overview}</Overview>
        </Container>
      </BannerContainer>
    </>
  );
}

export default Banner;
