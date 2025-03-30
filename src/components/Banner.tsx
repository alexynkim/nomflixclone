import React from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useSearchParams, useNavigate } from "react-router-dom";
import { makeImagePath } from "../utils.ts";
import {
  IMedia,
  IGetMediaResult,
  IGetData,
  isMovie,
  bannerStatusAtom,
} from "../api.ts";

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

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 10%;
  left: 10%;
  max-width: 70%;
  background-color: rgba(255, 255, 255, 0.3);
  color: rgba(223, 230, 233, 1);
  font-size: 20px;
  z-index: 100;
  border-radius: 20px;
  padding: 20px 10px;
`;

function BannerRender({ media }: { media: IMedia }) {
  const setBannerStatus = useSetRecoilState<boolean>(bannerStatusAtom);

  useEffect(() => {
    setBannerStatus(true);

    return () => setBannerStatus(false);
  }, [setBannerStatus]);

  return (
    <BannerContainer $bgphoto={makeImagePath(media?.backdrop_path || "")}>
      <Container>
        <Title>{media && isMovie(media) ? media?.title : media?.name}</Title>
        <Overview>{media?.overview}</Overview>
      </Container>
    </BannerContainer>
  );
}

function Banner({ MediaData }: { MediaData: IGetData }) {
  const [searchParams] = useSearchParams();
  const [ErrorMsg, setErrorMsg] = useState("");
  const keyword = searchParams.get("keyword");
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<IGetMediaResult>({
    queryKey: [MediaData.key, MediaData.category + keyword],
    queryFn: async () => await MediaData.fetchFn(keyword ?? ""),
  });

  useEffect(() => {
    if (!isLoading && (!data || !data.results || data.total_results === 0)) {
      //setErrorMsg("Sorry!! There is no data for request Go to Home...");
      setTimeout(() => {
        //        navigate("/");
        setErrorMsg("");
      }, 3000);
    }
  }, [isLoading, data]);

  const filtered = data?.results.filter((movie) =>
    movie.backdrop_path ? true : false
  );

  if (data && data.results && filtered) {
    data.results = [...filtered];
  }

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : ErrorMsg ? (
        <Loader>{ErrorMsg}</Loader>
      ) : data && data.results && data.results.length > 0 && !keyword ? (
        <BannerRender media={data.results[0]} />
      ) : null}
    </>
  );
}

export default Banner;
