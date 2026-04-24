import { useState } from 'react';
import type { CreateStudentFormData } from './types';
import type {Student} from "../../../entities/StudentCard/model/student.types.ts";

export const useCreateStudent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createStudent = async (data: CreateStudentFormData): Promise<Student> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_HOST}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    registrationDate: new Date().toISOString(),
                    homeworkCompleted: 0,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Не удалось создать студента';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createStudent,
        isLoading,
        error,
    };
};