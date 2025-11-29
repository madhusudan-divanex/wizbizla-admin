const Pagination = ({ page, pages, onPageChange }) => {
    if (pages <= 1) return null;

    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

    return (
        <ul className="pagination pagination-primary mb-0">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                    className="page-link"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
            </li>

            {pageNumbers.map((p) => (
                <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => onPageChange(p)}>
                        {p}
                    </button>
                </li>
            ))}

            <li className={`page-item ${page === pages ? "disabled" : ""}`}>
                <button
                    className="page-link"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === pages}
                >
                    Next
                </button>
            </li>
        </ul>
    );
};

export default Pagination