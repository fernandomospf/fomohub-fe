interface ChipProps {
    label: string;
    selected?: boolean;
    onClick?: () => void;
}

function Chip({
    label,
    selected,
    onClick,
}: ChipProps) {
    return (
        <div
            style={{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '16px',
                marginTop: '8px',
                backgroundColor: selected ? '#7c3aed' : '#202126',
                color: selected ? 'white' : '#fff9f9',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '12px',
            }}
            onMouseEnter={(e) => {
                if (!selected) {
                    e.currentTarget.style.backgroundColor = '#7c3aed';
                    e.currentTarget.style.color = 'white';
                }
            }}
            onMouseLeave={(e) => {
                if (!selected) {
                    e.currentTarget.style.backgroundColor = '#202126';
                    e.currentTarget.style.color = '#fff9f9';
                }
            }}
            onClick={(e) => {
                if (onClick) {
                    onClick();
                } else {
                    e.currentTarget.style.backgroundColor = '#7c3aed';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.filter = 'blur(0.5px)';
                }
            }}
        >
            {label}
        </div>
    )
}

export default Chip
