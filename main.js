const criteriaData = {
    governance: [
        {
            label: 'IPC Validity',
            logic: 'A "pass" is given if the charity\'s IPC (Institution of a Public Character) status is currently active and not expired. This is a direct check of their official registration status.',
        },
        {
            label: 'Negative News',
            logic: 'A "pass" is given if an automated scan of news sources finds no significant negative news stories associated with the charity.',
        }
    ],
    financialCapability: [
        {
            label: 'Financial Adequacy',
            logic: 'A "pass" is achieved when the charity\'s total income from the previous financial year is greater than or equal to its total expenditure. This indicates the charity is not operating at a deficit.',
        },
        {
            label: 'Unrestricted Reserves Ratio',
            logic: 'A "pass" is awarded if the ratio of the charity\'s unrestricted reserves to its previous year\'s operating expenses falls between 1 and 5. This range is considered healthy, suggesting the charity has enough reserves to operate for a reasonable period without being at risk of hoarding funds.',
        }
    ],
    organisationalCapability: [
        {
            label: 'Board Competency',
            logic: 'A "pass" is given if the board members\' collective experience and qualifications, often sourced from public profiles like LinkedIn, meet a predefined competency threshold.',
        },
        {
            label: 'Staff Turnover',
            logic: 'A "pass" (represented as "Low" turnover) is given if data suggests a stable workforce, which implies a healthy organizational environment. This data would typically come from due diligence questionnaires or public employee review sites.',
        }
    ],
    donorEngagement: [
        {
            label: 'Acknowledgement',
            logic: 'A "pass" (represented as "Found") is given if the system successfully finds a section dedicated to donor acknowledgements on the charity\'s website or in its annual reports.',
        }
    ]
};

class KygApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.retrieving = false;
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.getElementById('submit-btn').addEventListener('click', () => this.retrieveAndValidate());
    }

    retrieveAndValidate() {
        this.retrieving = true;
        this.render();

        setTimeout(() => {
            this.retrieving = false;

            const mockData = {
                charityProfile: {
                    registrationDate: '15/03/2012',
                    charityStatus: 'Registered',
                    ipcStatus: 'Active',
                    ipcExpiry: '31/12/2024',
                },
                qaDashboard: [
                    { label: 'Registry Data', status: 'success' },
                    { label: 'Financials', status: 'success' },
                    { label: 'News Scan', status: 'warning' },
                    { label: 'Website Scrape', status: 'success' },
                ],
                assessmentEngine: {
                    governance: [
                        { 
                            label: 'IPC Validity', 
                            value: 'Pass', 
                            status: 'success', 
                            justification: 'Pass if IPC status is active and not expired.',
                            details: { 'IPC Status': 'Active', 'Expiry Date': '31/12/2024' }
                        },
                        { 
                            label: 'Negative News', 
                            value: 'Review', 
                            status: 'warning', 
                            justification: 'Pass if no significant negative news is found.',
                            details: { 'Finding': 'Minor negative article found regarding a past project.' }
                        },
                    ],
                    financialCapability: [
                        {
                            label: 'Financial Adequacy',
                            value: 'Pass',
                            status: 'success',
                            justification: 'Pass if income is greater than or equal to expenditure.',
                            details: { 'Total Income': 520000, 'Total Expenditure': 500000 }
                        },
                        {
                            label: 'Unrestricted Reserves',
                            value: 'Pass',
                            status: 'success',
                            justification: 'Pass if reserves-to-expenditure ratio is between 1 and 5.',
                            details: { 'Unrestricted Reserves': 750000, 'Operating Expenditure': 500000, 'Ratio': 1.5 }
                        },
                    ],
                    organisationalCapability: [
                        { 
                            label: 'Board Competency', 
                            value: 'Pass', 
                            status: 'success', 
                            justification: 'Pass if board competency score is above a set threshold.',
                            details: { 'Finding': 'Board members have an average of 10+ years of relevant experience.' } 
                        },
                        { 
                            label: 'Staff Turnover', 
                            value: 'Low', 
                            status: 'success', 
                            justification: 'A low turnover rate implies a stable organization.',
                            details: { 'Finding': 'Data from public sources suggests a low staff turnover rate.' }
                        },
                    ],
                    donorEngagement: [
                        { 
                            label: 'Acknowledgement', 
                            value: 'Found', 
                            status: 'success', 
                            justification: 'Pass if a donor acknowledgement section is found on the website or in annual reports.',
                            details: { 'Finding': 'Donor acknowledgement page found on the charity\'s website.' }
                        },
                    ],
                },
                reporting: {
                    score: 9.1,
                    recommendation: 'Proceed',
                    riskAlerts: [
                        { message: 'Negative news requires review', status: 'warning' },
                    ],
                },
            };

            this.render(mockData);
        }, 2000);
    }

    render(data = {}) {
        const { charityProfile, qaDashboard, assessmentEngine, reporting } = data;

        this.shadowRoot.innerHTML = `
            <style>
                @import url('style.css');
            </style>
            <div class="app-container">
                <header class="header">
                    <h1>Enhanced Know-Your-Grantee (KYG) Analytics</h1>
                </header>

                <kyg-criteria-guide data='${JSON.stringify(criteriaData)}'></kyg-criteria-guide>

                <main class="main-content">
                    <section class="form-section">
                        <div class="form-group">
                            <label for="charity-name">Charity Name or UEN</label>
                            <input type="text" id="charity-name" placeholder="Enter Charity Name or UEN">
                        </div>
                        <div class="form-group">
                            <label for="documents">Supporting Documents</label>
                            <input type="file" id="documents" multiple>
                        </div>
                        <div class="form-group">
                            <label for="links">Links</label>
                            <textarea id="links" rows="4" placeholder="Paste relevant links here"></textarea>
                        </div>
                        <button class="btn" id="submit-btn" ${this.retrieving ? 'disabled' : ''}>
                            ${this.retrieving ? '<span class="loader"></span> Retrieving...' : 'Retrieve and Validate'}
                        </button>
                    </section>
                    <section class="dashboard-section">
                        <h2>Automated Data QA</h2>
                        <div id="qa-dashboard">
                            ${qaDashboard ? qaDashboard.map(item => `
                                <div class="qa-item">
                                    <span>${item.label}</span>
                                    <span class="status ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                                </div>
                            `).join('') : ''}
                        </div>
                    </section>
                </main>
                 <section id="charity-data-display">
                    <h2>Charity Profile</h2>
                    ${charityProfile ? `
                        <div class="data-grid">
                            <div class="data-item">
                                <span class="data-label">Registration Date:</span>
                                <span class="data-value">${charityProfile.registrationDate}</span>
                            </div>
                            <div class="data-item">
                                <span class="data-label">Charity Status:</span>
                                <span class="data-value">${charityProfile.charityStatus}</span>
                            </div>
                            <div class="data-item">
                                <span class="data-label">IPC Status:</span>
                                <span class="data-value">${charityProfile.ipcStatus}</span>
                            </div>
                            <div class="data-item">
                                <span class="data-label">IPC Expiry:</span>
                                <span class="data-value">${charityProfile.ipcExpiry}</span>
                            </div>
                        </div>
                    ` : ''}
                </section>
                ${assessmentEngine ? `<kyg-assessment-engine data='${JSON.stringify(assessmentEngine)}'></kyg-assessment-engine>` : ''}
                ${reporting ? `<kyg-reporting data='${JSON.stringify(reporting)}'></kyg-reporting>` : ''}
            </div>
        `;

        if (!this.retrieving) {
            this.shadowRoot.getElementById('submit-btn').addEventListener('click', () => this.retrieveAndValidate());
        }
    }
}

customElements.define('kyg-app', KygApp);

class KygCriteriaGuide extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const data = JSON.parse(this.getAttribute('data') || 'null');
        if (!data) return;

        this.shadowRoot.innerHTML = `
            <style>
                @import url('style.css');
            </style>
            <section class="criteria-guide">
                <h2>Evaluation Criteria</h2>
                <div class="criteria-grid">
                    ${Object.keys(data).map(track => `
                        <div class="criteria-track">
                            <h3>${track.charAt(0).toUpperCase() + track.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
                            ${data[track].map(item => `
                                <div class="criteria-item">
                                    <h4>${item.label}</h4>
                                    <p>${item.logic}</p>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }
}
customElements.define('kyg-criteria-guide', KygCriteriaGuide);

class KygAssessmentEngine extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const data = JSON.parse(this.getAttribute('data') || 'null');
        if (!data) return;

        this.shadowRoot.innerHTML = `
            <style>
                @import url('style.css');
            </style>
            <div class="assessment-grid">
                ${Object.keys(data).map(track => `
                    <div class="assessment-track">
                        <h3>${track.charAt(0).toUpperCase() + track.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
                        ${data[track].map(item => `
                            <div class="assessment-item-wrapper">
                                <div class="assessment-item">
                                    <div class="assessment-label-container">
                                        <span class="assessment-label">${item.label}</span>
                                        <div class="tooltip-container">
                                            <span class="tooltip-icon">?</span>
                                            <div class="tooltip-text">${item.justification}</div>
                                        </div>
                                    </div>
                                    <span class="assessment-value status ${item.status}">${item.value}</span>
                                </div>
                                ${item.details ? `
                                    <div class="assessment-details">
                                        ${Object.entries(item.details).map(([key, value]) => {
                                            let formattedValue = value;
                                            if (typeof value === 'number' && key !== 'Ratio') {
                                                formattedValue = `$${value.toLocaleString()}`;
                                            } else if (key === 'Ratio') {
                                                formattedValue = value.toFixed(2);
                                            }
                                            return `<div class="detail-entry"><span class="detail-label">${key}:</span> <span class="detail-value">${formattedValue}</span></div>`;
                                        }).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('kyg-assessment-engine', KygAssessmentEngine);

class KygReporting extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const data = JSON.parse(this.getAttribute('data') || 'null');
        if (!data) return;

        this.shadowRoot.innerHTML = `
            <style>
                @import url('style.css');
            </style>
            <div class="reporting-grid">
                <div class="reporting-section">
                    <h3>Final KYG Score</h3>
                    <div class="score-circle">
                        <span class="score">${data.score}</span>
                        <span class="score-label">/ 10</span>
                    </div>
                    <div class="recommendation recommendation-${data.recommendation.toLowerCase()}">
                        ${data.recommendation}
                    </div>
                </div>
                <div class="reporting-section">
                    <h3>Risk Alerts</h3>
                    ${data.riskAlerts.map(alert => `
                        <div class="risk-alert ${alert.status}">
                            ${alert.message}
                        </div>
                    `).join('')}
                </div>
                <div class="reporting-section">
                    <h3>Download Report</h3>
                    <button class="btn">Download PDF</button>
                </div>
            </div>
        `;
    }
}

customElements.define('kyg-reporting', KygReporting);
