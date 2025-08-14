import styled from 'styled-components';

export const OrderSummaryContainer = styled.div`
  height: inherit;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--color-lavender);
`;

export const SummaryHeaderContainer = styled.div`
  height: 60px;
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 12px;
  background-color: var(--color-white);
  padding: 20px;
  z-index: 100;
`;

export const SummaryDetailsContainer = styled.div`
  flex: 1;
  width: inherit;
  display: flex;
  gap: 12px;
  background-color: var(--color-white);
  padding: 20px;

  .left-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .outfit-list {
      display: flex;
      justify-content: start;
      align-content: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .outfit-details-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: calc(100vh - 210px);
      overflow-y: auto;
      padding-right: 12px;
      padding-bottom: 24px;

      .inspiration-text {
        margin-top: 10px;
        cursor: pointer;
      }
    }
  }

  .right-container {
    flex: 0.4;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .customer-box {
      border: 1px solid var(--color-ebonyClay);
      border-radius: 4px;
      padding: 20px;
      flex-direction: column;
      gap: 4px;

      .box-item {
        display: flex;
        justify-content: start;
        align-items: start;
        gap: 12px;
      }
    }

    .amount-summary-container {
      height: calc(100vh - 250px);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 0px 12px 20px 0px;
    }

    .outfit-price-list {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .price-breakup-list {
        margin: 8px 0px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-left: 8px;
      }
      .date-field-style {
        padding-left: 8px;
      }
    }

    .outfit-summary-amount-box {
      background-color: rgba(238, 242, 255, 1);
      border-radius: 4px;
      padding: 12px 20px;

      .amount-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .amount-box {
      background-color: rgba(238, 242, 255, 1);
      border-radius: 4px;
      min-height: 40px;
      padding: 12px 20px;

      .amount-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .advance-amount-box {
      min-height: 40px;
      padding: 12px 20px;
      //display: flex;
      display: none;
      justify-content: space-between;
      align-items: center;
      border-radius: 4px;
      border: 1px solid var(--color-ebonyClay);

      .amount-field {
        width: 100px;
        height: 30px;
      }
    }
  }
`;
