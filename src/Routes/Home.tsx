import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Outlet, useLocation } from "react-router-dom";
import SliderMovies from "../components/SliderMovies.tsx";
import Banner from "../components/Banner.tsx";
import {
  MovieDataFunc,
  TVDataFunc,
  SearchDataFunc,
  bannerStatusAtom,
} from "../api.ts";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const TrailerContainer = styled.div<{ $isBanner: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 10px;
  position: relative;
  top: ${(props) => (props.$isBanner ? "-100px" : "200px")};
`;

function Home() {
  const [update, setUpdate] = useState(0);
  const currPath = useLocation();
  const bannerStatus = useRecoilValue(bannerStatusAtom);
  const getDataFunc = currPath.pathname.includes("/search")
    ? SearchDataFunc
    : currPath.pathname.includes("/tv")
    ? TVDataFunc
    : MovieDataFunc;

  useEffect(() => {
    setTimeout(() => {
      setUpdate((p) => p + 1);
    }, 60000);
  }, [update]);

  return (
    <Wrapper>
      <Banner MediaData={getDataFunc[update % getDataFunc.length]} />
      <TrailerContainer $isBanner={bannerStatus}>
        {getDataFunc.map((funcData, id) => (
          <div key={id}>
            <SliderMovies MediaData={funcData} />
          </div>
        ))}
      </TrailerContainer>
      <Outlet />
    </Wrapper>
  );
}
export default Home;
