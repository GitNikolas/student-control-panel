import { Card } from 'antd';
import type { StudentProps } from '../model/student.types.ts';
import { useNavigate  } from "react-router";

export const StudentCard = ({
    id,
    name,
    email,
    course,
    status,
    registrationDate,
}: StudentProps) => {
    const navigate = useNavigate();

    return (
        <Card size={'small'} onClick={() => navigate(`/students/${id}`)}>
            <p>ID: {id}</p>
            <p>Имя: {name}</p>
            <p>Email: {email}</p>
            <p>Курс: {course}</p>
            <p>Статус: {status}</p>
            <p>Дата регистрации: {registrationDate}</p>
        </Card>
    )
}