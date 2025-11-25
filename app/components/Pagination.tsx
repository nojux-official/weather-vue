interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({currentPage, totalPages, onPageChange}: PaginationProps) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" role="navigation">
      <button
        className="pagination-previous"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      
      <button
        className="pagination-next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next page
      </button>
      
      <ul className="pagination-list">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return (
            <li key={page}>
              <button 
                className={`pagination-link ${currentPage === page ? 'is-current' : ''}`}
                onClick={() => onPageChange(page)}
                disabled={currentPage === page}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  )
}
