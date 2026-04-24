export type StudentStatus = 'active' | 'inactive' | 'all';

export interface StudentFilter {
    name: string;
    status: StudentStatus;
    sortBy: 'newest' | 'oldest';
}

export interface StudentFilterProps {
    onFilterChange: (filters: StudentFilter) => void;
    onCreateStudent: () => void;
    onReset?: () => void;
    totalCount?: number;
    loading?: boolean;
}
