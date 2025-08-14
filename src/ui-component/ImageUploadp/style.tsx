import styled from 'styled-components';
import Text from '../Text';

export const ImageUploadContainer = styled.div<{ disabled?: boolean }>`
  .imgaes-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .input-file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: 1;
  }
  .input-label {
    width: 105px;
    height: 115px;
    border: 1px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .imgae-wrapper {
    position: relative;
    cursor: pointer;

    .cross-icon-container {
      position: absolute;
      right: -2px;
      top: -2px;
      background-color: var(--color-white);
      border: 1px solid var(--color-black);
      border-radius: 50%;
      width: 14px;
      height: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  .images {
    width: 115px;
    height: 115px;

    border: 1px dashed var(--color-ghost);
    border-radius: 8px;
  }
`;

export const LabelContainer = styled.div`
  display: flex;
  margin-bottom: 4px;

  .mandatory {
    vertical-align: sub;
  }
`;

export const HelpText = styled(Text)`
  margin-bottom: 10px;
`;

export const ImgModalBody = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 380px;
  }
`;
