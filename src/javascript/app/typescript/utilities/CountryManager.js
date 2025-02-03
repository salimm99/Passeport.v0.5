export class CountryManager {
    constructor(countries) {
        this.countries = countries;
    }
    populateCountrySelect(selectors) {
        this.countries.forEach((country) => {
            selectors.forEach((selector) => {
                $(selector).append($("<option>", { value: country, text: country }));
            });
        });
    }
}
