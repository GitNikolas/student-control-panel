export const STATUSES = {
    all: 'all',
    active: 'active',
    inactive: 'inactive'
} as const;

export const STATUS_OPTIONS = [
    { value: STATUSES.all, label: 'Все статусы' },
    { value: STATUSES.active, label: 'Активный', color: 'green' },
    { value: STATUSES.inactive, label: 'Неактивный', color: 'red' },
];

export const SORT_DIRECTION = {
    newest: 'newest',
    oldest: 'oldest'
} as const;

export const SORT_OPTIONS = [
    { value: SORT_DIRECTION.newest, label: 'Сначала новые' },
    { value: SORT_DIRECTION.oldest, label: 'Сначала старые' },
];
