import React, { useState } from "react";
import styled from "styled-components";
import Modal from "@mui/material/Modal";
import { ProfileProps } from "types/auth";
import { handleAvatar } from "@/api/user";
import { theme } from "@/styles/theme";
import Grid from "@mui/material/Grid";

export default function LeftPorfile(props: ProfileProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetAvatar = (idx: string) => {
    props.changeUserInfo("profileImageType", `Avatar${idx}`);
    props.handleToastClick("success", "아바타가 성공적으로 변경되었습니다.");
    handleClose();
  };

  return (
    <LeftBox>
      <ProfileBox onClick={handleOpen}>
        <ProfileImg
          src={handleAvatar(props.userAdditionalInfo.profileImageType)}
        />
      </ProfileBox>
      <SelectButton onClick={handleOpen}>아바타 선택</SelectButton>
      <Modal open={open} onClose={handleClose}>
        <ModalBox>
          <h1>아바타 선택</h1>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            {Array.from(Array(10), (_, idx) => (
              <AvatarBox
                key={idx}
                onClick={() => handleSetAvatar((idx + 1).toString())}
              >
                <AvatarImg src={handleAvatar(`Avatar${idx + 1}`)} />
              </AvatarBox>
            ))}
          </Grid>
        </ModalBox>
      </Modal>
    </LeftBox>
  );
}

const AvatarBox = styled.div`
  width: 20rem;
  height: 20rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  :hover {
    background-color: ${theme.colors.containerLight};
  }
`;

const ProfileBox = styled.div`
  width: 25rem;
  height: 25rem;
  border-radius: 50rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background};
  cursor: pointer;

  @media screen and (max-width: 1600px) {
    width: 20rem;
    height: 20rem;
  }
`;

const AvatarImg = styled.img`
  width: 10rem;
  @media screen and (max-width: 1600px) {
    width: 10rem;
  }
`;

const LeftBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 5rem 0;
`;

const ProfileImg = styled.img`
  width: 13rem;

  @media screen and (max-width: 1600px) {
    width: 10rem;
  }
`;

const SelectButton = styled.div`
  border-radius: 0.5rem;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: ${theme.colors.pink};
  cursor: pointer;

  @media screen and (max-width: 1600px) {
    font-size: 1.8rem;
    width: 10rem;
  }
`;

const ModalBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100rem;
  height: 50rem;
  background-color: ${theme.colors.background};
  border-radius: 1rem;
  box-shadow: 24;
  color: white;
  padding: 2rem;

  h1 {
    color: white;
    font-size: 3rem;
    margin-top: 0;
  }
`;
