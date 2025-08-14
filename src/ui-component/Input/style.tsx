import styled from 'styled-components';
import Text from '../Text';

type InpputContainerProps = {
  hasError: boolean;
};

export const InputContainer = styled.div<InpputContainerProps>`
  width: inherit;
  max-width: 100%;
  display: flex;
  flex-direction: column;

  .input-styled {
    position: relative;
  }

  input[type='text'],
  input[type='number'] {
    height: 40px;
  }

  input[type='text'],
  input[type='number'],
  textarea {
    width: 100%;
    border: 1px solid var(--color-ebonyClay);
    border-radius: 6px;
    padding: 0 24px;
    font-size: 14px;
    outline: none;
    &:disabled {
      background: var(--color-disabled);
    }
  }

  textarea {
    /* height: 100px; */
    padding: 10px 12px;
    resize: none;
    vertical-align: top;
  }

  .leading-icon {
    position: absolute;
    left: 8px;
    top: 8px;
  }
`;

export const LabelContainer = styled.div`
  display: flex;
  margin-bottom: 4px;

  .mandatory {
    display: inline;
  }
`;

export const HelpText = styled(Text)`
  margin-bottom: 10px;
`;
