import styled from 'styled-components';

export const FormikWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 10px auto;
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1% auto;
    width: 80%;
    @media (min-width: 768px) {
      width: 70%;
    }
    @media (min-width: 992px) {
      width: 50%;
      /* margin-right: 48%; */
      /* overflow: hidden; */
      /* margin-bottom: 25%; */
      margin: 3% auto;
    }
    @media (min-width: 1600px) {
      width: 40%;
      margin: 2% auto;
    }
  }
`;
