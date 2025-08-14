import styled from 'styled-components';

export const PriceInfoContainer = styled.div`
  flex: 0.4;
  padding: 20px 60px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;

  .counter-container {
    width: 50%;
    max-width: 250px;
    min-width: 150px;
  }
`;

export const AdditionalPriceContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: start;
  gap: 16px;
`;

export const AddAdditionalCostContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const PriceSummary = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-solitude);
  border-radius: 4px;
  padding: 0px 4px;

  .header {
    padding: 12px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .price-breakup-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 20px;
  }

  .price-breakup {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .total-price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
  }
`;
