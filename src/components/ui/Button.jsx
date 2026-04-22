import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className,
    disabled,
    ...props
}) => {

    const getStyle = () => {
        let style = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            border: 'none',
            outline: 'none',
            opacity: disabled || isLoading ? 0.5 : 1,
            letterSpacing: '-0.01em',
            ...props.style
        };

        // Size
        if (size === 'sm') {
            style.padding = '0.4rem 1.25rem';
            style.fontSize = '0.7rem';
        } else if (size === 'md') {
            style.padding = '0.65rem 1.75rem';
            style.fontSize = '0.8rem';
        } else {
            style.padding = '0.85rem 2.25rem';
            style.fontSize = '0.9rem';
        }
        
        style.borderRadius = '9999px'; // Pill shape for Neu-Minimalism

        // Variant - Premium Minimalist
        if (variant === 'primary') {
            style.background = 'var(--color-primary)';
            style.color = 'var(--color-on-primary)';
            style.boxShadow = '0 4px 12px rgba(49, 56, 81, 0.12)';
        } else if (variant === 'secondary') {
            style.background = 'transparent';
            style.color = 'var(--color-primary)';
            style.border = '1px solid var(--color-accent)';
            style.boxShadow = 'none';
        } else if (variant === 'ghost') {
            style.background = 'transparent';
            style.color = 'var(--color-accent)';
        } else if (variant === 'danger') {
            style.background = 'var(--color-primary)';
            style.color = 'var(--color-on-primary)';
            style.boxShadow = '0 4px 12px rgba(49, 56, 81, 0.12)';
        }

        return style;
    };

    return (
        <button
            className={clsx(className, "hover:scale-[1.02] active:scale-[0.98]")}
            style={getStyle()}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 size={16} style={{ marginRight: '0.75rem', animation: 'spin 1s linear infinite' }} />}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default Button;
