# material2-sample
Simple sample app that consumes Angular Material 2 components. Built with the `angular-cli`.

NOTE: This is an updated version of the original:
https://github.com/jelbourn/material2-app


**See it live:**  http://material2-sample.eu-de.mybluemix.net

#### local install:
```
git clone https://github.com/m67hoff/material2-sample
cd material2-sample
npm i
ng s
```
#### Changelog to original:
- update to _@angular/cli 1.0.1 & Angular 4.1.0_
- update to _@angular/material@2.0.0-beta.3_
  - deprecated use of `<md-input>` and `<md-sidenav-layout>` replaced with `<md-input-container>` and `<md-sidenav-container>` 
  - theming as described in https://material.angular.io/guide/theming  including Multiple themes and theme for overlay-based components
- some code cleaning (e.g.`<md-icon>` use, css file sorted, ...) 
- update to _@angular/cli 1.0.3_ , Angular 4.1.2_ &  _@angular/material@2.0.0-beta.5_

#### ToDo
- replace deprecated import of MaterialModule  (-> split to seperate import for each componet)
- create my own branch 
