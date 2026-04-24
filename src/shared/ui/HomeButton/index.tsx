import { HomeOutlined } from '@ant-design/icons';
import styles from './styles.module.css';
import { useNavigate } from 'react-router';

export const HomeButton = () => {
    const navigate = useNavigate();

    return (
        <button
            aria-label='Кнопка на главную'
            className={styles.homeButton}
            onClick={(e) => {
                e.preventDefault();
                navigate('/');
            }}>
        <HomeOutlined className={styles.icon}/>
    </button>)
}