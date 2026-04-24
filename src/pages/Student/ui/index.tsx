import { useEffect, useState } from "react";
import { useParams } from 'react-router';
import { Card, Typography, Descriptions, Spin, Alert, Space, Row, Col, Statistic, Tag } from 'antd';
import { MailOutlined, PhoneOutlined, CalendarOutlined, CheckCircleOutlined, MessageOutlined } from '@ant-design/icons';
import type { Student as StudentT } from "../../../entities/StudentCard/model/student.types.ts";

const { Title, Text } = Typography;

export const Student = () => {
    const [student, setStudent] = useState<StudentT | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_HOST}/students/${id}`);
                const data = await res.json();
                setStudent(data);
            } catch {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    if (isError) return <Alert title="Ошибка" description="Произошла ошибка, повторите позже" type="error" showIcon />;
    if (isLoading) return <Spin size="large" description="Загрузка..." />;
    if (!student) return <Alert title="Не найдено" description="Пользователь не существует" type="warning" showIcon />;

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                <Card
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        marginBottom: '24px'
                    }}
                >
                    <Title level={1} style={{ color: 'white', marginBottom: '8px' }}>
                        {student.name}
                    </Title>
                    <Tag color="green" style={{ fontSize: '16px', padding: '4px 12px' }}>
                        Курс: {student.course}
                    </Tag>
                </Card>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Card>
                            <Statistic
                                title="Выполнено домашних заданий"
                                value={student.homeworkCompleted}
                                prefix={<CheckCircleOutlined />}
                                styles={{ content: { color: '#3f8600' } }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card>
                            <Statistic
                                title="Дата регистрации"
                                value={student.registrationDate}
                                prefix={<CalendarOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card
                    title={<><MailOutlined /> Контактная информация</>}
                    aria-label="Контактная информация"
                >
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label={<><MailOutlined /> Email</>}>
                            <Text copyable>{student.email}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={<><PhoneOutlined /> Телефон</>}>
                            <Text copyable>{student.phoneNumber}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card
                    title={<><MessageOutlined /> Комментарий менеджера</>}
                    style={{ background: '#f7f9fc' }}
                >
                    <Text type="secondary">{student.managersComment || 'Нет комментариев'}</Text>
                </Card>
            </Space>
        </div>
    );
};