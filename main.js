let lang = "tr";

const fields = [
    {
        key: "companies",
        img: "images/companies.png",
        tr: {
            label: "Toplam şirket sayısı (1–12, 0 = sınırsız)",
            desc: "0 girildiğinde fabrika sayısındaki sınır kalkar."
        },
        en: {
            label: "Total company count (1–12, 0 = unlimited)",
            desc: "If 0 is entered, the factory limit becomes unlimited."
        }
    },
    {
        key: "engine",
        img: "images/automated_engine.png",
        tr: {
            label: "Automated Engine Seviyesi (1–7)",
            desc: "Bütün fabrikalarınızın eşit seviyede olduğu varsayılır."
        },
        en: {
            label: "Automated Engine Level (1–7)",
            desc: "Assumes all factories have the same level."
        }
    },
    {
        key: "bonus",
        img: "images/comp_bonus.png",
        tr: {
            label: "Sahip olduğunuz şirketlerin üretim bonusu (%)",
            desc: "Tüm fabrikaların aynı ürünü ürettiği varsayılır."
        },
        en: {
            label: "Production bonus of owned companies (%)",
            desc: "Assumes all factories produce the same product."
        }
    },
    {
        key: "market",
        img: "images/market.png",
        tr: {
            label: "Ürün market satış fiyatı (PP başına)",
            desc: "Tek ürün üzerinden hesaplanır."
        },
        en: {
            label: "Market sale price (per PP)",
            desc: "Calculated over a single product."
        }
    },
    {
        key: "skill",
        img: "images/skill_point.png",
        tr: {
            label: "Toplam Skill Puanı",
            desc: "Seviye × 4"
        },
        en: {
            label: "Total Skill Points",
            desc: "Level × 4"
        }
    }
];

function renderInputs() {
    const inputs = document.getElementById("inputs");
    inputs.innerHTML = "";

    fields.forEach(f => {
        const langData = f[lang];
        inputs.innerHTML += `
        <div class="input-item">
            <img src="${f.img}" alt="">
            <div class="input-text">
                <h3>${langData.label}</h3>
                <p>${langData.desc}</p>
                <input id="${f.key}" type="number">
            </div>
        </div>`;
    });
}

document.getElementById("switchLang").addEventListener("click", () => {
    lang = (lang === "tr") ? "en" : "tr";
    document.getElementById("switchLang").innerText = (lang === "tr") ? "EN" : "TR";
    renderInputs();
});

renderInputs();

document.getElementById("calculate").addEventListener("click", () => {
    document.getElementById("results").innerHTML = "<p>Hesaplama fonksiyonu burada olacak...</p>";
});
