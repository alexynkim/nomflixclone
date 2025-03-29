import React from "react";
import styled from "styled-components";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { makeImagePath } from "../utils.ts";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IGetMediaResult, IGetData, IMedia, isMovie } from "../api.ts";
import Arrow from "./Arrow.tsx";

const Slider = styled.div`
  position: relative;
  top: -100px;
  display: flex;
  justify-content: left;
  flex-direction: column;
`;

const Title = styled.div`
  background: transparent;
  color: rgba(220, 221, 225, 0.8);
  padding: 5px 20px;
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  top: -30px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ $bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(99, 110, 114, 1);
  color: rgba(223, 230, 233, 1);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
  p {
    padding-top: 10px;
    text-align: end;
    font-size: 15px;
  }
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

//============================================================================

const rowVariants: Variants = {
  initial: (right: boolean) => ({
    x: window.outerWidth * (right ? 1 : -1) + 5,
  }),
  animate: {
    x: 0,
  },
  exit: (right: boolean) => ({
    x: -window.outerWidth * (right ? 1 : -1) - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

//============================================================================

function SliderMovies({ MediaData }: { MediaData: IGetData }) {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const { data, isLoading } = useQuery<IGetMediaResult>({
    queryKey: [MediaData.key, MediaData.category + keyword],
    queryFn: async () => await MediaData.fetchFn(keyword ?? ""),
  });
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [isRight, setIsRight] = useState(true);
  const navigate = useNavigate();
  const offset = 6;

  const slidingIndex = (bRight: boolean) => {
    if (leaving) return;
    setLeaving((prev) => !prev); //TRUE -> FALSE
    setIsRight(bRight);
    if (bRight)
      setIndex((prev) =>
        prev + 2 <= Math.floor(data!.results.length / offset) ? prev + 1 : 0
      );
    else
      setIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : Math.floor(data!.results.length / offset) - 1
      );
  };

  const onBoxClicked = (media: IMedia) => {
    const base = isMovie(media) ? `/movies/${media.id}` : `/tv/${media.id}`;
    const url = keyword
      ? "/search" + base + `?keyword=${encodeURIComponent(keyword)}`
      : base;

    navigate(url);
  };

  const toggleLeaving = () => {
    if (!leaving) return;
    setLeaving((prev) => !prev);
  };

  const slidingTitle = keyword
    ? MediaData.category + ` "${keyword}"`
    : MediaData.category;
  return (
    <>
      <Slider>
        <Title>{slidingTitle}</Title>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <AnimatePresence
            initial={false}
            onExitComplete={toggleLeaving}
            custom={isRight}
          >
            <Row
              variants={rowVariants}
              custom={isRight}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {data?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((media, ii) => (
                  <Box
                    layoutId={media.id + "" + MediaData.key}
                    key={media.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    onClick={() => onBoxClicked(media)}
                    transition={{ type: "tween" }}
                    $bgphoto={makeImagePath(
                      media.backdrop_path || media.poster_path,
                      "w500"
                    )}
                  >
                    <Info variants={infoVariants}>
                      {isMovie(media) ? (
                        <h4>{media.title}</h4>
                      ) : (
                        <h4>{media.name}</h4>
                      )}
                      <p>👍{media.vote_average}</p>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        )}
        <Arrow slidingIndex={slidingIndex} />
      </Slider>
    </>
  );
}

export default SliderMovies;
