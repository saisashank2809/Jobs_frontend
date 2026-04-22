import clsx from 'clsx';

const Badge = ({ children, variant = 'default', className, style, ...props }) => {
    const variants = {
        default: 'border',
        accent: 'text-white shadow-xl shadow-black/5',
        success: 'border',
        warning: 'border',
        danger: 'border',
    };

    const isAccent = variant === 'accent';

    return (
        <span
            className={clsx(
                'inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider leading-none uppercase',
                variants[variant] || variants.default,
                className
            )}
            style={{
                backgroundColor: isAccent ? 'var(--color-primary)' : 'var(--bg-surface-solid)',
                borderColor: 'var(--color-accent)',
                color: isAccent ? 'var(--color-on-primary)' : 'var(--color-accent)',
                ...style
            }}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
