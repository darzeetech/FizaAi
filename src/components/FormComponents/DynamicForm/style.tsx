import styled from 'styled-components';
import _isUndefined from 'lodash/isUndefined';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 12px;
`;

export const FieldContainer = styled.div<{ width?: string; height?: string; styles?: any }>`
  ${({ width }) => !_isUndefined(width) && width !== '' && `width:${width}`};
  ${({ height }) => !_isUndefined(height) && height !== '' && `height:${height}`};
  ${({ styles }) => !_isUndefined(styles) && styles};
`;
