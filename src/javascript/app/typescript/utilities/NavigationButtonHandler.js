import { ButtonHandlerBase } from "../_primitives/ButtonHandlerBase";
export class NavigationButtonHandler extends ButtonHandlerBase {
    handleButtonClick(buttonId, stepIndex) {
        $(buttonId).click(() => {
            this.stepNavigator.navigateTo(stepIndex);
        });
    }
}
