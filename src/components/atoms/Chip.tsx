interface ChipProps {
    label: string;
    selected?: boolean;
    view?: boolean;
    onClick?: () => void;
    disabledOnClick?: boolean;
    customBackgroundColor?: string;
}

function Chip({
    label,
    selected,
    view = false,
    onClick,
    disabledOnClick = false,
    customBackgroundColor
}: ChipProps) {
    return (
        <div
            style={{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '16px',
                marginTop: '8px',
                backgroundColor: customBackgroundColor ? customBackgroundColor : selected || view ? '#7c3aed' : '#202126',
                color: customBackgroundColor ? 'white' : selected || view ? 'white' : '#fff9f9',
                cursor: disabledOnClick ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '.6px',
                textTransform: 'capitalize',
                pointerEvents: disabledOnClick ? 'none' : 'auto',
            }}
            onMouseEnter={(e) => {
                if (!selected && !view && !disabledOnClick) {
                    e.currentTarget.style.backgroundColor = '#7c3aed';
                    e.currentTarget.style.color = 'white';
                }
            }}
            onMouseLeave={(e) => {  
                if (!selected && !view && !disabledOnClick) {
                    e.currentTarget.style.backgroundColor = '#202126';
                    e.currentTarget.style.color = '#fff9f9';
                }
            }}
            onClick={() => {
                if (onClick && !disabledOnClick) {
                    onClick();
                }
            }}
        >
            {label}
        </div>
    )
}

export default Chip
