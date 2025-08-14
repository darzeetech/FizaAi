import styled from 'styled-components';

export const DateContainer = styled.div`
  .date-picker-container {
    position: relative;

    /* .react-datepicker__input-container .react-datepicker__calendar-icon {
      top: 4px;
      right: 10px;
      fill: var(--color-ghost);
      cursor: pointer;
    } */

    .react-datepicker-wrapper {
      display: inline;
    }

    .react-datepicker__input-container input {
      width: 100%;
      border-radius: 8px;
      border: 1px solid var(--color-white);
      background: var(--color-white);
      box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.06);
      outline: none;
      padding: 0px 12px;
      height: 40px;
      cursor: pointer;
    }

    .react-datepicker__month-wrapper {
      display: flex;
    }

    .icon {
      position: absolute;
      top: 8px;
      right: 12px;
      cursor: pointer;
    }
  }
`;
export const LabelContainer = styled.div`
  display: flex;
  margin-bottom: 10px;

  .mandatory {
    display: inline;
  }
`;
