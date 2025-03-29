import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import SliderMovies from "../components/SliderMovies.tsx";
import Banner from "../components/Banner.tsx";
import {
  MovieDataFunc,
  TVDataFunc,
  SearchDataFunc,
  IGetMediaResult,
} from "../api.ts";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TrailerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 300px;
`;

function Home() {
  const [update, setUpdate] = useState(0);
  const currPath = useLocation();
  const getDataFunc = currPath.pathname.includes("/search")
    ? SearchDataFunc
    : currPath.pathname.includes("/tv")
    ? TVDataFunc
    : MovieDataFunc;
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setUpdate((p) => p + 1);
    }, 60000);
  }, [update]);

  const datas = getDataFunc[0]; //Now Playing
  const { data, isLoading } = useQuery<IGetMediaResult>({
    queryKey: [datas.key, datas.category + keyword],
    queryFn: async () => await datas.fetchFn(keyword ?? ""),
  });

  if (!isLoading && (!data || !data.results || data.total_results === 0)) {
    navigate("/");
  }

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {data?.results[0] && (
            <Banner media={data.results[update % data.results.length]} />
          )}
          <TrailerContainer>
            {getDataFunc.map((funcData, id) => (
              <div key={id}>
                <SliderMovies MediaData={funcData} />
              </div>
            ))}
          </TrailerContainer>
          <Outlet />
        </>
      )}
    </Wrapper>
  );
}
export default Home;
