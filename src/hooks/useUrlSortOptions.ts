import {OnChangeFn, SortingState} from "@tanstack/react-table";
import {useEffect, useState} from "react";

function getSortingState(sortParams: string[], orderParams: string[]): SortingState {
    if (sortParams.length !== orderParams.length) {
        return [];
    }

    return sortParams.map((value, index) => ({
        id: value,
        desc: orderParams[index] === 'desc',
    }));
}

function getParams(sorting: SortingState): string {
    return sorting.map(({ id, desc }) => (
        `sort=${id}&order=${desc ? 'desc' : 'asc'}`
    )).join('&');
}

export default function useUrlSortOptions({ pathname, searchParams }: { pathname: string, searchParams: URLSearchParams }): [SortingState, OnChangeFn<SortingState>] {
    const sortParams = searchParams.getAll('sort');
    const orderParams = searchParams.getAll('order');

    const initialSort = getSortingState(sortParams, orderParams);

    const [sorting, setSorting] = useState<SortingState>(initialSort);

    const params = getParams(sorting);

    useEffect(() => {
        history.replaceState(null, '', `${pathname}?${params}`);
    }, [pathname, params]);

    return [sorting, setSorting];
}
