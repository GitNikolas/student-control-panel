import { useState, useMemo, useCallback } from 'react';
import type { Student } from '../../../entities/StudentCard/model/student.types';

export type StudentStatus = 'active' | 'inactive' | 'all';

export interface StudentFilter {
    name: string;
    status: StudentStatus;
    sortBy: 'newest' | 'oldest';
}

export const useStudentFilter = (students: Student[]) => {
    const [filters, setFilters] = useState<StudentFilter>({
        name: '',
        status: 'all',
        sortBy: 'newest'
    });

    const filteredAndSortedStudents = useMemo(() => {
        let result = [...students];
        // 1. Фильтр по имени
        const searchTerm = filters.name.trim().toLowerCase() || '';

        if (searchTerm) {
            result = result.filter(student => {
                const studentName = student.name?.toLowerCase() || '';
                return studentName.includes(searchTerm);
            });
        }

        // 2. Фильтр по статусу
        if (filters.status !== 'all') {
            result = result.filter(student =>
                student.status === filters.status
            );
        }

        // 3. Сортировка
        switch (filters.sortBy) {
            case 'newest':
                result.sort((a, b) =>
                    new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
                );
                break;
            case 'oldest':
                result.sort((a, b) =>
                    new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
                );
                break;
        }

        return result;
    }, [students, filters]);

    const updateFilters = useCallback((filters: Partial<StudentFilter>) => {
        setFilters(prev => ({ ...prev, ...filters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            name: '',
            status: 'all',
            sortBy: 'newest'
        });
    }, []);

    return {
        filters,
        updateFilters,
        resetFilters,
        filteredStudents: filteredAndSortedStudents,
    };
};