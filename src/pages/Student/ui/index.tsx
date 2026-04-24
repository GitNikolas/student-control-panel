import { useEffect, useState } from "react";
import { useParams } from 'react-router';
import { Card, Typography, Descriptions, Spin, Alert, Space, Row, Col, Statistic, Tag, Button, Select, Input, message } from 'antd';
import { MailOutlined, PhoneOutlined, CalendarOutlined, CheckCircleOutlined, MessageOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { Student as StudentT } from "../../../entities/StudentCard/model/student.types.ts";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const Student = () => {
    const [student, setStudent] = useState<StudentT | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editStatus, setEditStatus] = useState<string>('');
    const [editComment, setEditComment] = useState<string>('');
    const { id } = useParams();

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

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const handleEdit = () => {
        setEditStatus(student?.status || '');
        setEditComment(student?.managersComment || '');
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditStatus('');
        setEditComment('');
    };

    const handleSave = async () => {
        if (!student) return;

        const updates: Partial<StudentT> = {};

        if (editStatus !== student.status) {
            updates.status = editStatus as 'active' | 'inactive';
        }

        if (editComment !== student.managersComment) {
            updates.managersComment = editComment;
        }

        if (Object.keys(updates).length === 0) {
            setIsEditing(false);
            return;
        }

        try {
            setIsSaving(true);

            const response = await fetch(`${import.meta.env.VITE_API_HOST}/students/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Ошибка при сохранении');
            }

            const updatedStudent = await response.json();
            setStudent(updatedStudent);
            message.success('Изменения успешно сохранены');
            setIsEditing(false);
        } catch (error) {
            message.error('Не удалось сохранить изменения');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <Title level={1} style={{ color: 'white', marginBottom: '8px' }}>
                                {student.name}
                            </Title>
                            {isEditing ? (
                                <Space size="middle">
                                    <Select
                                        value={editStatus}
                                        onChange={setEditStatus}
                                        style={{ width: 150 }}
                                        options={[
                                            { value: 'active', label: 'Активен' },
                                            { value: 'inactive', label: 'Неактивен' }
                                        ]}
                                    />
                                    <Tag color="blue" style={{ fontSize: '16px', padding: '4px 12px' }}>
                                        Курс: {student.course}
                                    </Tag>
                                </Space>
                            ) : (
                                <>
                                    <Tag color={student.status === 'active' ? 'green' : 'orange'} style={{ fontSize: '16px', padding: '4px 12px' }}>
                                        Статус: {student.status === 'active' ? 'Активен' : 'Неактивен'}
                                    </Tag>
                                    <Tag color="blue" style={{ fontSize: '16px', padding: '4px 12px', marginLeft: '8px' }}>
                                        Курс: {student.course}
                                    </Tag>
                                </>
                            )}
                        </div>
                        {!isEditing ? (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={handleEdit}
                                size="large"
                            >
                                Редактировать
                            </Button>
                        ) : (
                            <Space>
                                <Button
                                    icon={<CloseOutlined />}
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={handleSave}
                                    loading={isSaving}
                                >
                                    Сохранить
                                </Button>
                            </Space>
                        )}
                    </div>
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
                    {isEditing ? (
                        <TextArea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            rows={4}
                            placeholder="Введите комментарий..."
                            showCount
                            maxLength={500}
                        />
                    ) : (
                        <Text type="secondary">{student.managersComment || 'Нет комментариев'}</Text>
                    )}
                </Card>
            </Space>
        </div>
    );
};