import { InputManager } from "./input.manager";
import { KeyCode } from "./keycode";

export class InputService {

    private inputManager: InputManager;

    constructor(private htmlInputElement: any, private options: any) {
        this.inputManager = new InputManager(htmlInputElement);
    }

    addNumber(keyCode: number): void {
        let keyChar = String.fromCharCode(keyCode);
        
        if ('0123456789'.indexOf(keyChar) == -1) {
           return;  
        }

        if (!this.rawValue) {
            this.rawValue = this.applyMask(true, "0");
        }
        
        let selectionStart = this.inputSelection.selectionStart;
        let selectionEnd = this.inputSelection.selectionEnd;
        
        this.rawValue = this.rawValue.substring(0, selectionStart) + keyChar + this.rawValue.substring(selectionEnd, this.rawValue.length);
        if (selectionEnd - selectionStart >= this.rawValue.length) {
            this.updateFieldValue();
        } else {
            this.updateFieldValue(selectionStart + 1);
        }
    }

    applyMask(isNumber: boolean, rawValue: string): string {
        let { allowNegative, decimal, maxDigits, precision, prefix, suffix, thousands } = this.options;
        rawValue = isNumber ? new Number(rawValue).toFixed(precision) : rawValue;
        let onlyNumbers = rawValue.replace(/[^0-9]/g, "");

        if (!onlyNumbers) {
            return "";
        }

        let integerPart = onlyNumbers.slice(0, onlyNumbers.length - precision).replace(/^0*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, thousands);

        if (integerPart == "") {
            integerPart = "0";
        }

        let newRawValue = integerPart;
        let decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);

        if (precision > 0) {
            decimalPart = "0".repeat(precision - decimalPart.length) + decimalPart;
            newRawValue += decimal + decimalPart;
        }

        let isZero = parseInt(integerPart) == 0 && (parseInt(decimalPart) == 0 || decimalPart == "");
        let operator = (rawValue.indexOf("-") > -1 && allowNegative && !isZero) ? "-" : "";
        return operator + prefix + newRawValue + suffix;
    }

    clearMask(rawValue: string): number {
        if (rawValue === null || rawValue === '') {
            return 0;
        }

        let value = rawValue.replace(this.options.prefix, "").replace(this.options.suffix, "");

        if (this.options.thousands) {
            value = value.replace(new RegExp("\\" + this.options.thousands, "g"), "");
        }

        if (this.options.decimal) {
            value = value.replace(this.options.decimal, ".");
        }
        return parseFloat(value);
    }

    changeToNegative(): void {
        if (this.options.allowNegative && this.rawValue != "" && this.rawValue.charAt(0) != "-" && this.value != 0) {
            this.rawValue = "-" + this.rawValue;
        }
    }

    changeToPositive(): void {
        this.rawValue = this.rawValue.replace("-", "");
    }

    removeNumber(keyCode: number): void {
        let selectionEnd = this.inputSelection.selectionEnd;
        let selectionStart = this.inputSelection.selectionStart;

        if (selectionStart == selectionEnd && selectionStart < this.rawValue.search(/\d/)) {
            selectionStart = selectionEnd = this.rawValue.search(/\d/);
        }

        if (selectionStart > this.rawValue.length - this.options.suffix.length) {
            selectionEnd = this.rawValue.length - this.options.suffix.length;
            selectionStart = this.rawValue.length - this.options.suffix.length;
        }

        if (keyCode == KeyCode.DELETE || keyCode == KeyCode.SAFARI_DELETE) {
            if (this.rawValue.charAt(selectionEnd).search(/\d/) < 0) {
                selectionEnd = selectionEnd + 2;
            } else {
                selectionEnd = selectionEnd + 1;
            }
        }

        if (keyCode == KeyCode.BACK) {
            selectionStart = selectionStart - 1
            if (this.rawValue.charAt(selectionStart).search(/\d/) < 0) {
                selectionStart = selectionStart - 1;
            }
        }

        this.rawValue = this.rawValue.substring(0, selectionStart) + this.rawValue.substring(selectionEnd, this.rawValue.length) || "0";
        if (selectionStart == 0) {
          selectionStart = undefined;
        }
        this.updateFieldValue(selectionStart, keyCode);
    }

    removeNumbers(): void {
        let selectionEnd = this.inputSelection.selectionEnd;
        let selectionStart = this.inputSelection.selectionStart;

        if (selectionStart > this.rawValue.length - this.options.suffix.length) {
            selectionEnd = this.rawValue.length - this.options.suffix.length;
            selectionStart = this.rawValue.length - this.options.suffix.length;
        }

        this.rawValue = this.rawValue.substring(0, selectionStart) + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart, KeyCode.DELETE);
    }

    updateFieldValue(selectionStart?: number, keyCode?: number): void {
        let rawValue = this.rawValue || "0";
        let newRawValue = this.applyMask(false, rawValue);
        selectionStart = selectionStart == undefined ? newRawValue.length : selectionStart;
        this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart, keyCode);
    }

    updateOptions(options: any): void {
        let value: number = this.value;
        this.options = options;
        this.value = value;
    }

    get canInputMoreNumbers(): boolean {
        if (this.options.maxDigits > 0) {
            return this.rawValue.replace(/\D/g, '').length < this.options.maxDigits && this.inputManager.canInputMoreNumbers;
        } else {
            return this.inputManager.canInputMoreNumbers;
        }
    }

    get inputSelection(): any {
        return this.inputManager.inputSelection;
    }

    get rawValue(): string {
        return this.inputManager.rawValue;
    }

    set rawValue(value: string) {
        this.inputManager.rawValue = value;
    }

    get storedRawValue(): string {
        return this.inputManager.storedRawValue;
    }

    get value(): number {
        return this.clearMask(this.rawValue);
    }

    set value(value: number) {
        this.rawValue = this.applyMask(true, "" + value);
    }
}
