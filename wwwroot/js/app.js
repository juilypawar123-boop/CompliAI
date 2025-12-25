/******************************************************
 * COMPLIAI - MAIN APPLICATION JS
 * Single Page App Logic
 ******************************************************/

document.addEventListener("DOMContentLoaded", () => {
    initNavigationTabs();
    initFooterTabs();
    loadComplianceStatus();
    initRiskGauges();

    // Animate compliance shield
    const shieldCanvas = document.getElementById("complianceGauge");
    if (shieldCanvas) drawComplianceShield(shieldCanvas, 82);

});

/******************************************************
 * 1️⃣ TOP NAVIGATION BAR TAB SWITCHING
 ******************************************************/
function initNavigationTabs() {
    const tabs = document.querySelectorAll(".nav-tabs li");
    const panels = document.querySelectorAll("main .panel-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            // Hide all panels
            panels.forEach(p => p.classList.remove("active"));

            // This activate clicked tab
            tab.classList.add("active");

            const target = tab.getAttribute("data-tab");
            const panel = document.querySelector(`[data-panel="${target}"]`);
            if (panel) panel.classList.add("active");

            // These are my switches//
            switch (target) {
                case "policies":
                    loadPolicies();
                    break;
                case "risks":
                    loadRisks();
                    break;
                case "reports":
                    loadReports();
                    break;
            }
        });
    });
}
async function loadPolicies() {                  //Load Policies//
    const container = document.getElementById("policyList");
    if (!container) return; // safety check
    container.innerHTML = "";

    let data = [];
    try {
        const res = await fetch("/api/policy");
        data = await res.json();
    } catch (err) {
        console.warn("Failed to fetch policy, using sample data.", err);
        data = [
            { icon: "✅", name: "Incomplete Remote Work Security Policy", status: "Updated" },
            { icon: "✅", name: "Lack of Email Encryption Policy", status: "Need to update ASAP" },
            { icon: "✅", name: "Weak Password Management Policy", status: "On Priority" },
            { icon: "✅", name: "No Data Classification Guidelines", status: "Update is in process" },
        ];
    }

    data.forEach(p => {
        container.innerHTML += `
            <div class="card">
                <p>📄 ${p.name}</p>
                <p>Status: ${p.status}</p>
            </div>
        `;
    });
}

async function loadRisks() {                          // Load Risks//
    const container = document.getElementById("risksList");
    if (!container) return; // safety check
    container.innerHTML = "";

    let data = [];
    try {
        const res = await fetch("/api/risks");
        data = await res.json();
    } catch (err) {
        console.warn("Failed to fetch risks, using sample data.", err);
        data = [
            { icon: "⚠️", name: "Unencrypted sensitive data storage", level: "High" },
            { icon: "⚠️", name: "Lack of multi-factor authentication", level: "Medium" },
            { icon: "⚠️", name: "Outdated third party software libraries", level: "High" },
            { icon: "⚠️", name: "Non-compliance with GDPR cookie policies", level: "Medium" }
        ];
    }

    data.forEach(r => {
        container.innerHTML += `
            <div class="card">
                <p>${r.icon} ${r.name}</p>
                <p>Severity: ${r.level}</p>
            </div>
        `;
    });
}

async function loadReports() {                        // Load Reports//
    const container = document.getElementById("reportsList");
    if (!container) return; 
    container.innerHTML = "";

    let data = [];
    try {
        const res = await fetch("/api/reports");
        data = await res.json();
    } catch (err) {
        console.warn("Failed to fetch reports, using sample data.", err);
        data = [
            { icon: "🔒", name: "IT Security Audit Report", date: "Jun 2025" },
            { icon: "📊", name: "Quarterly Risk Assessment", date: "Apr 2025" },
            { icon: "🛡️", name: "Data Privacy Impact Assessment", date: "Mar 2025" },
            { icon: "📄", name: "Vendor GDPR Compliance Report", date: "Feb 2025" },
        ];
    }

    data.forEach(r => {
        container.innerHTML += `
            <div class="card">
                <p>${r.icon} ${r.name}</p>
                <p>Date: ${r.date}</p>
            </div>
        `;
    });
}

async function saveSettings() {                             //Load Settings//
    await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications: true })
    });

    alert("Settings saved");
}


/******************************************************
 * FOOTER TAB SWITCHING (Privacy / Terms / Contact)
 ******************************************************/
const footerPanelContent = {
    privacy: `
        <p>CompliAI respects your privacy. We process compliance data securely and do not share company information with third parties.</p>
    `,
    terms: `
        <p>By using CompliAI, you agree to automated compliance analysis, AI-generated insights, and responsibility for policy actions.</p>
    `,
    contact: `
        <p>Email: support@compliai.ai</p>
        <p>Phone: +49 123 456 ***</p>
    `
};

function initFooterTabs() {
    const tabs = document.querySelectorAll(".footer-tabs li");
    const panels = document.querySelectorAll(".panel-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {

            const target = tab.getAttribute("data-tab");

            // Remove active from all tabs & panels
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            // Activate clicked tab
            tab.classList.add("active");

            // Show correct panel in main canvas
            const activePanel = document.querySelector(`.panel-content[data-panel="${target}"]`);
            if (activePanel) {
                activePanel.classList.add("active");

                // Insert the correct content
                const contentContainer = document.getElementById(`${target}Content`);
                if (contentContainer) {
                    contentContainer.innerHTML = footerPanelContent[target];
                }
            }
        });
    });
}

/******************************************************
 * BACKEND API - LOAD COMPLIANCE STATUS
 ******************************************************/
async function loadComplianceStatus() {
    try {
        const response = await fetch("/api/compliance/status");
        const data = await response.json();

        // Update Compliance Gauge Text (center panel)
        const scoreEl = document.getElementById("complianceScore");
        const summaryEl = document.getElementById("complianceSummary");
        const lastScanEl = document.getElementById("lastScan");

        if (scoreEl) scoreEl.innerText = data.overallComplianceScore + "%";
        if (summaryEl)
            summaryEl.innerText = `Risk Level: ${data.riskLevel} | Issues Found: ${data.issuesFound}`;
        if (lastScanEl)
            lastScanEl.innerText = "Last scan: " + new Date(data.lastScan).toLocaleString();

        console.log("Compliance status loaded:", data);
    }
    catch (err) {
        console.error("Failed to load compliance status", err);
    }
}

/******************************************************
 * 4️⃣ RUN COMPLIANCE CHECK BUTTON
 ******************************************************/
async function runComplianceCheck() {
    try {
        await fetch("/api/compliance/run", { method: "POST" });
        await loadComplianceStatus();
        initRiskGauges(true); // re-animate gauges
    }
    catch (err) {
        console.error("Compliance scan failed", err);
    }
}

/******************************************************
 * 5️⃣ NITROSENSE-STYLE ANIMATED CIRCULAR RISK GAUGES  ----- This is for our Risk Indicator Circular ring
 ******************************************************/
function initRiskGauges(reAnimate = false) {
    const gauges = document.querySelectorAll(".risk-gauge");

    gauges.forEach(canvas => {
        if (!canvas.width) canvas.width = 120;
        if (!canvas.height) canvas.height = 120;

        drawAnimatedGauge(canvas, reAnimate);
    });
}

function drawAnimatedGauge(canvas) {
    const ctx = canvas.getContext("2d");
    const value = Number(canvas.dataset.value);

    const size = 200;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const center = size / 2;
    const radius = center - 12;
    const innerRadius = radius - 15;  // Inner rotating ring radius
    const outerRadius = radius + 10;  // Outer ring radius

    let current = 0;
    let innerAngle = 0;              // Tracks inner ring rotation
    let outerAngle = 0;              // Outer ring rotation
    const rotationSpeed = 0.05;      // radians per frame

    function getColor(v) {
        if (v < 40) return "#22C55E";
        if (v < 70) return "#F59E0B";
        return "#EF4444";
    }

    function animate() {
        ctx.clearRect(0, 0, size, size);

        // --- Inner rotating ring ---
        ctx.beginPath();
        ctx.arc(center, center, innerRadius, innerAngle, innerAngle + Math.PI / 2);
        ctx.strokeStyle = "rgba(56,189,248,0.6)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.stroke();
        innerAngle += rotationSpeed;  // this will rotate clockwise

        // Outer rotating ring (new)
        ctx.beginPath();
        ctx.arc(center, center, outerRadius, outerAngle, outerAngle + Math.PI / 2);
        ctx.strokeStyle = "rgba(99,102,241,0.5)";
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.stroke();
        outerAngle -= rotationSpeed;  // this will rotate anticlockwise

        // --- Outer / Foreground ring ---
        const angle = (current / 100) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(center, center, radius, -Math.PI / 2, angle);
        ctx.strokeStyle = getColor(current);
        ctx.lineWidth = 12;
        ctx.lineCap = "round";
        ctx.shadowBlur = 20;
        ctx.shadowColor = getColor(current);
        ctx.stroke();

        // --- Percentage Text ---
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 25px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(current + "%", center, center);

        // --- Increment gauge value ---
        if (current < value) current++; // increment only until target
        requestAnimationFrame(animate); // always keep animating for moving rings
    }

    animate(); 
}
/******************************************************
* COMPLIANCE SHIELD GAUGE (CENTER PANEL)   -----------This is for our Compliance Shield Guage-------
******************************************************/
function drawComplianceShield(canvas, value) {
    const ctx = canvas.getContext("2d");
    const size = canvas.width; // canvas width
    let progress = 0;

    function getColor(v) {
        if (v < 40) return "#EF4444"; // Red
        if (v < 70) return "#F59E0B"; // Orange
        return "#22C55E";             // Green
    }

    function drawShield(fillPercent) {
        ctx.clearRect(0, 0, size, size);

        const w = size;
        const h = size;

        // Shield outline
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.1);
        ctx.quadraticCurveTo(w * 0.85, h * 0.2, w * 0.85, h * 0.5);
        ctx.quadraticCurveTo(w * 0.85, h * 0.85, w * 0.5, h * 0.95);
        ctx.quadraticCurveTo(w * 0.15, h * 0.85, w * 0.15, h * 0.5);
        ctx.quadraticCurveTo(w * 0.15, h * 0.2, w * 0.5, h * 0.1);
        ctx.closePath();
        ctx.strokeStyle = "rgba(99,102,241,0.6)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Fill level
        ctx.save();
        ctx.clip();
        ctx.fillStyle = getColor(fillPercent);
        ctx.globalAlpha = 0.35;
        const fillHeight = (fillPercent / 100) * h;
        ctx.fillRect(0, h - fillHeight, w, fillHeight);
        ctx.restore();

        // Percentage text
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(fillPercent + "%", w / 2, h / 2 + 10);
    }

    function animate() {
        if (progress < value) progress++;
        drawShield(progress);
        requestAnimationFrame(animate);
    }

    animate();
}

// Call function after page loads
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("complianceGauge");
    drawComplianceShield(canvas, 63); // 63% compliance
});

/***********************************************
 * Center content button - View Issues Function
/**********************************************/
function viewIssues() {
    const container = document.getElementById("aiDynamicContent");
    container.innerHTML = `
        <div class="card">
            <p>⚠️ Missing consent clause</p>
            <p>HR Policy needs review</p>
        </div>
        <div class="card">
            <p>⚠️ Outdated Handbook</p>
            <p>Action : Update Immediately</p>
        </div>
        <div class="card">
            <p>⚠️ No Data Retention Policies involved</p>
            <p>Action : Create retention policies ASAP</p>
        </div>
        <div class="card">
            <p>⚠️ Incomplete Security Training Records</p> 
            <p>Action : Conduct training audits</p>
        </div>
  
    `;
}

/*******************************************************
 * Center content button - Generate Reports function
 ********************************************************/
function generateReport() {
    const container = document.getElementById("aiDynamicContent");
    container.innerHTML = `
        <div class="card">
            <p>📄 GDPR Compliance Report - Jan 2025</p>
            <p>Date Generated: ${new Date().toLocaleString()}</p>
        </div>
        <div class="card">
            <p>📄 HR Compliance Report - May 2024</p>
            <p>Date Generated: ${new Date().toLocaleString()}</p>
        </div>
        <div class="card">
            <p>📄 Data Retention Audit Report - Feb 2025</p>
            <p>Date Generated: ${new Date().toLocaleString()}</p>
        </div>
        <div class="card">
            <p>📄 Security Policy Assessment - Mar 2025</p>
            <p>Date Generated: ${new Date().toLocaleString()}</p>
        </div>

    `;
}

/******************************************
 * AI RECOMMENDATION BUTTON FUNCTIONS
 *******************************************/
function applyRecommendation(button) {
    const card = button.closest(".rec-card");
    const text = card.querySelector("p").innerText;

    card.style.borderColor = "#22C55E";
    card.style.boxShadow = "0 0 15px rgba(34,197,94,0.6)";

    button.innerText = "Applied";
    button.disabled = true;

    console.log("Recommendation applied:", text);
}
/*************************************************
 * MARK AS REVIEWED BUTTON FUNCTIONS
 * ***********************************************/
function markAsReviewed(button) {
    const card = button.closest(".rec-card");

    card.style.opacity = "0.6";
    card.style.filter = "none";
    card.style.borderColor = "#FF8C00";
    card.style.boxShadow = "0 0 15px rgba(255, 140, 0, 0.6)";

    button.innerText = "Reviewed";
    button.disabled = true;

    console.log("Recommendation marked as reviewed");
}