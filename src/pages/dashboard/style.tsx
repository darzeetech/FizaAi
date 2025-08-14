import styled, { css } from 'styled-components';
import _isNil from 'lodash/isNil';

export const Container = styled.div<{ $showImg: boolean }>`
  height: inherit;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);

  ${({ $showImg = false }) => !$showImg && 'overflow-y: auto;'}

  .order-qr-style {
    position: fixed;
    width: calc(100vw - 330px);
    border-radius: 20px;
    height: 270px;
    right: 50px;
    bottom: 48px;
    // display: flex;
    display: none;
    justify-content: space-between;
    gap: 12px;
    background-color: var(--color-midnightExpress);

    .text-content {
      flex: 1;
      height: inherit;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
      gap: 8px;
      padding: 0px 50px;
      overflow-y: auto;

      @media only screen and (min-width: 1200px) {
        gap: 16px;
      }

      .step-4 {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 4px;

        .click-here-text {
          cursor: pointer;
        }
      }

      .news-text {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 8px;
      }

      .header-text {
        @media only screen and (max-width: 1200px) {
          font-size: 24px;
        }
      }
      .content-text {
        @media only screen and (max-width: 1200px) {
          font-size: 12px;
        }
      }
    }

    .qr-img-container {
      height: inherit;
    }

    .qr-img {
      width: 300px;
      height: inherit;
    }

    .cross-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--color-white);
      border-radius: 4px;
      cursor: pointer;
    }
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

export const InfoContainer = styled.div<{ bgColor?: string }>`
  display: flex;
  flex-justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;

  ${({ bgColor }) =>
    !_isNil(bgColor) &&
    css`
      background-color: ${bgColor};
      flex: 1;
    `}
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: 8px;

  .header {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(168, 168, 168, 0.2);
  }
  .content {
    padding: 12px 16px;
    flex: 1;
  }
`;
