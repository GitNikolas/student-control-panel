import { Form, Input, Select, Button, Space } from 'antd';
import { UserAddOutlined, MailOutlined, PhoneOutlined, BookOutlined, StarOutlined } from '@ant-design/icons';
import type { Student } from "../../../entities/StudentCard/model/student.types.ts";
import { COURSE_OPTIONS } from '../model/constants.ts';

const { TextArea } = Input;

interface CreateStudentFormProps {
    onSubmit: (values: Student) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    initialValues?: Partial<Student>;
}

const STATUS_OPTIONS = [
    { value: 'active', label: 'Активный', color: 'green' },
    { value: 'inactive', label: 'Неактивный', color: 'red' },
];



export const CreateStudentForm = ({
    onSubmit,
    onCancel,
    loading = false,
    initialValues
}: CreateStudentFormProps) => {
    const [form] = Form.useForm();

    const handleFinish = async (values: Student) => {
        await onSubmit(values);
        form.resetFields();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
            initialValues={initialValues}
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
                    suffixIcon={<BookOutlined />}
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
                    suffixIcon={<StarOutlined />}
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
                    <Button onClick={onCancel} size="large">
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
    );
};