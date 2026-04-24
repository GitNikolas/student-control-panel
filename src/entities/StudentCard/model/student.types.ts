type StudentStatus = 'active' | 'inactive';

export interface Student {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    course: string;
    status: StudentStatus;
    registrationDate: string;
    homeworkCompleted: number;
    managersComment: string;
};


export type StudentProps = Omit<Student, 'homeworkCompleted' | 'managersComment' | 'phoneNumber'>
