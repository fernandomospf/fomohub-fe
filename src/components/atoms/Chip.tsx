interface ChipProps {
    label: string;
    selected?: boolean;
    view?: boolean;
    onClick?: () => void;
}

function Chip({
    label,
    selected,
    view = false,
    onClick,
}: ChipProps) {
    return (
        <div
            style={{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '16px',
                marginTop: '8px',
                backgroundColor: selected || view ? '#7c3aed' : '#202126',
                color: selected || view ? 'white' : '#fff9f9',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '.6px',
            }}
            onMouseEnter={(e) => {
                if (!selected && !view) {
                    e.currentTarget.style.backgroundColor = '#7c3aed';
                    e.currentTarget.style.color = 'white';
                }
            }}
            onMouseLeave={(e) => {
                if (!selected && !view) {
                    e.currentTarget.style.backgroundColor = '#202126';
                    e.currentTarget.style.color = '#fff9f9';
                }
            }}
            onClick={() => {
                if (onClick) {
                    onClick();
                }
            }}
        >
            {label}
        </div>
    )
}

export default Chip
