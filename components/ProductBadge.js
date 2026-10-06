import { getVariant } from "@/lib/productVisual";
import RisolIcon from "@/components/RisolIcon";

export default function ProductBadge({ name, size = 56 }) {
    const variant = getVariant(name);

    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-2xl"
            style={{ width: size, height: size, backgroundColor: variant.color + "1f" }}
        >
            <RisolIcon variant={variant.key} size={size * 0.55} color={variant.color} />
        </div>
    );
}