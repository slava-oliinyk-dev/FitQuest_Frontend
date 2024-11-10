import './Pagination.sass';

function Pagination({ currentPage, onPageChange, totalPages }) {
  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      if (currentPage === 1) {
        return [1, 2, 3];
      } else if (currentPage === totalPages) {
        return [totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [currentPage - 1, currentPage, currentPage + 1];
      }
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <div className='pagination'>
      {visiblePages.map((pageNumber) => (
        (pageNumber >= 1 && pageNumber <= totalPages) && (
          <button
            key={pageNumber}
            className={`pagination__button ${pageNumber === currentPage ? 'pagination__button--active' : ''}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      ))}
    </div>
  );
}

export default Pagination;
