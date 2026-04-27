import { useState, useMemo, useCallback } from 'react';
import type { Student } from '../../../entities/StudentCard/model/student.types';
import type { StudentFilter } from "./filter.types.ts";
import { STATUSES, SORT_DIRECTION } from "./constants.ts";

export const useStudentFilter = (students: Student[]) => {
    const [filters, setFilters] = useState<StudentFilter>({
        name: '',
        status: STATUSES.all,
        sortBy: SORT_DIRECTION.newest,
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
        if (filters.status !== STATUSES.all) {
            result = result.filter(student =>
                student.status === filters.status
            );
        }

        // 3. Сортировка
        switch (filters.sortBy) {
            case SORT_DIRECTION.newest:
                result.sort((a, b) =>
                    new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
                );
                break;
            case SORT_DIRECTION.oldest:
                result.sort((a, b) =>
                    new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
                );
                break;
        }

        return result;
    }, [students, filters]);

    const updateFilters = useCallback((filters: StudentFilter) => {
        setFilters(prev => ({ ...prev, ...filters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            name: '',
            status: STATUSES.all,
            sortBy: SORT_DIRECTION.newest,
        });
    }, []);

    return {
        filters,
        updateFilters,
        resetFilters,
        filteredStudents: filteredAndSortedStudents,
    };
};