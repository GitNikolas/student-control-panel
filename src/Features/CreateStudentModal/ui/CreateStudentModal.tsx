import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Form, Input, Select, Button, Space, Typography } from 'antd';
import { UserAddOutlined, MailOutlined, PhoneOutlined, BookOutlined, StarOutlined } from '@ant-design/icons';
import type {Student} from "../../../entities/StudentCard/model/student.types.ts";
import { COURSE_OPTIONS } from "../model/constants.ts";

const { Title } = Typography;
const { TextArea } = Input;

interface CreateStudentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: Student) => Promise<void>;
    loading?: boolean;
}

const STATUS_OPTIONS = [
    { value: 'active', label: 'Активный', color: 'green' },
    { value: 'inactive', label: 'Неактивный', color: 'red' },
];

export const CreateStudentModal = ({
   open,
   onClose,
   onSubmit,
   loading = false
}: CreateStudentModalProps) => {
    const [form] = Form.useForm();
    const modalContainer = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Создаем контейнер для портала, если его нет
        if (!modalContainer.current) {
            const container = document.getElementById('modal-root');
            if (container) {
                modalContainer.current = container;
            } else {
                // Если контейнера нет, создаем его
                const newContainer = document.createElement('div');
                newContainer.id = 'modal-root';
                document.body.appendChild(newContainer);
                modalContainer.current = newContainer;
            }
        }

        // Блокируем скролл body при открытии модалки
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const handleSubmit = async (values: Student) => {
        try {
            await onSubmit(values);
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Failed to create student:', error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const modalContent = open ? (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.2s ease-in-out'
            }}
            onClick={handleCancel}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    width: '90%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    animation: 'slideUp 0.3s ease-in-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <UserAddOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>Создание нового студента</Title>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="name"
                            label="ФИО"
                            rules={[
                                { required: true, message: 'Введите ФИО студента' },
                                { min: 3, message: 'ФИО должно содержать минимум 3 символа' },
                                { max: 100, message: 'ФИО не должно превышать 100 символов' }
                            ]}
                        >
                            <Input
                                placeholder="Иванов Иван Иванович"
                                size="large"
                                prefix={<UserAddOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Введите email' },
                                { type: 'email', message: 'Введите корректный email' }
                            ]}
                        >
                            <Input
                                placeholder="student@example.com"
                                size="large"
                                prefix={<MailOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            name="phoneNumber"
                            label="Телефон"
                            rules={[
                                { required: true, message: 'Введите номер телефона' },
                                { pattern: /^[\d\s+()-]{10,20}$/, message: 'Введите корректный номер телефона' }
                            ]}
                        >
                            <Input
                                placeholder="+7 (999) 123-45-67"
                                size="large"
                                prefix={<PhoneOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            name="course"
                            label="Курс"
                            rules={[{ required: true, message: 'Выберите курс' }]}
                        >
                            <Select
                                placeholder="Выберите курс"
                                size="large"
                                options={COURSE_OPTIONS}
                                prefix={<BookOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Статус"
                            rules={[{ required: true, message: 'Выберите статус' }]}
                        >
                            <Select
                                placeholder="Выберите статус"
                                size="large"
                                options={STATUS_OPTIONS}
                                prefix={<StarOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            name="managersComment"
                            label="Комментарий менеджера"
                        >
                            <TextArea
                                rows={3}
                                placeholder="Дополнительная информация о студенте..."
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button onClick={handleCancel} size="large">
                                    Отмена
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    icon={<UserAddOutlined />}
                                >
                                    Создать студента
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    
                    @keyframes slideUp {
                        from {
                            transform: translateY(30px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </div>
    ) : null;

    return modalContainer.current
        ? createPortal(modalContent, modalContainer.current)
        : null;
};