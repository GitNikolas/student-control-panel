import { StudentCard } from "../../../entities/StudentCard/ui";
import type { Student } from "../../../entities/StudentCard/model/student.types.ts";
import { Col, Row, Card, Skeleton, Button, Empty, Space, Typography } from 'antd';
import { ReloadOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface StudentsListProps {
    students: Student[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

export const StudentsList = ({ students, isLoading = false, onRefresh }: StudentsListProps) => {

    if (students.length === 0 && !isLoading) {
        return (
            <Empty
                description="Список студентов пуст"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
                {onRefresh && (
                    <Button onClick={onRefresh} icon={<ReloadOutlined />}>
                        Обновить
                    </Button>
                )}
            </Empty>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Студенты</Title>
                    <Text type="secondary">({students.length})</Text>
                </Space>
                {onRefresh && (
                    <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={isLoading}>
                        Обновить
                    </Button>
                )}
            </div>

            <Row gutter={[16, 16]}>
                {isLoading
                    ? Array.from({ length: 9 }).map((_, index) => (
                        <Col key={`skeleton-${index}`} xs={24} sm={12} md={8}>
                            <Card>
                                <Skeleton active avatar paragraph={{ rows: 3 }} />
                            </Card>
                        </Col>
                    ))
                    : students.map((student) => (
                        <Col key={student.id} xs={24} sm={12} md={8}>
                            <StudentCard {...student} />
                        </Col>
                    ))}
            </Row>
        </div>
    );
};