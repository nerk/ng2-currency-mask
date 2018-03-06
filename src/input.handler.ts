import { InputService } from "./input.service";
import { KeyCode } from "./keycode";

export class InputHandler {

    private inputService: InputService;
    private onModelChange: Function;
    private onModelTouched: Function;

    constructor(private htmlInputElement: HTMLInputElement, options: any) {
        this.inputService = new InputService(htmlInputElement, options);
    }

    handleCut(event: any): void {
        if (this.htmlInputElement && this.htmlInputElement.readOnly) {
          return;
        }

        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            this.onModelChange(this.inputService.value);
        }, 0);
    }

    handleInput(event: any): void {
        if (this.htmlInputElement && this.htmlInputElement.readOnly) {
          return;
        }

        let keyCode = this.inputService.rawValue.charCodeAt(this.inputService.rawValue.length - 1);
        let rawValueLength = this.inputService.rawValue.length;
        let rawValueSelectionEnd = this.inputService.inputSelection.selectionEnd;
        let storedRawValueLength = this.inputService.storedRawValue.length;
        this.inputService.rawValue = this.inputService.storedRawValue;

        if (rawValueLength != rawValueSelectionEnd || Math.abs(rawValueLength - storedRawValueLength) != 1) {
            this.setCursorPosition(event);
            return;
        }

        if (rawValueLength < storedRawValueLength) {
            if (this.inputService.value != 0) {
                this.inputService.removeNumber(KeyCode.BACK);
            } else {
                this.setValue(0);
            }
        }

        if (rawValueLength > storedRawValueLength) {
            switch (keyCode) {
                case KeyCode.PLUS_SIGN:
                    this.inputService.changeToPositive();
                    break;
                case KeyCode.MINUS_SIGN:
                    this.inputService.changeToNegative();
                    break;
                default:
                    if (!this.inputService.canInputMoreNumbers || (isNaN(this.inputService.value) && String.fromCharCode(keyCode).match(/\d/) == null)) {
                        return;
                    }

                    this.inputService.addNumber(keyCode);
            }
        }

        this.setCursorPosition(event);
        this.onModelChange(this.inputService.value);
    }

    handleKeydown(event: any): void {
        if (this.htmlInputElement && this.htmlInputElement.readOnly) {
          return;
        }

        let keyCode = event.which || event.charCode || event.keyCode;

        if (keyCode == KeyCode.BACK || keyCode == KeyCode.DELETE || keyCode == KeyCode.SAFARI_DELETE) {
            event.preventDefault();
            let selectionRangeLength = Math.abs(this.inputService.inputSelection.selectionEnd - this.inputService.inputSelection.selectionStart);

            if (selectionRangeLength == this.inputService.rawValue.length || this.inputService.value == 0) {
                this.setValue(0);
                this.onModelChange(this.inputService.value);
            }
            else if (selectionRangeLength > 0) {
                this.inputService.removeNumbers();
                this.onModelChange(this.inputService.value);
            }

            if (selectionRangeLength == 0 && !isNaN(this.inputService.value)) {
                this.inputService.removeNumber(keyCode);
                this.onModelChange(this.inputService.value);
            }
        }
    }

    handleKeypress(event: any): void {
        if (this.htmlInputElement && this.htmlInputElement.readOnly) {
          return;
        }

        let keyCode = event.which || event.charCode || event.keyCode;

        if (keyCode == undefined || [KeyCode.TAB, KeyCode.RETURN].indexOf(keyCode) != -1 || this.isArrowEndHomeKeyInFirefox(event)) {
            return;
        }

        switch (keyCode) {
            case KeyCode.PLUS_SIGN:
                this.inputService.changeToPositive();
                break;
            case KeyCode.MINUS_SIGN:
                this.inputService.changeToNegative();
                break;
            default:
                if (this.inputService.canInputMoreNumbers && (!isNaN(this.inputService.value) || String.fromCharCode(keyCode).match(/\d/) != null)) {
                    this.inputService.addNumber(keyCode);
                }
        }

        event.preventDefault();
        this.onModelChange(this.inputService.value);
    }

    handlePaste(event: any): void {
        if (this.htmlInputElement && this.htmlInputElement.readOnly) {
          return;
        }

        setTimeout(() => {
            this.inputService.updateFieldValue();
            this.setValue(this.inputService.value);
            this.onModelChange(this.inputService.value);
        }, 1);
    }

    updateOptions(options: any): void {
        this.inputService.updateOptions(options);
    }

    getOnModelChange(): Function {
        return this.onModelChange;
    }

    setOnModelChange(callbackFunction: Function): void {
        this.onModelChange = callbackFunction;
    }

    getOnModelTouched(): Function {
        return this.onModelTouched;
    }

    setOnModelTouched(callbackFunction: Function) {
        this.onModelTouched = callbackFunction;
    }

    setValue(value: number): void {
        this.inputService.value = value;
    }

    private isArrowEndHomeKeyInFirefox(event: any) {
        if ([35, 36, 37, 38, 39, 40].indexOf(event.keyCode) != -1 && (event.charCode == undefined || event.charCode == 0)) {
            return true;
        }

        return false;
    }

    private setCursorPosition(event: any): void {
        setTimeout(function () {
            event.target.setSelectionRange(event.target.value.length, event.target.value.length);
        }, 0);
    }
}
