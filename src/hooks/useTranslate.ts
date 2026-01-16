import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export function useTranslate() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslate must be used within a LanguageProvider');
    }
    return context;
}
