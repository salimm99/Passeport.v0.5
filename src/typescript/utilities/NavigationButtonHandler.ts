import { ButtonHandlerBase } from "../_primitives/ButtonHandlerBase";

export class NavigationButtonHandler extends ButtonHandlerBase {
  handleButtonClick(buttonId: string, stepIndex: number): void {
    $(buttonId).click(() => {
      this.stepNavigator.navigateTo(stepIndex);
    });
  }
}
