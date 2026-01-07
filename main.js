// FIELD CONFIG
const FIELDS = [
    { id: "companies", tr: "Toplam şirket sayısı (1–12, 0 = sınırsız)", en: "Total companies (1–12, 0 = unlimited)", default: 6, img: "images/companies.png" },
    { id: "engine", tr: "Automated Engine Seviyesi (1–7)", en: "Automated Engine Level (1–7)", default: 3, img: "images/automated_engine.png" },
    { id: "bonus", tr: "Şirket üretim bonusu (%)", en: "Company production bonus (%)", default: 31, img: "images/comp_bonus.png" },
    { id: "price", tr: "Ürün market satış fiyatı (PP başına)", en: "Market selling price (per PP)", default: 0.05, img: "images/market.png" },
    { id: "salary", tr: "Maaş (PP başına)", en: "Salary (per PP)", default: 0.07, img: "images/PP_maas.png" },
    { id: "tax", tr: "Vergi oranı (%)", en: "Tax rate (%)", default: 8, img: "images/tax.png" },
    { id: "skill", tr: "Toplam Skill Puanı", en: "Total Skill Points", default: 56, img: "images/skill_point.png" }
];

const inputsDiv = document.getElementById("inputs");

// GENERATE INPUT UI
FIELDS.forEach(f => {
    const row = document.createElement("div");
    row.classList.add("input-row");
    row.innerHTML = `
        <img src="${f.img}" class="icon">
        <div class="input-col">
            <label>${f.tr}<br><small>${f.en}</small></label>
            <input id="${f.id}" type="text" value="${f.default}">
        </div>
    `;
    inputsDiv.appendChild(row);
});

// ENGINE VALUES (PP per cycle)
const engineValues = { 1:24, 2:48, 3:72, 4:96, 5:120, 6:144, 7:168 };

// SKILL COST
function skillCost(l) {
    return (l * (l + 1)) / 2;
}

// CALCULATE LOGIC
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
    if (current_companies === 0) lc_levels = levels;
    else {
        const maxLc = Math.max(current_companies - base_companies, 0);
        lc_levels = [...Array(maxLc + 1).keys()];
    }

    let bestZ = -1;
    let best = { Lg:0, Lw:0, Lp:0, Lc:0, companies:0 };

    levels.forEach(Lg => {
        levels.forEach(Lw => {
            levels.forEach(Lp => {
                lc_levels.forEach(Lc => {
                    const totalSkill = skillCost(Lg)+skillCost(Lw)+skillCost(Lp)+skillCost(Lc);
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

    document.getElementById("results").innerHTML = `
        <h2>🔝 En İyi Skill Dağılımı</h2>
        <p><b>Entrepreneurship:</b> ${best.Lg}</p>
        <p><b>Energy:</b> ${best.Lw}</p>
        <p><b>Production:</b> ${best.Lp}</p>
        <p><b>Company Limit:</b> ${best.Lc}</p>
        <p><b>Toplam Şirket:</b> ${best.companies}</p>
        <p><b>Günlük Maksimum BTC:</b> ${bestZ.toFixed(2)}</p>
    `;
});
