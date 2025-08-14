import styled from 'styled-components';

export const InvoiceSummaryContainer = styled.div`
  width: 100%;
  height: 100%;

  .invoice-header {
    height: 60px;
    width: 50%;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background-color: var(--color-white);
    border-top-left-radius: 8px;
    border-bottom: 1px solid var(--color-darkGray);
  }
  .header-btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }
`;

export const InvoiceSummaryContent = styled.div`
  height: calc(100% - 60px);
  overflow-y: auto;
  margin-top: 60px;
  display: flex;
  flex-direction: column;

  .content-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid var(--color-ebonyClay);
  }

  .invoice-right-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: end;
  }

  .invoice-info-text {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding: 12px 20px;
    border-bottom: 1px solid var(--color-ebonyClay);
  }

  .customer-info-text {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 4px;
  }

  .amount-summary-container {
    display: flex;
    flex-direction: column;
    flex: 0.75;
    min-width: 300px;
    gap: 8px;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    border: 1px solid var(--color-ebonyClay);

    .amount-field {
      width: 100px;
      height: 30px;
    }
  }

  .btn-container {
    display: flex;
    justify-content: end;
  }

  .footer-content {
    padding: 36px;
  }
`;

export const ModalBody = styled.div`
  padding: 20px 0px;
`;

export const PaymentOptionItem = styled.div<{ $isSelected: boolean }>`
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

  .img {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .revision-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

export const SelectedPayment = styled.div`
  cursor: pointer;

  .img {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .revision-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;
