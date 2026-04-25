import { useState, useEffect } from 'react';
import {
    Input,
    Select,
    Button,
    Space,
    Card,
    Row,
    Col,
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type {StudentFilter as StudentFilterType, StudentFilterProps} from '../model/filter.types.ts';
import { useDebounce } from "../../../shared/hooks/useDebounce";

const { Search } = Input;

const STATUSES = {
    all: 'all',
    active: 'active',
    inactive: 'inactive'
} as const;

const STATUS_OPTIONS = [
    { value: STATUSES.all, label: 'Все статусы' },
    { value: STATUSES.active, label: 'Активный', color: 'green' },
    { value: STATUSES.inactive, label: 'Неактивный', color: 'red' },
];

const SORT_DIRECTION = {
    newest: 'newest',
    oldest: 'oldest'
} as const;

const SORT_OPTIONS = [
    { value: SORT_DIRECTION.newest, label: 'Сначала новые' },
    { value: SORT_DIRECTION.oldest, label: 'Сначала старые' },
];

const DEBOUNCE_DELAY = 500;

export const StudentFilter = ({
    onFilterChange,
    onCreateStudent,
    onReset,
    loading = false
}: StudentFilterProps) => {
    const [searchName, setSearchName] = useState<string>('');
    const [status, setStatus] = useState<string>(STATUSES.all);
    const [sortBy, setSortBy] = useState<string>(SORT_DIRECTION.newest);
    const debouncedSearchName = useDebounce<string>(searchName, DEBOUNCE_DELAY);

    // Применяем фильтры при изменении любого параметра
    useEffect(() => {
        const filters: StudentFilterType = {
            ...(searchName && { name: searchName }),
            status,
            sortBy,
        };

        onFilterChange(filters);
    }, [debouncedSearchName, status, sortBy]);


    const handleReset = () => {
        setSearchName('');
        setStatus(STATUSES.all);
        setSortBy(SORT_DIRECTION.newest);
        onReset?.();
    };

    const hasActiveFilters = searchName || status !== STATUSES.all;

    return (
        <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={10} lg={8}>
                    <Search
                        placeholder="Поиск по имени студента..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        value={searchName}
                        onChange={(e) => {
                            setSearchName(e.target.value || ' ')}
                        }
                        size="medium"
                        loading={loading}
                    />
                </Col>

                <Col xs={24} md={6} lg={4}>
                    <Select
                        placeholder="Статус"
                        value={status}
                        onChange={setStatus}
                        options={STATUS_OPTIONS}
                        style={{ width: '100%' }}
                        size="medium"
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
                        size="medium"
                    />
                </Col>

                <Row>
                    <Space wrap style={{ width: '100%', justifyContent: 'flex-end'}}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onCreateStudent}
                            size="medium"
                        >
                            Создать ученика
                        </Button>
                        {hasActiveFilters && (
                            <Button onClick={handleReset} size="medium">
                                Сбросить фильтры
                            </Button>
                        )}
                    </Space>
                </Row>
            </Row>
        </Card>
    );
};