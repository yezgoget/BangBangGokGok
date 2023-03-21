import { theme } from "@/styles/theme";
import React, { useState } from "react";
import styled from "styled-components";
import { styled as mstyled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Toast, { showToast } from "@/components/common/Toast";

export default function EmailSection({
  handleValid,
}: {
  handleValid: () => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [validCode, setValidCode] = useState<string>("");

  const handleToastClick = (
    type: IToastProps["type"],
    message: IToastProps["message"]
  ) => {
    showToast({ type, message });
  };

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if (name === "email") {
      setEmail(e.target.value);
    } else {
      setValidCode(e.target.value);
    }
  };

  const sendCode = () => {
    if (email !== "") {
      console.log(email);
      handleToastClick("success", "5분간 유효한 코드가 전송되었습니다.");
    } else {
      // TODO : 이메일 형식 검사 reg 추가할 것
      handleToastClick("error", "올바른 이메일을 입력하세요.");
    }
  };

  const checkCode = () => {
    // TODO : API 다녀와서 200 res오면
    handleValid();
  };

  return (
    <Container>
      <SubjectText>이메일 인증</SubjectText>
      <p>이메일 인증 후, 비밀번호 변경이 가능합니다.</p>
      <HegihtHalfBox>
        <InputBox>
          <CustomTextField
            label="이메일"
            autoComplete="current-password"
            sx={{ width: 300 }}
            color="warning"
            name="email"
            focused
            placeholder="example123@naver.com"
            onChange={handleValue}
          />
          <ValidCheckButton onClick={sendCode}>코드 전송</ValidCheckButton>
        </InputBox>
        <InputBox>
          <CustomTextField
            label="인증코드"
            autoComplete="current-password"
            sx={{ width: 300 }}
            name="code"
            color="warning"
            focused
            placeholder="이메일로 발송된 코드를 입력하세요."
            onChange={handleValue}
          />
          <ValidCheckButton onClick={checkCode}>코드 확인</ValidCheckButton>
        </InputBox>
      </HegihtHalfBox>
      <Toast />
    </Container>
  );
}

const CustomTextField = mstyled(TextField)({
  width: "70%",
  height: "10%",
  color: "white",
  input: {
    color: "white",
    fontSize: "1.2rem",
  },
});

const HegihtHalfBox = styled.div`
  width: 100%;
  height: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const Container = styled.div`
  width: 40%;
  height: 55%;
  border-radius: 0.5rem;
  background-color: ${theme.colors.container};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 2 1.5rem;
  p {
    color: ${theme.colors.pink};
    font-size: 2rem;
  }
`;

const SubjectText = styled.div`
  margin: 0 auto;
  font-size: 3rem;
  font-weight: ${theme.fontWeight.extraBold};
`;

const InputBox = styled.div`
  width: 42rem;
  display: flex;
  justify-content: space-between;
`;

const ValidCheckButton = styled.div`
  width: 10rem;
  height: 3.2rem;
  border-radius: 0.5rem;
  padding-top: 1.3rem;
  text-align: center;
  font-size: 1.7rem;
  background-color: ${theme.colors.pink};
  cursor: pointer;
`;