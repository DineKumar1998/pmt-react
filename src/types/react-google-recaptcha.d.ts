declare module 'react-google-recaptcha' {
    import * as React from 'react';

    interface ReCAPTCHAProps {
        sitekey: string;
        onChange?: (value: string | null) => void;
        onExpired?: () => void;
        onErrored?: () => void;
        theme?: 'light' | 'dark';
        size?: 'compact' | 'normal' | 'invisible';
        tabindex?: number;
        badge?: 'bottomright' | 'bottomleft' | 'inline';
        className?: string;
        style?: React.CSSProperties;
        ref?: React.Ref<any>;
    }

    export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> { }
}
