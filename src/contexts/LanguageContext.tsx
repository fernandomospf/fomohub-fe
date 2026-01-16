import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import ptBR from '../locales/pt-BR.json';
import enUS from '../locales/en-US.json';
import es from '../locales/es.json';

type LocaleData = typeof ptBR;
type Language = 'pt-BR' | 'en-US' | 'es';

const translations: Record<Language, LocaleData> = {
    'pt-BR': ptBR,
    'en-US': enUS,
    'es': es,
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('pt-BR');

    useEffect(() => {
        const browserLang = navigator.language;
        if (browserLang.startsWith('en')) {
            setLanguage('en-US');
        } else if (browserLang.startsWith('es')) {
            setLanguage('es');
        } else {
            setLanguage('pt-BR');
        }
    }, []);

    const t = useCallback((key: string, params?: Record<string, string | number>) => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            value = value?.[k as keyof typeof value];
            if (value === undefined) return key;
        }

        if (typeof value === 'string' && params) {
            return Object.entries(params).reduce((acc, [key, val]) => {
                return acc.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
            }, value);
        }

        return value as string;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}
