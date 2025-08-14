import styled from 'styled-components';

export const MeasurementContainer = styled.div`
  display: flex;
  gap: 48px;
`;

export const MeasuementModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const UploadMeasurementContainer = styled.div`
  .input-file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: 1;
  }
`;

export const UploadButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-transform: uppercase;
  border: 1px solid var(--color-black);
  background-color: var(--color-white);
  color: var(--color-black);
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
`;

export const MeasurementBodyContent = styled.div`
  position: relative;
`;

export const SelectedMeasurement = styled.div`
  height: 94px;
  width: calc(100% - 62px);
  position: fixed;
  padding: 12px 0px;
  z-index: 1000;
  background-color: var(--color-white);

  .revision-dropdown {
    width: 25vw;
  }
`;

export const RevisionDropdownOption = styled.div<{ $isSelected: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
  padding: 4px 8px;
  background-color: ${({ $isSelected = false }) =>
    $isSelected ? 'var(--color-primary)' : 'var(--color-white)'};

  &:hover {
    background-color: ${({ $isSelected = false }) =>
      $isSelected ? 'var(--color-primary)' : 'var(--color-solitude)'};
  }

  .revision-img {
    width: 24px;
    height: 24px;
  }

  .revision-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

export const CustomMeasurementContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 16px;
  margin-top: 94px;
`;

export const CustomMeasurementTabBody = styled.div`
  margin-top: 70px;
`;

export const CustomMeasurementImage = styled.img`
  width: 25vw;
  height: 30vh;
  position: fixed;
`;

export const CustomMeasurementList = styled.div`
  width: calc(100% - 25vw);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: calc(25vw);
  padding-left: 12px;
  padding-bottom: 12px;
`;

export const CustomMeasurementItem = styled.div<{ isFocused: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  padding: 8px 12px;

  border: ${({ isFocused = false }) =>
    isFocused ? '1px solid var(--color-primary)' : '1px solid var(--color-ebonyClay)'};

  .measurement-title {
    flex: 0.5;
  }

  .measurement-input {
    flex: 0.5;
  }
`;

export const ImageMeasurementContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 16px;
  margin-top: 94px;
`;
