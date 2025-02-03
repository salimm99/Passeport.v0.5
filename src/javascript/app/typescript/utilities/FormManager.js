export class FormManager {
    constructor(summaryGenerator) {
        this.summaryGenerator = summaryGenerator;
    }
    handleFormSubmission(formId, summaryContainer) {
        $(formId).submit((event) => {
            event.preventDefault();
            const summaryHtml = this.summaryGenerator.generateSummary();
            $(summaryContainer).html(summaryHtml);
        });
    }
}
