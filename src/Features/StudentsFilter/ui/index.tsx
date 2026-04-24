import { useState, useEffect } from 'react';
import {
    Input,
    Select,
    Button,
    Space,
    Card,
    Row,
    Col,
    Typography,
    Badge,
    DatePicker
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    PlusOutlined,
    UnlockOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import type { StudentFilter as StudentFilterType } from '../model/types';

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface StudentFilterProps {
    onFilterChange: (filters: StudentFilterType) => void;
    onCreateStudent: () => void;
    onReset?: () => void;
    totalCount?: number;
    loading?: boolean;
}

const STATUS_OPTIONS = [
    { value: 'all', label: 'Все статусы' },
    { value: 'active', label: 'Активный', color: 'green' },
    { value: 'inactive', label: 'Неактивный', color: 'red' },
    { value: 'pending', label: 'На рассмотрении', color: 'orange' },
    { value: 'graduated', label: 'Выпущен', color: 'blue' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
    { value: 'name_asc', label: 'По имени (А-Я)' },
    { value: 'name_desc', label: 'По имени (Я-А)' },
];

export const StudentFilter = ({
                                  onFilterChange,
                                  onCreateStudent,
                                  onReset,
                                  totalCount = 0,
                                  loading = false
                              }: StudentFilterProps) => {
    const [searchName, setSearchName] = useState('');
    const [status, setStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // Применяем фильтры при изменении любого параметра
    useEffect(() => {
        const filters: StudentFilterType = {
            ...(searchName && { name: searchName }),
            ...(status !== 'all' && { status }),
            sortBy,
        };
        onFilterChange(filters);
    }, [searchName, status, sortBy]);

    const handleReset = () => {
        setSearchName('');
        setStatus('all');
        setSortBy('newest');
        onReset?.();
    };

    const hasActiveFilters = searchName || status !== 'all';

    return (
        <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]} align="middle">
                {/* Поиск по имени - всегда виден */}
                <Col xs={24} md={10} lg={8}>
                    <Search
                        placeholder="Поиск по имени студента..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        size="large"
                        loading={loading}
                    />
                </Col>

                {/* Быстрые фильтры */}
                <Col xs={24} md={6} lg={4}>
                    <Select
                        placeholder="Статус"
                        value={status}
                        onChange={setStatus}
                        options={STATUS_OPTIONS}
                        style={{ width: '100%' }}
                        size="large"
                        suffixIcon={<FilterOutlined />}
                    />
                </Col>

                <Col xs={24} md={6} lg={4}>
                    <Select
                        placeholder="Сортировка"
                        value={sortBy}
                        onChange={setSortBy}
                        options={SORT_OPTIONS}
                        style={{ width: '100%' }}
                        size="large"
                    />
                </Col>

                {/* Кнопки действий */}
                <Col xs={24} md={0} lg={8}>
                    <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space>
                            <Button
                                icon={<UnlockOutlined />}
                                onClick={() => setIsFilterVisible(!isFilterVisible)}
                            >
                                Расширенный фильтр
                            </Button>
                            {hasActiveFilters && (
                                <Button onClick={handleReset}>
                                    Сбросить
                                </Button>
                            )}
                        </Space>
                        <Space>
                            <Badge count={totalCount} showZero color="blue">
                                <Button type="default" disabled>
                                    Найдено
                                </Button>
                            </Badge>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={onCreateStudent}
                                size="large"
                            >
                                Создать ученика
                            </Button>
                        </Space>
                    </Space>
                </Col>

                <Col xs={0} md={6} lg={8}>
                    <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button
                            icon={<UnlockOutlined />}
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                        >
                            Расширенный фильтр
                        </Button>
                        {hasActiveFilters && (
                            <Button onClick={handleReset}>
                                Сбросить фильтры
                            </Button>
                        )}
                        <Badge count={totalCount} showZero color="blue">
                            <Button type="default" disabled>
                                Найдено
                            </Button>
                        </Badge>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onCreateStudent}
                            size="large"
                        >
                            Создать ученика
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Расширенные фильтры */}
            {isFilterVisible && (
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                    <Col xs={24} md={12}>
                        <div style={{ marginBottom: '8px' }}>
                            <Typography.Text type="secondary">
                                <CalendarOutlined /> Диапазон дат регистрации
                            </Typography.Text>
                        </div>
                        <RangePicker
                            style={{ width: '100%' }}
                            placeholder={['Дата от', 'Дата до']}
                            format="DD.MM.YYYY"
                        />
                    </Col>
                    {/* Здесь можно добавить другие расширенные фильтры */}
                </Row>
            )}

            {/* Индикатор активных фильтров */}
            {hasActiveFilters && (
                <div style={{ marginTop: '12px' }}>
                    <Space size={[0, 8]} wrap>
                        {searchName && (
                            <Badge
                                count={`Имя: ${searchName}`}
                                style={{ backgroundColor: '#1890ff' }}
                                onClose={() => setSearchName('')}
                                closable
                            />
                        )}
                        {status !== 'all' && (
                            <Badge
                                count={`Статус: ${STATUS_OPTIONS.find(s => s.value === status)?.label}`}
                                style={{ backgroundColor: '#52c41a' }}
                                onClose={() => setStatus('all')}
                                closable
                            />
                        )}
                    </Space>
                </div>
            )}
        </Card>
    );
};