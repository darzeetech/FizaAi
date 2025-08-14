import { RightArrowIcon } from '../../assets/icons';
import { Text } from '../';
import { PaginationContainer } from './style';

export type PaginationInfoType = {
  currentPage: number;
  pageCount: number;
};

type PaginationProps = {
  pageInfo: PaginationInfoType;
  handlePageChange: (pageNumbers: number) => void;
};

const maxPageNumToShow = 7;

const Pagination = ({ pageInfo, handlePageChange }: PaginationProps) => {
  const { currentPage = 1, pageCount } = pageInfo;
  const pageArray = Array.from(
    { length: pageCount >= maxPageNumToShow ? maxPageNumToShow : pageCount },
    (_, i) => i + 1
  );

  return (
    <PaginationContainer>
      {pageArray.map((pageNumber) => (
        <div
          key={pageNumber}
          className="page-num-container"
          onClick={() => handlePageChange(pageNumber)}
        >
          <Text color={currentPage === pageNumber ? 'primary' : 'black'}>{pageNumber}</Text>
        </div>
      ))}
      {currentPage < pageCount && (
        <div className="next-page-container" onClick={() => handlePageChange(currentPage + 1)}>
          <Text color={currentPage > maxPageNumToShow ? 'primary' : 'black'}>Next</Text>
          <RightArrowIcon color="black" />
        </div>
      )}
    </PaginationContainer>
  );
};

export default Pagination;
