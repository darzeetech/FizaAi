import styled from 'styled-components';

export const DetailsStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 32px;
  padding: 32px 0px;
`;

export const FieldWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  gap: 24px;
`;

export const RadioFieldWrapper = styled.div`
  width: 50%;
`;

export const PhoneFieldWrapper = styled.div`
  .label {
    margin-bottom: 10px;
  }
  .input-field {
    display: flex;
    gap: 12px;
  }
`;
