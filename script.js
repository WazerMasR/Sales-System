let products = [];

function addProduct() {
  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const quantity = parseInt(document.getElementById('productQuantity').value);

  if (!name || price <= 0 || quantity <= 0) {
      alert('الرجاء إدخال قيم صحيحة (أكبر من الصفر)');
      return;
  }

  // البحث عن منتج بنفس الاسم
  const existingProduct = products.find(product => product.name === name);

  if (existingProduct) {
      // إذا كان المنتج موجودًا، نقوم بزيادة الكمية فقط
      existingProduct.quantity += quantity;
      existingProduct.total = existingProduct.price * existingProduct.quantity; // تحديث الإجمالي
  } else {
      // إذا لم يكن المنتج موجودًا، نضيفه كمنتج جديد
      const product = {
          id: Date.now(),
          name,
          price,
          quantity,
          sold: 0, // كمية المبيعات تبدأ من 0
          total: price * quantity
      };

      products.push(product);
  }

  updateProductsList();
  clearForm();
  saveData();
}



// search input
function searchProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
  
  const productsList = document.getElementById('productsList');
  productsList.innerHTML = '';

  filteredProducts.forEach(product => {
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


function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerText = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
      toast.remove();
  }, 3000);
}


// داله البيع
function sellProduct(id) {
  const quantitySold = parseInt(prompt("أدخل الكمية التي تريد بيعها:"));
  if (isNaN(quantitySold) || quantitySold <= 0) {
      alert("الرجاء إدخال كمية صحيحة.");
      return;
  }

  const product = products.find(p => p.id === id);
  if (!product) return;

  if (quantitySold > product.quantity) {
      alert("لا توجد كمية كافية للبيع.");
      return;
  }

  product.quantity -= quantitySold;
  product.sold = (product.sold || 0) + quantitySold;
  product.total = product.price * product.quantity; // تحديث الإجمالي للمنتج المتبقي

  updateProductsList();
  saveData();

  showToast(`تم بيع ${quantitySold} من ${product.name} بنجاح! ✅`);

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
      showToast('تم حذف المنتج بنجاح');
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
          <td>${product.quantity + (product.sold || 0)}</td>
          <td>${product.quantity}</td>
          <td>${product.total} جنية</td>
          <td>
              
              <button class="edit-btn" onclick="openEditModal(${product.id})">تعديل</button>
          </td>
      `;
      productsList.appendChild(row);
  });
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
              <button class="sell-btn" onclick="sellProduct(${product.id})">بيع</button>
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



// إضافة وظائف تبديل المود
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

// إضافة مستمع الحدث لزر تبديل المود
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// تهيئة المود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  loadData(); // استدعاء الدالة الموجودة مسبقاً
});





function loadSalesData() {
  const salesList = document.getElementById('salesList');
  if (!salesList) return; // تجنب الخطأ إذا لم تكن الصفحة الحالية هي sales.html

  salesList.innerHTML = '';

  products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.sold || 0}</td>
          <td>${product.quantity}</td>
          <td>${product.price} جنية</td>
      `;
      salesList.appendChild(row);
  });
}

