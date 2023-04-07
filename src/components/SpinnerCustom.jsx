const SpinnerCustom = ({ type = "light", styles }) => {
  return (
    <div className={`spinner-border text-${type}`} style={{ ...styles }}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SpinnerCustom;
