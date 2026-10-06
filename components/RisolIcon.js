export default function RisolIcon({ variant = "default", size = 28, color = "currentColor" }) {
    const common = {
        viewBox: "0 0 24 24",
        width: size,
        height: size,
        fill: "none",
        stroke: color,
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    if (variant === "kepiting") {
        return (
            <svg {...common}>
                <circle cx="12" cy="13" r="4" />
                <path d="M8.5 10.5 5 7M15.5 10.5 19 7" />
                <path d="M4 6.5c1.2 0 2.2.6 2.8 1.6M20 6.5c-1.2 0-2.2.6-2.8 1.6" />
                <path d="M9 17l-2 3M11.5 17.5l-1 3M12.5 17.5l1 3M15 17l2 3" />
            </svg>
        );
    }

    if (variant === "beef") {
        return (
            <svg {...common}>
                <path d="M4 15c0-4 3.5-7 8-7s8 3 8 7-3.5 5-8 5-8-1-8-5z" />
                <path d="M8 15c1-1 2-1 3 0s2 1 3 0 2-1 3 0" />
                <path d="M9 5c-1 1-1 2 0 3M13 4c-1 1-1 2.5 0 3.5M17 5c-1 1-1 2 0 3" />
            </svg>
        );
    }

    if (variant === "sosis") {
        return (
            <svg {...common}>
                <rect x="2.5" y="9" width="9" height="6" rx="3" transform="rotate(-18 7 12)" />
                <rect x="11.5" y="7" width="10" height="6" rx="3" transform="rotate(14 16.5 10)" />
                <path d="M10 11l2-1.5" />
            </svg>
        );
    }

    if (variant === "sayuran") {
        return (
            <svg {...common}>
                <path d="M4 20c0-7.5 5-12.5 13-13.5 1 7.5-3.5 12.5-10 13.5-1 .2-2 .2-3 0z" />
                <path d="M4 20c3.5-3.5 7-7 11-10.5" />
                <circle cx="18.5" cy="6" r="2" />
                <path d="M18 8l2 3" />
            </svg>
        );
    }

    if (variant === "kebab") {
        return (
            <svg {...common}>
                <line x1="12" y1="2" x2="12" y2="22" />
                <ellipse cx="12" cy="7" rx="3.2" ry="2" />
                <ellipse cx="12" cy="11.5" rx="3.6" ry="2" />
                <ellipse cx="12" cy="16" rx="3.2" ry="2" />
            </svg>
        );
    }

    return (
        <svg {...common}>
            <rect x="3" y="8" width="18" height="8" rx="4" />
            <path d="M8 8v8M16 8v8" />
        </svg>
    );
}