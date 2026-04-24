import { useEffect, useState } from "react";
import { StudentCard } from "../../../entities/StudentCard/ui";
import type { Student } from "../../../entities/StudentCard/model/student.types.ts"
import { Col, Row, Alert, Empty, Space, Typography, Button, Card, Skeleton } from 'antd';
import { ReloadOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const StudentsList = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            const res = await fetch(`${import.meta.env.VITE_API_HOST}/students`);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: Student[] = await res.json();
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

    if (isError) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    title="Ошибка загрузки"
                    description="Не удалось загрузить список студентов. Проверьте соединение с сервером."
                    type="error"
                    showIcon
                    action={<Button onClick={fetchStudents} icon={<ReloadOutlined />}>Повторить</Button>}
                />
            </div>
        );
    }

    if (students.length === 0 && !isLoading) {
        return (
            <div style={{ padding: '24px' }}>
                <Empty
                    description="Список студентов пуст"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button type="primary" onClick={fetchStudents} icon={<ReloadOutlined />}>
                        Обновить
                    </Button>
                </Empty>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Студенты</Title>
                    {!isLoading && <Text type="secondary">({students.length})</Text>}
                </Space>
            </div>

            <Row gutter={[16, 16]}>
                {isLoading
                    ?
                    Array.from({ length: 9 }).map((_, index) => (
                        <Col key={`skeleton-${index}`} xs={24} sm={12} md={8}>
                            <Card>
                                <Skeleton active avatar paragraph={{ rows: 3 }} />
                            </Card>
                        </Col>
                    ))
                    : students.map((student) => (
                        <Col key={student.id} xs={24} sm={12} md={8}>
                            <StudentCard
                                id={student.id}
                                name={student.name}
                                email={student.email}
                                course={student.course}
                                status={student.status}
                                registrationDate={student.registrationDate}
                            />
                        </Col>
                    ))}
            </Row>
        </div>
    );
};