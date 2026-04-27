import { Form, Input, Select, Button, Typography, Modal } from 'antd';
import {
    UserAddOutlined,
    MailOutlined,
    PhoneOutlined,
    BookOutlined,
    StarOutlined
} from '@ant-design/icons';

import type { Student } from "../../../entities/StudentCard/model/student.types.ts";
import { COURSE_OPTIONS } from "../model/constants.ts";
import styles from './CreateStudentModal.module.css';

const { Title } = Typography;
const { TextArea } = Input;

interface CreateStudentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: Student) => Promise<void>;
    loading?: boolean;
}

const STATUS_OPTIONS = [
    { value: 'active', label: 'Активный' },
    { value: 'inactive', label: 'Неактивный' },
];

export const CreateStudentModal = ({
   open,
   onClose,
   onSubmit,
   loading = false
}: CreateStudentModalProps) => {
    const [form] = Form.useForm();

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

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            centered
            destroyOnClose
            width={600}
        >
            <div className={styles.content}>
                <div className={styles.header}>
                    <UserAddOutlined className={styles.headerIcon} />
                    <Title level={4} className={styles.headerTitle}>
                        Создание нового студента
                    </Title>
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
                            { min: 3, message: 'Минимум 3 символа' },
                            { max: 100, message: 'Максимум 100 символов' }
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
                            { type: 'email', message: 'Некорректный email' }
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
                            {
                                pattern: /^[\d\s+()-]{10,20}$/,
                                message: 'Некорректный номер'
                            }
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
                            placeholder="Дополнительная информация..."
                        />
                    </Form.Item>

                    <Form.Item className={styles.formActions}>
                        <div className={styles.actionsWrapper}>
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
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};