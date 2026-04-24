import { useEffect, useState } from 'react';
import { StudentsList } from "../../Features/StudentsList/ui";
import type { Student } from "../../entities/StudentCard/model/student.types.ts";
import { StudentFilter } from '../../Features/StudentsFilter/ui';
import { useStudentFilter } from '../../Features/StudentsFilter/model/useStudentFilter.ts';
import { Alert, message } from 'antd';
import {CreateStudentModal, useCreateStudent} from "../../Features/CreateStudentModal";

export const Main = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { filteredStudents, updateFilters, resetFilters } = useStudentFilter(students);
    const { createStudent, isLoading: isCreating, error: createError } = useCreateStudent();

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            const res = await fetch(`${import.meta.env.VITE_API_HOST}/students`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setStudents(data);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleCreateStudent = async (values: Student) => {
        try {
            const newStudent: Student = await createStudent(values);
            message.success('Студент успешно создан!');

            setStudents(prev => [...prev, newStudent]); // Оптимистичное обновление

            setIsCreateModalOpen(false);
        } catch (error) {
            message.error(createError || 'Не удалось создать студента');
            throw error;
        }
    };

    if (isError) {
        return <Alert title="Ошибка" description="Не удалось загрузить студентов" type="error" showIcon />;
    }
    return (
        <div style={{ padding: '24px' }}>
            <StudentFilter
                onFilterChange={updateFilters}
                onCreateStudent={() => setIsCreateModalOpen(true)}
                onReset={resetFilters}
                totalCount={filteredStudents.length}
                loading={isLoading}
            />

            <StudentsList
                students={filteredStudents}
                isLoading={isLoading}
                onRefresh={fetchStudents}
            />

            <CreateStudentModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateStudent}
                loading={isCreating}
            />
        </div>
    );
}
