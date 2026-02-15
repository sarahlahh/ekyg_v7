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
                        { label: 'IPC Validity', value: 'Pass', status: 'success' },
                        { label: 'Negative News', value: 'Review', status: 'warning' },
                    ],
                    financialCapability: [
                        { label: 'Financial Adequacy', value: 'Pass', status: 'success' },
                        { label: 'Unrestricted Reserves', value: 'Pass', status: 'success' },
                    ],
                    organisationalCapability: [
                        { label: 'Board Competency', value: 'Pass', status: 'success' },
                        { label: 'Staff Turnover', value: 'Low', status: 'success' },
                    ],
                    donorEngagement: [
                        { label: 'Acknowledgement', value: 'Found', status: 'success' },
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

customElements.define('kgy-app', KygApp);

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
                            <div class="assessment-item">
                                <span class="assessment-label">${item.label}</span>
                                <span class="assessment-value status ${item.status}">${item.value}</span>
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
