import React from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import SliderMovies from "../components/SliderMovies.tsx";
import Banner from "../components/Banner.tsx";
import { MovieDataFunc, IGetMoviesResult } from "../api.ts";

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
  const datas = MovieDataFunc[0]; //Now Playing
  const { data, isLoading } = useQuery<IGetMoviesResult>({
    queryKey: [datas.key, datas.category],
    queryFn: async () => await datas.fetchFn(),
  });

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {data?.results[0] && <Banner movie={data.results[0]} />}
          <TrailerContainer>
            <SliderMovies MovieData={MovieDataFunc[0]} />
            <SliderMovies MovieData={MovieDataFunc[1]} />
            <SliderMovies MovieData={MovieDataFunc[2]} />
            <SliderMovies MovieData={MovieDataFunc[3]} />
          </TrailerContainer>
          <Outlet />
        </>
      )}
    </Wrapper>
  );
}
export default Home;
