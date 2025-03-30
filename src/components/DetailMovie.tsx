import React from "react";
import styled from "styled-components";
import { useNavigate, useMatch } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ICreditData,
  IGetDetail,
  DetailDataFunc,
  CreditDataFunc,
} from "../api.ts";
import { makeImagePath } from "../utils.ts";

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
  top: 10vmin;
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
  right: 3vmin;
  bottom: -5vmin;
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
  justify-content: flex-start;
  margin: 1vmin 0;
  padding: 2vmin;
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

const SeasonBox = styled.div`
  width: 100%;
  height: auto; //18vmin;
  background-color: transparent;
  display: flex;
  justify-content: space-evenly;
  margin: 2vmin 0vmin;
  gap: 3px;
  overflow-x: auto;
`;

const ActorList = styled(motion.div)`
  height: auto; //18vmin;
  min-width: 10vmin;
  background-color: rgba(255, 255, 255, 0.7);
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
  margin: 0.5vmin;
  overflow: hidden;
  padding: 0 0.8vmin;
`;

const ActorCharacter = styled.div`
  height: auto; //.5vmin;
  font-size: 1.2vmin;
  margin: 0.5vmin;
  overflow: hidden;
  padding: 0.8vmin 0.8vmin;
`;

const DirectorList = styled(motion.div)`
  height: auto; //18vmin;
  min-width: 10vmin;
  background-color: rgba(255, 255, 255, 0.7);
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

function GetIDnMedia(): { isMovie: boolean; id: number | undefined } {
  const matchMovie = useMatch("/movies/:movieId");
  const searchMovie = useMatch("/search/movies/:movieId");
  const searchTV = useMatch("/search/tv/:tvID");
  const matchTV = useMatch("/tv/:tvID");

  const matchedMovie = matchMovie ?? searchMovie;
  const matchedTV = matchTV ?? searchTV;

  const isMovie = matchedMovie ? true : false;
  const mediaId = matchedMovie?.params.movieId ?? matchedTV?.params.tvID;
  const parsedMediaId = mediaId ? parseInt(mediaId, 10) : undefined;

  return { isMovie: isMovie, id: parsedMediaId };
}

function DetailMovie() {
  const navigate = useNavigate();
  const onOverlay = () => navigate(-1);
  const { isMovie, id } = GetIDnMedia() as {
    isMovie: boolean;
    id: number | undefined;
  };

  const getDetailFunc = DetailDataFunc; // 0: Movie, 1: TV
  const getCreditFunc = CreditDataFunc; // 0: Movie, 1: TV
  const queryindex = isMovie ? 0 : 1;

  const { data: detailData, isLoading: isDetailLoading } = useQuery<IGetDetail>(
    {
      queryKey: [getDetailFunc[queryindex].key, id],
      queryFn: () => getDetailFunc[queryindex].fetchFn(id! + ""),
      enabled: !!id, // Only enable the query if `id` is truthy
    }
  );

  const { data: creditData, isLoading: isCreditLoading } =
    useQuery<ICreditData>({
      queryKey: [getCreditFunc[queryindex].key, id],
      queryFn: () => getCreditFunc[queryindex].fetchFn(id! + ""),
      enabled: !!id, // Only enable the query if `id` is truthy
    });

  const actor = isMovie ? creditData?.cast?.slice(0, 4) : null;
  const director = isMovie
    ? creditData?.crew.find(
        (person) => person.known_for_department === "Directing"
      )
    : null;

  const title = isMovie ? detailData?.title : detailData?.name;
  const originalTitle = isMovie
    ? detailData?.original_title
    : detailData?.original_name;
  const releaseDate = isMovie
    ? detailData?.release_date
    : detailData?.first_air_date;

  const season = isMovie ? [] : detailData?.seasons;

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
                <DetailTitle>{title}</DetailTitle>
                <OriginalTitle>{originalTitle}</OriginalTitle>
              </MovieDetailTitle>
              <DetailOverview>{detailData.overview}</DetailOverview>
              <GenreBox>
                {detailData.genres.map((g) => (
                  <GenreList key={g.id}>{g.name}</GenreList>
                ))}
              </GenreBox>
              <InfoBox>
                {releaseDate && <Release>Release Day {releaseDate}</Release>}
                {detailData.runtime && (
                  <Runtime>{detailData.runtime}minutes</Runtime>
                )}
              </InfoBox>

              {isMovie && (
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
              )}

              {!isMovie && (
                <SeasonBox>
                  {season?.map((epic) => (
                    <ActorList key={epic.id}>
                      <ActorImage
                        $bgphoto={makeImagePath(epic.poster_path + "", "w500")}
                      />
                      <ActorName>{epic.name}</ActorName>
                      <ActorCharacter>
                        season# {epic.season_number} (episode{" "}
                        {epic.episode_count})
                      </ActorCharacter>
                    </ActorList>
                  ))}
                </SeasonBox>
              )}
            </>
          )}
        </Detail>
      )}
    </>
  );
}

export default DetailMovie;
