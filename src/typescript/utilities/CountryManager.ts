export class CountryManager {
  private countries: string[];

  constructor(countries: string[]) {
    this.countries = countries;
  }

  populateCountrySelect(selectors: string[]): void {
    this.countries.forEach((country) => {
      selectors.forEach((selector) => {
        $(selector).append($("<option>", { value: country, text: country }));
      });
    });
  }
}
