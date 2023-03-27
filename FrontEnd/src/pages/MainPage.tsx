import React, { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Banner from "@/components/main/Banner";
import RankSlider from "@components/main/RankSlider";
import BasicSlider from "@components/main/Slider";
import AwardsSlider from "@components/main/AwardsSlider";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import {
  IAwardSlider,
  ISliderData,
  IAwardTheme,
  IThemeData,
} from "types/slider";
import { getThemeUser, getThemeGuest } from "@/api/theme";

export default function MainPage() {
  const [hotData, setHotData] = useState<IThemeData[]>(HotThemesData);
  const [topData, setTopData] = useState<ISliderData[]>(TopThemesData);
  const [awardData, setAwardData] = useState<IAwardSlider>(AwardThemesData);
  const [recommendData, setRecommendData] =
    useState<ISliderData[]>(RecommendThemesData);
  const isLogin = localStorage.getItem("userId") !== null ? true : false;
  const requestThemeUser = async () => {
    try {
      const res = await getThemeUser();
      const { recommendThemes, hotThemes, topThemes, awardThemes } = res.data;
      console.log(res.data);
      setRecommendData(recommendThemes);
      setHotData(hotThemes);
      setTopData(topThemes);
      setAwardData(awardThemes);
    } catch (err) {
      throw new Error("Internal Server Error ");
    }
  };
  const requestThemeGuest = async () => {
    try {
      const res = await getThemeGuest();
      setHotData(res.data.hotThemes);
      setTopData(res.data.topThemes);
      setAwardData(res.data.awardThemes);
      console.log(res.data.hotThemes);
    } catch (err) {
      throw new Error("Internal Server Error");
    }
  };

  useEffect(() => {
    isLogin ? requestThemeUser() : requestThemeGuest();
  }, []);
  return (
    <Container>
      <Header />
      <div className="box">
        {!isLogin && <Banner />}
        {isLogin && (
          <RecommendWrapper>
            <BasicSlider isRecommendSlider={true} topData={recommendData} />
          </RecommendWrapper>
        )}
        <RankSlider data={hotData} />
        <BasicSlider isRecommendSlider={false} topData={topData} />
        <AwardsSlider awardData={awardData} />
      </div>
    </Container>
  );
}

const Container = styled.div`
  background: ${theme.colors.background};
  /* background: linear-gradient(
    136.16deg,
    ${theme.colors.background} 35%,
    rgb(146, 89, 124) 65%
  ); */
  .box {
    overflow-y: scroll;
    height: calc(100vh - 7rem);
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 6px;
    }
  }
`;

const RecommendWrapper = styled.div`
  width: 90%;
  background-color: ${theme.colors.containerLight};
  border-radius: 1.5rem;
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  border: solid 1px ${theme.colors.pink};
  padding-bottom: 3rem;
`;
// api에서 가져올 데이터 (DUMMY)
const HotThemesData: IThemeData[] = [
  {
    themeId: 560,
    title: "온칼로: 10만년의 밤",
    imgUrl: "http://www.master-key.co.kr/upload/room/76_img1.jpg",
  },
  {
    themeId: 264,
    title: "X테마",
    imgUrl: "http://www.dumbndumber-sm.kr/img/sample_xtheme_26.png",
  },
  {
    themeId: 560,
    title: "온칼로: 10만년의 밤",
    imgUrl: "http://www.master-key.co.kr/upload/room/76_img1.jpg",
  },
  {
    themeId: 264,
    title: "X테마",
    imgUrl: "http://www.dumbndumber-sm.kr/img/sample_xtheme_26.png",
  },
  {
    themeId: 560,
    title: "온칼로: 10만년의 밤",
    imgUrl: "http://www.master-key.co.kr/upload/room/76_img1.jpg",
  },
  {
    themeId: 264,
    title: "X테마",
    imgUrl: "http://www.dumbndumber-sm.kr/img/sample_xtheme_26.png",
  },
  {
    themeId: 560,
    title: "온칼로: 10만년의 밤",
    imgUrl: "http://www.master-key.co.kr/upload/room/76_img1.jpg",
  },
  {
    themeId: 264,
    title: "X테마",
    imgUrl: "http://www.dumbndumber-sm.kr/img/sample_xtheme_26.png",
  },
];

const TopThemesData: ISliderData[] = [
  {
    label: "지역 별 인기 테마",
    themes: [
      {
        themeId: 1,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 2,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 3,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 4,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 5,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 6,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 7,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 8,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
    ],
  },
  {
    label: "유저들이 느낀 난이도 최고 테마 ",
    themes: [
      {
        themeId: 1,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 2,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 3,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 4,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 5,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 6,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 7,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 8,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
    ],
  },
];

const AwardThemeDummy: IAwardTheme[] = [
  {
    awardName: "코믹/문제/기타", // 수상 부문
    themeId: 1, // 테마 id
    title: "미스테리 거울의 방", // 테마명
    imgUrl:
      "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png", // 테마 포스터 링크
  },
  {
    awardName: "코믹/문제/기타", // 수상 부문
    themeId: 1, // 테마 id
    title: "미스테리 거울의 방", // 테마명
    imgUrl:
      "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png", // 테마 포스터 링크
  },
  {
    awardName: "코믹/문제/기타", // 수상 부문
    themeId: 1, // 테마 id
    title: "미스테리 거울의 방", // 테마명
    imgUrl:
      "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png", // 테마 포스터 링크
  },
  {
    awardName: "코믹/문제/기타", // 수상 부문
    themeId: 1, // 테마 id
    title: "미스테리 거울의 방", // 테마명
    imgUrl:
      "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png", // 테마 포스터 링크
  },
  {
    awardName: "코믹/문제/기타", // 수상 부문
    themeId: 1, // 테마 id
    title: "미스테리 거울의 방", // 테마명
    imgUrl:
      "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png", // 테마 포스터 링크
  },
  {
    awardName: "코믹/문제/기타", // 수상 부문
    themeId: 1, // 테마 id
    title: "미스테리 거울의 방", // 테마명
    imgUrl:
      "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png", // 테마 포스터 링크
  },
  {
    awardName: "코믹/문제/기타", // 수상 부문
    themeId: 1, // 테마 id
    title: "미스테리 거울의 방", // 테마명
    imgUrl:
      "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png", // 테마 포스터 링크
  },
  {
    awardName: "코믹/문제/기타", // 수상 부문
    themeId: 1, // 테마 id
    title: "미스테리 거울의 방", // 테마명
    imgUrl:
      "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png", // 테마 포스터 링크
  },
];
const AwardThemesData: IAwardSlider = {
  year: 2019,
  theme: AwardThemeDummy,
};
const RecommendThemesData: ISliderData[] = [
  {
    label: "GG님을 위한 방탈출 테마 추천",
    themes: [
      {
        themeId: 1,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 2,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 3,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 4,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 5,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 6,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 7,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 8,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
    ],
  },
  {
    label: "GG님과 비슷한 유저들이 방문한 테마 추천",
    themes: [
      {
        themeId: 1,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 2,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 3,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 4,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 5,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 6,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 7,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
      {
        themeId: 8,
        title: "virus",
        imgUrl:
          "https://user-images.githubusercontent.com/55784772/224228582-191f008f-7cee-43c4-83c2-9bbab1512955.png",
      },
    ],
  },
];
