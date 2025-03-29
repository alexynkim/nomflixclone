import React from "react";
import styled from "styled-components";
import { useNavigate, useParams, useMatch } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ICreditData,
  IGetDetail,
  getCreditInfo,
  getDetailMovie,
} from "../api.ts";
import { makeImagePath } from "../utils.ts";
import { useEffect } from "react";

const OverlayMotion = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
};

const DeatilMotion = {
  hidden: { opacity: 0, transition: { duration: 0.5 } },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const Detail = styled(motion.div)`
  position: fixed;
  width: 50vw;
  height: auto;
  top: 5vmin;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 1vmin;
  background-color: white; //${(props) => props.theme.black.darker};
  z-index: 50;
`;

//DetailMovie Infomation
const BackGorundImage = styled.div<{ $bgphoto: string }>`
  width: 100%;
  height: 30vh;
  border-top-right-radius: 1vmin;
  border-top-left-radius: 1vmin;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0)
    ),
    url(${(props: { $bgphoto: string }) => props.$bgphoto});
  position: relative;
`;

const PosterImage = styled.div<{ $bgphoto: string }>`
  width: 16vmin;
  height: 24vmin;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.$bgphoto});
  position: absolute;
  left: 3vmin;
  bottom: 3vmin;
  border-radius: 1vmin;
`;

const MovieDetailTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DetailTitle = styled.span`
  font-size: 3.5vmin;
  margin-left: 3vmin;
  margin-top: 0.5vmin;
  display: block;
  overflow: hidden;
`;

const OriginalTitle = styled.span`
  font-size: 1.5vmin;
  display: block;
  margin-left: 3vmin;
`;

const DetailOverview = styled.p`
  font-size: 1.7vmin;
  margin: 1vmin 3vmin;
  height: 13vmin;
  overflow: hidden;
`;

const GenreBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 1vmin;
`;

const GenreList = styled.span`
  font-size: 1.5vmin;
  font-weight: 400;
  color: ${(props) => props.theme.black.veryDark};
  background-color: ${(props) => props.theme.white.lighter};
  border-radius: 1vmin;
  padding: 0.2vmin 0.5vmin;
  margin-right: 4vmin;
`;

const InfoBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin: 1vmin 0;
`;

const Release = styled.div`
  font-size: 1.5vmin;
  margin-right: 4vmin;
`;

const Runtime = styled.div`
  font-size: 1.5vmin;
  margin-right: 4vmin;
`;

//Director, Actor Information
const ActorBox = styled.div`
  width: 100%;
  height: auto; //18vmin;
  background-color: transparent;
  display: flex;
  justify-content: space-evenly;
  margin: 2vmin 0vmin;
  gap: 3px;
`;

const ActorList = styled(motion.div)`
  height: auto; //18vmin;
  width: 10vmin;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 1vmin;
`;

const ActorImage = styled.div<{ $bgphoto: string }>`
  width: 100%;
  height: 12vmin;
  border-top-right-radius: 1vmin;
  border-top-left-radius: 1vmin;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.$bgphoto});
`;

const ActorName = styled.div`
  height: auto; //1.5vmin;
  font-size: 1.2vmin;
  margin-top: 1vmin;
  overflow: hidden;
  padding: 0 0.8vmin;
`;

const ActorCharacter = styled.div`
  height: auto; //.5vmin;
  font-size: 1.2vmin;
  margin-top: 1vmin;
  overflow: hidden;
  padding: 0 0.8vmin;
`;

const DirectorList = styled(motion.div)`
  height: auto; //18vmin;
  width: 10vmin;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 1vmin;
`;

const DirectorImage = styled.div<{ $bgphoto: string }>`
  width: 100%;
  height: 12vmin;
  border-top-right-radius: 1vmin;
  border-top-left-radius: 1vmin;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.$bgphoto});
`;

const DirectorName = styled.div`
  height: auto; //1.5vmin;
  font-size: 1.2vmin;
  margin-top: 1vmin;
  overflow: hidden;
  padding: 0 0.8vmin;
`;

const DirectorDepartment = styled.div`
  height: auto; //1.5vmin;
  font-size: 1.2vmin;
  margin-top: 1vmin;
  overflow: hidden;
  padding: 0 0.8vmin;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function DetailMovie() {
  const matchMovie = useMatch("/movies/:movieId");
  const navigate = useNavigate();
  const onOverlay = () => navigate(-1);
  const id = matchMovie?.params.movieId;

  console.log(`movieId : ${id} matchMovie: `, matchMovie);

  const { data: detailData, isLoading: isDetailLoading } = useQuery<IGetDetail>(
    {
      queryKey: ["movie", id],
      queryFn: () => getDetailMovie(id!),
      enabled: !!id, // Only enable the query if `id` is truthy
    }
  );

  const { data: creditData, isLoading: isCreditLoading } =
    useQuery<ICreditData>({
      queryKey: ["credit", id],
      queryFn: () => getCreditInfo(id!),
      enabled: !!id, // Only enable the query if `id` is truthy
    });

  if (!matchMovie) return;

  const actor = creditData?.cast.slice(0, 4);
  const director = creditData?.crew.find(
    (person) => person.known_for_department === "Directing"
  );

  console.log("detail data", detailData);
  console.log("credit data", creditData);
  return (
    <>
      <Overlay
        onClick={onOverlay}
        variants={OverlayMotion}
        initial="hidden"
        animate="visible"
        exit="exit"
      />
      {isDetailLoading && isCreditLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Detail
          variants={DeatilMotion}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {detailData && creditData && (
            <>
              <BackGorundImage
                onClick={onOverlay}
                $bgphoto={makeImagePath(detailData.backdrop_path + "", "w500")}
              >
                <PosterImage
                  $bgphoto={makeImagePath(detailData.poster_path + "", "w500")}
                />
              </BackGorundImage>
              <MovieDetailTitle>
                <DetailTitle>{detailData.title}</DetailTitle>
                <OriginalTitle>{detailData.original_title}</OriginalTitle>
              </MovieDetailTitle>
              <DetailOverview>{detailData.overview}</DetailOverview>
              <GenreBox>
                {detailData.genres.map((g) => (
                  <GenreList key={g.id}>{g.name}</GenreList>
                ))}
              </GenreBox>
              <InfoBox>
                <Release>Release Day {detailData.release_date}</Release>
                <Runtime>{detailData.runtime}minutes</Runtime>
              </InfoBox>
              <ActorBox>
                <DirectorList>
                  <DirectorImage
                    $bgphoto={makeImagePath(
                      director?.profile_path + "",
                      "w500"
                    )}
                  />
                  <DirectorDepartment>
                    {director?.known_for_department ? "Director" : null}
                  </DirectorDepartment>
                  <DirectorName>{director?.name}</DirectorName>
                </DirectorList>
                {actor?.map((cast) => (
                  <ActorList key={cast.id}>
                    <ActorImage
                      $bgphoto={makeImagePath(cast.profile_path + "", "w500")}
                    />
                    <ActorCharacter>{cast.character}</ActorCharacter>
                    <ActorName>{cast.name}</ActorName>
                  </ActorList>
                ))}
              </ActorBox>
            </>
          )}
        </Detail>
      )}
    </>
  );
}

export default DetailMovie;
