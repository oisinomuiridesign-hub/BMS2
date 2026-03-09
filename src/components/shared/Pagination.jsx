import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

function buildPageList(current, total) {
  const pages = new Set();
  pages.add(1);
  pages.add(total);
  if (current - 1 > 0) pages.add(current - 1);
  pages.add(current);
  if (current + 1 <= total) pages.add(current + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);

  // Insert ellipsis markers
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...');
    }
    result.push(sorted[i]);
  }
  return result;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  perPage = 12,
  onPageChange,
  onPerPageChange,
}) {
  const pages = buildPageList(currentPage, totalPages);

  return (
    <div className={styles.container}>
      <div className={styles.perPage}>
        <span className={styles.perPageLabel}>Cards per page:</span>
        <select
          className={styles.perPageSelect}
          value={perPage}
          onChange={(e) => onPerPageChange?.(Number(e.target.value))}
        >
          {[6, 12, 24].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.pages}>
        <button
          className={styles.navBtn}
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={page}
              className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange?.(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className={styles.navBtn}
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
