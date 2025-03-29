import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import { IGetMoviesResult, IGetData } from "../api.ts";
//import { categoryMovie } from "../atoms.tsx";
import { makeImagePath } from "../utils.ts";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

function ExpandMovie() {
  const bigMovieMatch = useMatch("/movies/:movieId");
  const history = useNavigate();
  const onOverlayClick = () => history("/");
  const { scrollY } = useScroll();

  // const getQuery = useRecoilValue<IGetData>(categoryMovie);

  // const { data, isLoading } = useQuery<IGetMoviesResult>({
  //   queryKey: [getQuery?.key, getQuery?.category],
  //   queryFn: async () => await getQuery?.fetchFn(),
  // });

  const data = {} as IGetMoviesResult; //Temporary;

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results?.find(
      (movie) => movie.id === +(bigMovieMatch?.params.movieId ?? -1)
    );

  return (
    <>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigMovieMatch.params.movieId}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie?.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie?.title}</BigTitle>
                  <BigOverview>{clickedMovie?.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default ExpandMovie;
