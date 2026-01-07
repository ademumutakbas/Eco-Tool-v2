// Auto-generate input fields
const inputsDiv = document.getElementById("inputs");

const FIELDS = [
    { id: "companies", label: "Toplam şirket sayısı (1–12, 0 = sınırsız)", default: 6, img: "images/companies.png" },
    { id: "engine", label: "Automated Engine Seviyesi (1–7)", default: 3, img: "images/engine.png" },
    { id: "bonus", label: "Şirket üretim bonusu (%)", default: 31, img: "images/bonus.png" },
    { id: "price", label: "Ürün market satış fiyatı (PP başına)", default: 0.05, img: "images/price.png" },
    { id: "salary", label: "Maaş (PP başına)", default: 0.07, img: "images/salary.png" },
    { id: "tax", label: "Vergi oranı (%)", default: 8, img: "images/tax.png" },
    { id: "skill", label: "Toplam Skill Puanı", default: 56, img: "images/skill.png" }
];

// Generate HTML inputs
FIELDS.forEach(f => {
    const wrapper = document.createElement("div");
    wrapper.className = "input-row";
    wrapper.innerHTML = `
        <img src="${f.img}" class="icon">
        <div class="input-col">
            <label>${f.label}</label>
            <input id="${f.id}" type="text" value="${f.default}">
        </div>
    `;
    inputsDiv.appendChild(wrapper);
});

// Python → JS engine data
const engineValues = { 1:24, 2:48, 3:72, 4:96, 5:120, 6:144, 7:168 };

// Skill cost function
function skillCost(l) { return (l * (l + 1)) / 2; }

// Calculate button handler
document.getElementById("calculate").addEventListener("click", () => {
    const current_companies = parseInt(document.getElementById("companies").value);
    const engine_level = parseInt(document.getElementById("engine").value);
    const company_bonus = parseFloat(document.getElementById("bonus").value);
    const price_pp = parseFloat(document.getElementById("price").value);
    const z = parseFloat(document.getElementById("salary").value);
    const tax_rate = parseFloat(document.getElementById("tax").value);
    const S = parseInt(document.getElementById("skill").value);

    const Q = price_pp * (1 + company_bonus / 100);
    const K = Q * engineValues[engine_level];
    const levels = [...Array(11).keys()];
    const base_companies = 2;

    let lc_levels = [];
    if (current_companies === 0) {
        lc_levels = levels;
    } else {
        const maxLc = Math.max(current_companies - base_companies, 0);
        lc_levels = [...Array(maxLc + 1).keys()];
    }

    let bestZ = -1;
    let best = { Lg:0, Lw:0, Lp:0, Lc:0, companies:0 };

    levels.forEach(Lg => {
        levels.forEach(Lw => {
            levels.forEach(Lp => {
                lc_levels.forEach(Lc => {

                    const totalSkill =
                        skillCost(Lg) +
                        skillCost(Lw) +
                        skillCost(Lp) +
                        skillCost(Lc);

                    if (totalSkill > S) return;

                    const Xp = 10 + 3 * Lp;
                    const Xg = (30 + 5 * Lg) * Xp / 10;
                    const Xw = (30 + 10 * Lw) * Xp / 10;
                    const Xc = base_companies + Lc;

                    const Z =
                        2.4 * Q * Xg +
                        2.4 * z * (1 - tax_rate / 100) * Xw +
                        K * Xc;

                    if (Z > bestZ) {
                        bestZ = Z;
                        best = { Lg, Lw, Lp, Lc, companies: Xc };
                    }
                });
            });
        });
    });

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <h2>🔝 En İyi Skill Dağılımı</h2>
        <p><b>Entrepreneurship:</b> ${best.Lg}</p>
        <p><b>Energy:</b> ${best.Lw}</p>
        <p><b>Production:</b> ${best.Lp}</p>
        <p><b>Company Limit:</b> ${best.Lc}</p>
        <p><b>Toplam Şirket:</b> ${best.companies}</p>
        <p><b>Günlük Maksimum BTC:</b> ${bestZ.toFixed(2)}</p>
    `;
});
