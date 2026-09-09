let products = [];
let editingId = null;

const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const sku = document.getElementById("sku");
const store = document.getElementById("store");
const category = document.getElementById("category");
const stock = document.getElementById("stock");
const minimumStock = document.getElementById("minimumStock");

const inventoryTable = document.getElementById("inventoryTable");
const searchInput = document.getElementById("searchInput");

const totalProducts = document.getElementById("totalProducts");
const availableProducts = document.getElementById("availableProducts");
const lowStockProducts = document.getElementById("lowStockProducts");
const outOfStockProducts = document.getElementById("outOfStockProducts");


// =============================
// INITIALIZATION
// =============================

document.addEventListener("DOMContentLoaded", () => {
    loadInitialData();
    renderProducts();
    updateDashboard();
});


// =============================
// INITIAL DATA
// =============================

function loadInitialData() {

    products = [
        {
            id: 1,
            productName: "Leche Entera 1L",
            sku: "LEC-001",
            store: "Cali Norte",
            category: "Lácteos",
            stock: 8,
            minimumStock: 15
        },
        {
            id: 2,
            productName: "Yogurt Natural 500g",
            sku: "YOG-001",
            store: "Cali Sur",
            category: "Lácteos",
            stock: 25,
            minimumStock: 10
        },
        {
            id: 3,
            productName: "Pollo Entero",
            sku: "POL-001",
            store: "Cali Norte",
            category: "Carnes",
            stock: 0,
            minimumStock: 8
        }
    ];
}


// =============================
// CREATE PRODUCT
// =============================

function createProduct() {

    const product = {
        id: Date.now(),
        productName: productName.value.trim(),
        sku: sku.value.trim(),
        store: store.value.trim(),
        category: category.value.trim(),
        stock: Number(stock.value),
        minimumStock: Number(minimumStock.value)
    };

    if (!validateProduct(product)) {
        return;
    }

    products.push(product);

    clearForm();
    renderProducts();
    updateDashboard();

    alert("Producto creado correctamente.");
}


// =============================
// UPDATE PRODUCT
// =============================

function updateProduct() {

    const product = {
        id: editingId,
        productName: productName.value.trim(),
        sku: sku.value.trim(),
        store: store.value.trim(),
        category: category.value.trim(),
        stock: Number(stock.value),
        minimumStock: Number(minimumStock.value)
    };

    if (!validateProduct(product)) {
        return;
    }

    const index = products.findIndex(product => product.id === editingId);

    if (index === -1) {
        alert("No se encontró el producto.");
        return;
    }

    products[index] = product;

    editingId = null;

    clearForm();
    renderProducts();
    updateDashboard();

    alert("Producto actualizado correctamente.");
}


// =============================
// DELETE PRODUCT
// =============================

function deleteProduct(id) {

    const product = products.find(product => product.id === id);

    if (!product) {
        alert("Producto no encontrado.");
        return;
    }

    const confirmation = confirm(
        `¿Deseas eliminar "${product.productName}"?`
    );

    if (!confirmation) {
        return;
    }

    products = products.filter(product => product.id !== id);

    renderProducts();
    updateDashboard();

    alert("Producto eliminado correctamente.");
}


// =============================
// EDIT PRODUCT
// =============================

function editProduct(id) {

    const product = products.find(product => product.id === id);

    if (!product) {
        alert("Producto no encontrado.");
        return;
    }

    editingId = id;

    productName.value = product.productName;
    sku.value = product.sku;
    store.value = product.store;
    category.value = product.category;
    stock.value = product.stock;
    minimumStock.value = product.minimumStock;

    document.getElementById("submitButton").textContent = "Actualizar producto";
}


// =============================
// VALIDATION
// =============================

function validateProduct(product) {

    if (product.productName === "") {
        alert("El nombre del producto es obligatorio.");
        return false;
    }

    if (product.sku === "") {
        alert("El SKU es obligatorio.");
        return false;
    }

    if (product.store === "") {
        alert("La tienda es obligatoria.");
        return false;
    }

    if (product.category === "") {
        alert("La categoría es obligatoria.");
        return false;
    }

    if (product.stock < 0) {
        alert("El inventario no puede ser negativo.");
        return false;
    }

    if (product.minimumStock < 0) {
        alert("El inventario mínimo no puede ser negativo.");
        return false;
    }

    const duplicatedSKU = products.some(existingProduct =>
        existingProduct.sku.toLowerCase() === product.sku.toLowerCase() &&
        existingProduct.id !== product.id
    );

    if (duplicatedSKU) {
        alert("Ya existe un producto con ese SKU.");
        return false;
    }

    return true;
}


// =============================
// PRODUCT STATUS
// =============================

function getProductStatus(product) {

    if (product.stock === 0) {
        return "Agotado";
    }

    if (product.stock <= product.minimumStock) {
        return "Inventario bajo";
    }

    return "Disponible";
}


// =============================
// RENDER PRODUCTS
// =============================

function renderProducts() {

    inventoryTable.innerHTML = "";

    const searchValue = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue) ||
        product.store.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue)
    );

    filteredProducts.forEach(product => {

        const row = document.createElement("tr");

        const status = getProductStatus(product);

        row.innerHTML = `
            <td>${product.productName}</td>
            <td>${product.sku}</td>
            <td>${product.store}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>${product.minimumStock}</td>
            <td>${status}</td>
            <td>
                <button onclick="editProduct(${product.id})">
                    Editar
                </button>

                <button onclick="deleteProduct(${product.id})">
                    Eliminar
                </button>
            </td>
        `;

        inventoryTable.appendChild(row);
    });
}


// =============================
// DASHBOARD
// =============================

function updateDashboard() {

    const total = products.length;

    const available = products.filter(product =>
        getProductStatus(product) === "Disponible"
    ).length;

    const lowStock = products.filter(product =>
        getProductStatus(product) === "Inventario bajo"
    ).length;

    const outOfStock = products.filter(product =>
        getProductStatus(product) === "Agotado"
    ).length;

    totalProducts.textContent = total;
    availableProducts.textContent = available;
    lowStockProducts.textContent = lowStock;
    outOfStockProducts.textContent = outOfStock;
}


// =============================
// FORM
// =============================

productForm.addEventListener("submit", event => {

    event.preventDefault();

    if (editingId === null) {
        createProduct();
    } else {
        updateProduct();
    }
});


function clearForm() {

    productForm.reset();

    editingId = null;

    document.getElementById("submitButton").textContent =
        "Agregar producto";
}


// =============================
// SEARCH
// =============================

searchInput.addEventListener("input", () => {
    renderProducts();
});