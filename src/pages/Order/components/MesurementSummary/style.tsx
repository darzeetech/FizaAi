import styled from 'styled-components';

export const MeasurementSummaryContainer = styled.div`
  margin-top: 12px;

  .box {
    min-height: 150px;
    min-width: 30%;
    padding: 24px 12px;
    position: relative;
    border: 1px solid var(--color-ebonyClay);
    border-radius: 8px;
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0px;
    }

    .alias {
      position: absolute;
      top: -10px;
      background-color: var(--color-white);
      padding: 0px 2px;
    }

    .details-container {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      height: 60px;
      width: 250px;
      padding-right: 12px;

      border: 1px solid var(--color-ebonyClay);

      .img-title-container {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: start;

        .img-div {
          width: 75px;
          height: 60px;
          background-color: var(--color-white);
          box-shadow: 2px 1px 6px 0px rgba(0, 0, 0, 0.15);

          img {
            width: inherit;
            height: inherit;
          }
        }

        .title-text {
          word-wrap: break-word;
        }
      }
    }

    .stitch-option-summary {
      /* margin-top: 16px; */
    }

    .stitch-detail-container {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .stitch-item {
      display: flex;
      gap: 8px;
    }
  }

  .image-container {
    margin-bottom: 12px;
  }
`;
