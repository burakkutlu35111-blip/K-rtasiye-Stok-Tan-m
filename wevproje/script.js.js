// Başlangıç Kırtasiye Verileri (18 Çeşit Profesyonel Envanter Ürünü)
const defaultProducts = [
    { sku: "KRT-DEF-01", name: "Kareli Defter A4", category: "Defter", features: "Meteksan / 80 Yaprak", unit: "Adet", critical: 15, stock: 45 },
    { sku: "KRT-KALE-02", name: "Dereceli Kurşun Kalem", category: "Kalem", features: "Adel / 2B Çizim", unit: "Adet", critical: 20, stock: 8 },
    { sku: "KRT-BOYA-03", name: "Kuru Boya Seti", category: "Boyama", features: "Bic / 12'li Kutu", unit: "Set", critical: 10, stock: 14 },
    { sku: "KRT-KAG-04", name: "Fotokopi Kağıdı A4", category: "Kağıt Grubu", features: "Copier Bond / 80 gr", unit: "Paket", critical: 5, stock: 12 },
    { sku: "KRT-KALE-05", name: "Fosforlu Kalem Seti", category: "Kalem", features: "Stabilo Boss / 4'lü Karışık", unit: "Set", critical: 8, stock: 24 },
    { sku: "KRT-KALE-06", name: "0.7 Versatil Kalem", category: "Kalem", features: "Rotring Tikky / Siyah", unit: "Adet", critical: 15, stock: 6 },
    { sku: "KRT-KALE-07", name: "Roller İmza Kalemi", category: "Kalem", features: "Uni-ball Eye / Siyah 0.7", unit: "Adet", critical: 12, stock: 40 },
    { sku: "KRT-KALE-08", name: "Beyaz Tahta Kalemi", category: "Kalem", features: "Eddington / 3'lü Paket", unit: "Paket", critical: 10, stock: 9 },
    { sku: "KRT-DEF-09", name: "Çizgili Not Defteri A5", category: "Defter", features: "Moleskine / Sert Kapak", unit: "Adet", critical: 5, stock: 18 },
    { sku: "KRT-DEF-10", name: "Resim Defteri 35x50", category: "Defter", features: "Alex Schoeller / 200gr", unit: "Adet", critical: 20, stock: 35 },
    { sku: "KRT-BOYA-11", name: "Tüp Sulu Boya Seti", category: "Boyama", features: "Talens Van Gogh / 12 Renk", unit: "Set", critical: 4, stock: 3 },
    { sku: "KRT-BOYA-12", name: "Akrilik Boya 75ml", category: "Boyama", features: "Louvre / Titanyum Beyazı", unit: "Adet", critical: 15, stock: 22 },
    { sku: "KRT-KAG-13", name: "Renkli Fon Kartonu", category: "Kağıt Grubu", features: "Pritt / 10 Renk Karışık", unit: "Paket", critical: 10, stock: 50 },
    { sku: "KRT-KAG-14", name: "Yapışkanlı Not Kağıdı", category: "Kağıt Grubu", features: "Post-it / 76x76mm Sarı", unit: "Adet", critical: 25, stock: 14 },
    { sku: "KRT-MAS-15", name: "Metal Evrak Rafı", category: "Masaüstü", features: "Mas / 3 Katlı Siyah", unit: "Adet", critical: 3, stock: 7 },
    { sku: "KRT-MAS-16", name: "Ofis Zımba Makinesi", category: "Masaüstü", features: "Leitz / No:10 Güçlendirilmiş", unit: "Adet", critical: 5, stock: 2 },
    { sku: "KRT-MAS-17", name: "Paslanmaz Makas 18cm", category: "Masaüstü", features: "Maped / Ergonomik Sap", unit: "Adet", critical: 8, stock: 19 },
    { sku: "KRT-MAS-18", name: "Sıvı Yapıştırıcı 40gr", category: "Masaüstü", features: "UHU / Solvent İçermez", unit: "Adet", critical: 20, stock: 65 }
];

// Otomatik Ürün Önizleme Görselleri (Kategori Eşleştirmeli)
const productVisuals = {
    "Kalem": "✏️",
    "Defter": "📔",
    "Boyama": "🎨",
    "Kağıt Grubu": "📄",
    "Masaüstü": "✂️"
};

const categoryColors = {
    "Kalem": "badge-amber",
    "Defter": "badge-purple",
    "Boyama": "badge-pink",
    "Kağıt Grubu": "badge-blue",
    "Masaüstü": "badge-purple"
};

// Tarayıcı hafızasını oku (Eğer eski 4 ürünlük liste varsa otomatik temizle ve yenilerini yükle)
let storedData = JSON.parse(localStorage.getItem("kirtasiye_stok"));
let products = (storedData && storedData.length > 4) ? storedData : defaultProducts;

let currentFilter = "all";
let searchQuery = "";

// DOM Arayüz Elemanları
const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("product-modal");
const productForm = document.getElementById("product-form");
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancelModal = document.getElementById("btn-cancel-modal");
const menuAll = document.getElementById("menu-all");
const menuCritical = document.getElementById("menu-critical");
const sideCriticalBadge = document.getElementById("side-critical-badge");

function init() {
    renderTable();
    updateStats();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem("kirtasiye_stok", JSON.stringify(products));
}

function updateStats() {
    const totalTypes = products.length;
    const criticalCount = products.filter(p => Number(p.stock) <= Number(p.critical)).length;
    const totalQuantity = products.reduce((sum, p) => sum + Number(p.stock), 0);

    document.getElementById("stat-total-types").innerText = totalTypes.toLocaleString();
    document.getElementById("stat-critical-count").innerText = criticalCount.toLocaleString();
    document.getElementById("stat-total-quantity").innerText = totalQuantity.toLocaleString();
    
    sideCriticalBadge.innerText = criticalCount;
    sideCriticalBadge.style.display = criticalCount > 0 ? "inline-block" : "none";
}

function renderTable() {
    tableBody.innerHTML = "";
    
    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (currentFilter === "critical") {
            return matchesSearch && (Number(product.stock) <= Number(product.critical));
        }
        return matchesSearch;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#94a3b8; padding:40px; font-size:14px;">Eşleşen kırtasiye kaydı bulunamadı.</td></tr>`;
        document.getElementById("table-info-text").innerText = "Görüntülenecek ürün yok";
        return;
    }

    filtered.forEach(product => {
        const isCritical = Number(product.stock) <= Number(product.critical);
        const tr = document.createElement("tr");
        if (isCritical) tr.classList.add("row-warning");

        const colorClass = categoryColors[product.category] || "badge-blue";
        const visualIcon = productVisuals[product.category] || "📦";

        tr.innerHTML = `
            <td>
                <div class="table-img-placeholder">${visualIcon}</div>
            </td>
            <td class="font-mono text-muted text-xs">${product.sku}</td>
            <td class="font-bold text-dark">${product.name}</td>
            <td><span class="badge ${colorClass}">${product.category}</span></td>
            <td class="text-muted font-medium">${product.features}</td>
            <td class="text-muted">${product.unit}</td>
            <td class="font-medium text-light-muted">${product.critical}</td>
            <td>
                ${isCritical ? `
                    <span class="inline-flex items-center gap-1 font-bold text-accent-red">
                        <span>${product.stock}</span>
                        <span class="badge-mini-red">Eşik Altı!</span>
                    </span>
                ` : `<span class="font-bold text-dark">${product.stock}</span>`}
            </td>
            <td class="text-right">
                <button class="btn-table-edit" onclick="editStock('${product.sku}')">Stok Düzelt</button>
                <button class="btn-table-delete" onclick="deleteProduct('${product.sku}')">Sil</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    document.getElementById("table-info-text").innerText = `Şu anda ${filtered.length} farklı kırtasiye kalemi listeleniyor.`;
}

// Form Kayıt
productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newProduct = {
        sku: document.getElementById("form-sku").value.trim().toUpperCase(),
        name: document.getElementById("form-name").value.trim(),
        category: document.getElementById("form-category").value,
        features: document.getElementById("form-features").value.trim(),
        unit: document.getElementById("form-unit").value,
        critical: Number(document.getElementById("form-critical").value),
        stock: Number(document.getElementById("form-stock").value)
    };

    if (products.some(p => p.sku === newProduct.sku)) {
        alert("Sistemde bu SKU koduyla kayıtlı başka bir kırtasiye kartı zaten var!");
        return;
    }

    products.push(newProduct);
    productForm.reset();
    closeModalWindow();
    init();
});

function deleteProduct(sku) {
    if (confirm(`${sku} SKU kodlu envanter kaydını kalıcı olarak silmek istiyor musunuz?`)) {
        products = products.filter(p => p.sku !== sku);
        init();
    }
}

function editStock(sku) {
    const product = products.find(p => p.sku === sku);
    if (product) {
        const newStock = prompt(`[${product.name}] için yeni güncel stok miktarını giriniz:`, product.stock);
        if (newStock !== null && newStock.trim() !== "" && !isNaN(newStock)) {
            product.stock = Number(newStock);
            init();
        }
    }
}

// Arama Filtresi
searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderTable();
});

// Menü Geçişleri
menuAll.addEventListener("click", (e) => {
    e.preventDefault();
    currentFilter = "all";
    menuAll.classList.add("active");
    menuCritical.classList.remove("active");
    renderTable();
});

menuCritical.addEventListener("click", (e) => {
    e.preventDefault();
    currentFilter = "critical";
    menuCritical.classList.add("active");
    menuAll.classList.remove("active");
    renderTable();
});

function openModalWindow() { modal.classList.add("active"); }
function closeModalWindow() { modal.classList.remove("active"); productForm.reset(); }

btnOpenModal.addEventListener("click", openModalWindow);
btnCloseModal.addEventListener("click", closeModalWindow);
btnCancelModal.addEventListener("click", closeModalWindow);

