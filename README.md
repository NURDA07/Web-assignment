# Assignment #4: Introduction to JavaScript

## Team information
- **Team:** PixelForge
- **Group:** SE-2501
- **Members:** Marat Nurdaulet, Kadyr Tlektes, Suinalin Azamat

## Objective
The objective was to implement five interactive browser features using HTML, CSS, and vanilla JavaScript: form validation, an FAQ accordion, a popup subscription form, background color changes, and a live date/time display.

## Task 1 — Form validation
**Implementation steps:**
1. Added a registration form to the Contact page with name, email, password, and password-confirmation fields.
2. Added a JavaScript `submit` event listener and called `preventDefault()` so the demo does not send form data.
3. Checked required fields, browser email validity, a minimum password length of eight characters, and matching passwords.
4. Displayed a field-specific error beside invalid inputs and a general status message.


## Task 2 — FAQ accordion
**Implementation steps:**
1. Added FAQ questions to the existing About page as buttons.
2. Used `nextElementSibling` to find the answer after each question button.
3. Added a JavaScript click listener to show or hide panels and close a previously opened panel.
4. Used a CSS class (`open`) to show and hide the answer.


## Task 3 — Popup subscription form
**Implementation steps:**
1. Added a subscription dialog to the existing Home page, hidden by default.
2. Added a button to open it and a close button to dismiss it.
3. Added dismissal by clicking the backdrop or pressing Escape.
4. Added email validation and a local confirmation message. The form does not send or store email addresses.


## Task 4 — Background color
**Implementation steps:**
1. Defined four named background colors in a JavaScript array and integrated the control into the Home page.
2. Added a click handler that advances the color index and wraps around at the end.
3. Updated `document.body.style.backgroundColor` and displayed the selected color name.


## Task 5 — Current date and time
**Implementation steps:**
1. Created a `Date` object to obtain the current local time and displayed it on the Home page.
2. Formatted it with `toLocaleString()`.
3. Refreshed the displayed value every second with `setInterval`.


## Testing
-  Empty registration form displays required-field errors.
-  Invalid email is rejected.
-  Password shorter than 8 characters is rejected.
-  Different confirmation password is rejected.
-  Valid values show a success message.
-  FAQ answers open and close, with the initial state collapsed.
-  Popup opens, closes by the close button, backdrop, and Escape.
-  Background cycles through the predefined colors.
-  Date and time update every second.
-  Layout is checked on desktop and mobile widths.
-  Browser console contains no JavaScript errors.

## Deployment
- **Website URL:** https://astounding-fox-3ff624.netlify.app .

## Conclusion
The PixelForge website from Assignment 3 now includes all five Assignment 4 features: registration validation on Contact, the FAQ accordion on About, and the popup, background color button and live clock on Home. All the code is in one file, `js/script.js`, and uses basic JavaScript: functions, `if/else`, loops, event listeners, and DOM updates. The forms are demonstration-only and do not send or save data.
