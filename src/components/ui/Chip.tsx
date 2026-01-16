interface ChipProps {
    label: string;
}

function Chip({
    label,
}: ChipProps) {
    return (
        <div
            style={{
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '16px',
            marginTop: '8px',
            backgroundColor: '#202126',
            color: '#fff9f9',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7c3aed';
                e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#202126';
                e.currentTarget.style.color = '#fff9f9';
            }}
            onClick={(e) => {
            e.currentTarget.style.backgroundColor = '#7c3aed';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.filter = 'blur(0.5px)';
            }}
        >
            {label}
        </div>
    )
}

export default Chip
