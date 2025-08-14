import styled from 'styled-components';
import Text from '../Text';

export const AudioRecordContainer = styled.div`
  .audio-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 12px;

    .audio-item {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .delete-btn {
      cursor: pointer;
    }
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

export const AddAudioContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

export const RecordModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;

  .audio-btn-style {
    cursor: pointer;
  }
`;
