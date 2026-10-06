export default function BrandMark({ size = 40, tone = "amber" }) {
    const isAmber = tone === "amber";

    return (
        <div
            className={
                "relative flex shrink-0 items-center justify-center rounded-2xl font-display font-extrabold shadow-sm " +
                (isAmber ? "bg-amber text-navy" : "bg-navy text-amber")
            }
            style={{ width: size, height: size, fontSize: size * 0.48 }}
        >
            R
            <span
                className="absolute -right-1 -top-1 rounded-full border-2 border-cream bg-orange"
                style={{ width: size * 0.26, height: size * 0.26 }}
                aria-hidden="true"
            />
        </div>
    );
}