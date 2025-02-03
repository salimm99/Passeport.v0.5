import { SummaryGenerator } from "./SummaryGenerator.js";

export class FormManager {
  private summaryGenerator: SummaryGenerator;

  constructor(summaryGenerator: SummaryGenerator) {
    this.summaryGenerator = summaryGenerator;
  }

  handleFormSubmission(formId: string, summaryContainer: string): void {
    $(formId).submit((event) => {
      event.preventDefault();
      const summaryHtml = this.summaryGenerator.generateSummary();
      $(summaryContainer).html(summaryHtml);
    });
  }
}
