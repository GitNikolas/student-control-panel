import { useState, useMemo, useCallback } from 'react';
import type { Student } from '../../../entities/StudentCard/model/student.types';
import type { StudentFilter } from './types';

export const useStudentFilter = (students: Student[]) => {
    const [filters, setFilters] = useState<StudentFilter>({
        sortBy: 'newest'
    });

    const filteredAndSortedStudents = useMemo(() => {
        let result = [...students];

        // Фильтрация по имени
        if (filters.name) {
            const searchLower = filters.name.toLowerCase();
            result = result.filter(student =>
                student.name.toLowerCase().includes(searchLower)
            );
        }

        // Фильтрация по статусу
        if (filters.status) {
            result = result.filter(student =>
                student.status === filters.status
            );
        }

        // Фильтрация по дате регистрации
        if (filters.registrationDateFrom) {
            const fromDate = new Date(filters.registrationDateFrom);
            result = result.filter(student =>
                new Date(student.registrationDate) >= fromDate
            );
        }

        if (filters.registrationDateTo) {
            const toDate = new Date(filters.registrationDateTo);
            result = result.filter(student =>
                new Date(student.registrationDate) <= toDate
            );
        }

        // Сортировка
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
            case 'name_asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        return result;
    }, [students, filters]);

    const updateFilters = useCallback((newFilters: Partial<StudentFilter>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ sortBy: 'newest' });
    }, []);

    return {
        filters,
        updateFilters,
        resetFilters,
        filteredStudents: filteredAndSortedStudents,
    };
};