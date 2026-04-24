export interface StudentFilter {
    name?: string;
    status?: string;
    sortBy?: string;
    registrationDateFrom?: string;
    registrationDateTo?: string;
}

export interface StudentFilterProps {
    onFilterChange: (filters: Partial<StudentFilter>) => void;
    onCreateStudent: () => void;
    onReset?: () => void;
    totalCount?: number;
    loading?: boolean;
}
