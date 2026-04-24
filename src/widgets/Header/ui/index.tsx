import React from 'react';
import { HomeButton } from "../../../shared/ui/HomeButton";
import styles from './styles.module.css'

export const Header = () => {

    return (
    <header className={styles.header}>
        <HomeButton />
    </header>)
}