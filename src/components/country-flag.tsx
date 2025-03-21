const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  return (
    // <img
    //   src={`https://www.countryflags.io/${country}/flat/64.png`}
    //   alt={`Flag of ${country}`}
    // />
    <span className={`fi fi-${countryCode.toLowerCase()}`}></span>
  );
};

export default CountryFlag;
