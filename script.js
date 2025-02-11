let products = [];

function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);

    if (!name || !price || !quantity) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }

    const product = {
        id: Date.now(),
        name,
        price,
        quantity,
        total: price * quantity
    };

    products.push(product);
    updateProductsList();
    clearForm();
}

function deleteProduct(id) {
  // البحث عن المنتج للحصول على اسمه
  const product = products.find(product => product.id === id);
  
  // رسالة تأكيد الحذف
  const isConfirmed = confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`);
  
  // إذا وافق المستخدم على الحذف
  if (isConfirmed) {
      products = products.filter(product => product.id !== id);
      updateProductsList();
      saveData();
      
      // رسالة نجاح الحذف
      alert('تم حذف المنتج بنجاح');
  }
}


function updateProductsList() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price} جنية</td>
            <td>${product.quantity}</td>
            <td>${product.total} جنية</td>
            <td>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">حذف</button>
            </td>
        `;
        productsList.appendChild(row);
    });
}

function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productQuantity').value = '';
}

// حفظ البيانات في localStorage
function saveData() {
    localStorage.setItem('salesSystem', JSON.stringify(products));
}

// استرجاع البيانات من localStorage
function loadData() {
    const savedData = localStorage.getItem('salesSystem');
    if (savedData) {
        products = JSON.parse(savedData);
        updateProductsList();
    }
}

// حفظ البيانات عند إغلاق الصفحة
window.addEventListener('beforeunload', saveData);

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadData); 



function updateProductsList() {
  const productsList = document.getElementById('productsList');
  productsList.innerHTML = '';

  products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.price} جنية</td>
          <td>${product.quantity}</td>
          <td>${product.total} جنية</td>
          <td>
              <button class="edit-btn" onclick="openEditModal(${product.id})">تعديل</button>
              <button class="delete-btn" onclick="deleteProduct(${product.id})">حذف</button>
          </td>
      `;
      productsList.appendChild(row);
  });
}

// دالة فتح نافذة التعديل
function openEditModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById('editProductId').value = product.id;
  document.getElementById('editProductName').value = product.name;
  document.getElementById('editProductPrice').value = product.price;
  document.getElementById('editProductQuantity').value = product.quantity;
  
  document.getElementById('editModal').style.display = 'block';
}

// دالة إغلاق نافذة التعديل
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

// دالة تحديث المنتج
// ... existing code ...

function updateProduct() {
  const id = parseInt(document.getElementById('editProductId').value);
  const name = document.getElementById('editProductName').value;
  const price = parseFloat(document.getElementById('editProductPrice').value);
  const quantity = parseInt(document.getElementById('editProductQuantity').value);

  if (!name || !price || !quantity) {
      alert('الرجاء ملء جميع الحقول');
      return;
  }

  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) return;

  products[productIndex] = {
      id,
      name,
      price,
      quantity,
      total: price * quantity
  };

  updateProductsList();
  saveData();
  
  // إغلاق النافذة المنبثقة
  document.getElementById('editModal').style.display = 'none';
  
  // إضافة رسالة تأكيد (اختياري)
  alert('تم تحديث المنتج بنجاح');
}



// إضافة وظائف تبديل الثيم
function initTheme() {
  // التحقق من وجود ثيم محفوظ
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// إضافة مستمع الحدث لزر تبديل الثيم
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// تهيئة الثيم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  loadData(); // استدعاء الدالة الموجودة مسبقاً
});