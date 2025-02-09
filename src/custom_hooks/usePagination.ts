import { useState, useCallback } from "react";

const usePagination = () => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const nextPage = useCallback(() => {
        setPage((prev) => prev + 1);
    }, []);

    const resetPagination = useCallback(() => {
        setPage(1);
        setHasMore(true);
    }, []);

    return { page, hasMore, setHasMore, nextPage, resetPagination };
};

export default usePagination;
