# ng2-currency-mask

A very simple currency mask directive for Angular that allows using a number attribute with the ngModel. In other words, the model is a number, and not a string with a mask. You should use the version 2.x.x for Angular 2.x.x applications, version 4.x.x for Angular 4.x.x,
and version 5.x.x for Angular 5.x.x applications.

Note: This component is ready to AoC (Ahead-of-Time) compilation.

This is a fork of <https://github.com/cesarrew/ng2-currency-mask>, which incorporates some existing pull requests plus a few
additional fixes to make it working for me. The following issues should be fixed:

* [Input giving NaN in Ionic 3 and Angular 4 #91](https://github.com/cesarrew/ng2-currency-mask/issues/91)
* [input readonly property doesn't work #81](https://github.com/cesarrew/ng2-currency-mask/issues/81)
* [Incorrect digit position entry when all digits selected before input #77](https://github.com/cesarrew/ng2-currency-mask/issues/77)
* [Wrong value with "precision: 4" #75](https://github.com/cesarrew/ng2-currency-mask/issues/75)
* [Trying to delete via backspace not working when right after thousands / decimal devider #25](https://github.com/cesarrew/ng2-currency-mask/issues/25)
* Integrated [PR #86 (@AdamWold)](https://github.com/cesarrew/ng2-currency-mask/pull/86) with two changes: option 'digitLimit' was renamed to 'maxDigits' and there is no limit by default
* Integrated [PR #81 (@jasonbrandt42)](https://github.com/cesarrew/ng2-currency-mask/pull/87)
* Integrated [PR #25 (@cROSs116)](https://github.com/cesarrew/ng2-currency-mask/pull/85)
* Integrated [PR #92 (@LeonardoGraselAlmeida)](https://github.com/cesarrew/ng2-currency-mask/pull/92)


Upgraded to Angular 5.

Note: Default input content is never empty or showing the placeholder, but "0"!

## Getting Started

### Installing and Importing

Install the package by command:

```sh
    npm install ng2-currency-mask --save
```

Import the module

```ts
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
    imports: [
        ...
        CurrencyMaskModule
    ],
    declarations: [...],
    providers: [...]
})
export class AppModule {}
```

### Using 

```html
    <input currencyMask [(ngModel)]="value" />
```

 * `ngModel` An attribute of type number. If is displayed `'$ 25.63'`, the attribute will be `'25.63'`.

### Options 

You can set options...

```html
    <!-- example for pt-BR money -->
    <input currencyMask [(ngModel)]="value" [options]="{ prefix: 'R$ ', thousands: '.', decimal: ',' }"/>
```  

Available options: 

 * `align` - Text alignment in input. (default: `right`)
 * `allowNegative` - If `true` can input negative values.  (default: `true`)
 * `decimal` -  Separator of decimals (default: `'.'`)
 * `precision` - Number of decimal places (default: `2`)
 * `maxDigits` - Maximum number of digits to be entered (default: `0` (= unlimited))
 * `prefix` - Money prefix (default: `'$ '`)
 * `suffix` - Money suffix (default: `''`)
 * `thousands` - Separator of thousands (default: `','`)

You can also set options globally...

```ts
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    maxDigits: 0,
    prefix: "R$ ",
    suffix: "",
    thousands: "."
};

@NgModule({
    imports: [
        ...
        CurrencyMaskModule
    ],
    declarations: [...],
    providers: [
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

## Quick fixes

### Ionic 2-3

Input not working on mobile keyboard

```html
<!-- Change the type to 'tel' -->
    <input currencyMask type="tel" [(ngModel)]="value" />
```

Input focus get hide by the mobile keyboard

on HTML
```html
<!-- Change the type to 'tel' -->
    <input currencyMask type="tel" [(ngModel)]="value" [id]="'yourInputId' + index" (focus)="scrollTo(index)" />
```

on .ts
```ts
import { Content } from 'ionic-angular';

export class...

    @ViewChild(Content) content: Content;
  
    scrollTo(index) {
        let yOffset = document.getElementById('yourInputId' + index).offsetTop;
        this.content.scrollTo(0, yOffset + 20);
    }
```

## Questions? Open a Issue!