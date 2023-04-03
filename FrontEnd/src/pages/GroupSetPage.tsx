import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import UserSection from "@components/group/UserListSection";
import ThemeRecSection from "@components/group/ThemeRecSection";
import Toast, { showToast } from "@/components/common/Toast";
import { IThemeData } from "types/slider";

export default function GroupSetPage() {
  const [userList, setUserList] = useState<GroupSetUer[]>([]);
  const [recTheme, setRectTheme] = useState<IThemeData[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const resetThemeView = () => {
    setRectTheme([]);
    handleThemeView("isShow", false);
    handleThemeView("isWaiting", false);
  };

  const handleThemeView = (type: string, value: boolean) => {
    if (type === "isShow") {
      setIsShow(value);
    } else {
      setIsWaiting(value);
    }
  };

  const handleRecTheme = (newValue: IThemeData[]) => {
    setRectTheme(newValue);
  };

  const handleDeleteUser = (nickname: string) => {
    setUserList((prev) => {
      return prev.filter((user) => user.nickname !== nickname);
    });
    resetThemeView();
  };

  const handleAddUser = (newUser: GroupSetUer) => {
    // if (userList.includes(newUser)) {
    if (userList.filter((user) => user.userId === newUser.userId).length > 0) {
      handleToastClick("error", "이미 추가된 유저입니다.");
    } else {
      handleToastClick("success", "성공적으로 추가되었습니다.");
      setUserList((prev) => {
        return [...prev, newUser];
      });
      resetThemeView();
    }
  };

  const handleToastClick = (
    type: IToastProps["type"],
    message: IToastProps["message"]
  ) => {
    showToast({ type, message });
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      const myUserData = [
        {
          userId: Number(localStorage.getItem("userId")),
          nickname: String(localStorage.getItem("nickname")),
          email: String(localStorage.getItem("email")),
          profileImageType: String(localStorage.getItem("profileImageType")),
        },
      ];
      setUserList(myUserData);
    }
  }, []);
  return (
    <>
      <Header />
      <RootContainer>
        <Container>
          <UserSection
            userList={userList}
            handleDeleteUser={handleDeleteUser}
            handleAddUser={handleAddUser}
          />
          <MiddleSection>
            <p>
              그룹 유저들을 추가하면, 모두가 공통으로 방문하지 않은 맞춤 추천
              테마가 제공됩니다! (최대 6명)
            </p>
            {/* <NavButton onClick={resetThemeView}>재설정</NavButton> */}
            <p>※ 유저를 변경하시면, 추천 결과가 초기화됩니다.</p>
          </MiddleSection>
          <ThemeRecSection
            userList={userList}
            handleToastClick={handleToastClick}
            recTheme={recTheme}
            handleRecTheme={handleRecTheme}
            isShow={isShow}
            isWaiting={isWaiting}
            handleThemeView={handleThemeView}
          />
        </Container>
        <Toast />
      </RootContainer>
    </>
  );
}

const RootContainer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Container = styled.div`
  width: 90%;
  height: 90%;
  margin: auto auto;
  padding: 2rem;
  /* padding-top: 1rem; */
  border-radius: 1rem;
  background-color: ${theme.colors.container};
  display: flex;
  flex-direction: column;
`;

const MiddleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    color: ${theme.colors.pink};
    font-size: 1.5rem;
  }
  h1 {
    font-size: 3.2rem;
    font-weight: ${theme.fontWeight.extraBold};
  }
`;

const NavButton = styled.div`
  color: ${theme.colors.pink};
  font-size: 1.3rem;
  cursor: pointer;
  border: solid 1px ${theme.colors.pink};
  border-radius: 1rem;
  padding: 0.7rem 1rem;
  transition: transform 0.3s ease-in-out;
  &:hover {
    border: solid 1px white;
    color: white;
    background-color: ${theme.colors.pink};
    /* transform: scale(1.1); */
  }
`;