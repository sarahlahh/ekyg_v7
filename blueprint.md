# KYG Analytics Web Application Blueprint

## 1. Project Overview

This document outlines the development plan for the **Enhanced Know-Your-Grantee (KYG) Analytics web application**. This application is designed for Singapore-based charities and aims to streamline the due diligence process for grant evaluators and philanthropy analysts.

## 2. Style, Design, and Features

*   **Modern UI:** Clean, professional, and modern user interface.
*   **Typography:** Expressive and clear typography.
*   **Color Palette:** Vibrant and energetic color palette.
*   **Effects:** Subtle textures and multi-layered drop shadows.
*   **Iconography:** Modern and intuitive icons.
*   **Interactivity:** Interactive elements with a "glow" effect.
*   **Responsiveness:** Fully responsive on mobile and web devices.

## 3. Assessment Logic

### Governance Track

*   **IPC Validity:**
    *   **Logic:** Checks if the charity's IPC (Institution of a Public Character) status is active and not expired.
    *   **Pass:** IPC is active and not expired.
    *   **Fail:** IPC is expired or not active.
*   **Negative News:**
    *   **Logic:** Performs a news scan for the charity's name.
    *   **Pass:** No significant negative news found.
    *   **Review:** Negative news found that requires manual review.

### Financial Capability Track

*   **Financial Adequacy:**
    *   **Logic:** Compares the total income to the total expenditure for the preceding financial year.
    *   **Pass:** Income is greater than or equal to expenditure.
    *   **Fail:** Income is less than expenditure (deficit).
*   **Unrestricted Reserves Ratio:**
    *   **Logic:** Calculates the ratio of unrestricted reserves to the last financial year's operating expenditure.
    *   **Pass:** Ratio is between 1 and 5 (inclusive), indicating a healthy level of reserves.
    *   **Review:** Ratio is outside the 1-5 range, which may indicate either insufficient reserves or hoarding of funds.

### Organisational Capability Track

*   **Board Competency:**
    *   **Logic:** This would typically be a qualitative assessment. A potential automated proxy could be to check the board members' profiles for relevant experience (e.g., on LinkedIn).
    *   **Pass:** Average competency score is above a certain threshold.
    *   **Review:** Average competency score is borderline.
*   **Staff Turnover:**
    *   **Logic:** This data is not typically public. A proxy could be to look at employee reviews on sites like Glassdoor, or this would be part of a due diligence questionnaire.
    *   **Low:** Implies a stable organization.
    *   **High:** Implies potential issues with management or work environment.

### Donor Engagement Track

*   **Acknowledgement:**
    *   **Logic:** Scans the charity's website and annual reports for donor acknowledgement sections.
    *   **Found:** A donor acknowledgement section is present.
    *   **Not Found:** No donor acknowledgement section is found.

## 4. Current Implementation Plan

### Step 1: Foundational Setup (Completed)

*   HTML structure, CSS styling, and initial JavaScript logic.
*   Web components for the main application container.
*   Firebase integration.

### Step 2: Charity Data Display & QA Dashboard (Completed)

*   UI structure for the Automated Data QA dashboard and charity data display.
*   Styling for the QA dashboard and data display sections.

### Step 3: Multi-Domain KYG Assessment Engine (Completed)

*   UI structure for the KYG Assessment Engine.
*   Styling for the assessment engine and its tracks.

### Step 4: Scoring, Risk Flags & Reporting (Completed)

*   UI structure for the Reporting section.
*   Styling for the reporting section, including the final KYG score, risk alerts, and download button.

### Step 5: Backend Integration (Simulated & Completed)

*   **Connect Components (`main.js`):**
    *   Add an event listener to the "Retrieve and Validate" button.
    *   Create a function to simulate data retrieval and processing.
    *   Dynamically update the UI with mock data upon button click.
    *   Implement a loading state for user feedback.
