/**
 * Full-screen gate for phones / small devices.
 * Desktop & laptop continue normally — CSS hides this above the breakpoint.
 */
export default function PhoneBlock() {
  return (
    <div className="phone-block" role="dialog" aria-modal="true" aria-labelledby="phone-block-title">
      <div className="phone-block__glow" aria-hidden />
      <div className="phone-block__card">
        <p className="phone-block__kicker">Stelora Media</p>
        <h1 id="phone-block-title" className="phone-block__title">
          Best on a larger screen
        </h1>
        <p className="phone-block__body">
          This experience is crafted for laptops and desktops — open it on a MacBook or
          monitor for the full site.
        </p>
        <p className="phone-block__hint">Phone view is intentionally unavailable.</p>
      </div>
    </div>
  );
}
