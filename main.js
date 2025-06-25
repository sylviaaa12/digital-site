// -------------------------------------------------
// main.js  ·  数字生活场景前端交互脚本
// -------------------------------------------------
// 1. 动态注入页面片段（navbar、各场景、modal）
// 2. 解析 products.csv（由 data.js 提供 loadProducts()）
// 3. 主场景 / 子场景切换
// 4. 设备卡片点击 → 弹出产品列表模态框
// -------------------------------------------------

async function loadFragment(targetId, url) {
  const res = await fetch(url);
  document.getElementById(targetId).innerHTML = await res.text();
}

Promise.all([
  loadFragment('navbar',         'navbar.html'),
  loadFragment('device-modal',   'modal.html'),
  loadFragment('scene-home',     'scenes/home.html'),
  loadFragment('scene-community','scenes/community.html'),
  loadFragment('scene-city',     'scenes/city.html')
]).then(initialize);

async function initialize() {
  if (typeof loadProducts === 'function') await loadProducts();

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('nav-link-active'));
      link.classList.add('nav-link-active');

      const target = link.dataset.category;
      ['home', 'community', 'city'].forEach(c => {
        document.getElementById(`scene-${c}`).classList.toggle('hidden', c !== target);
      });
    });
  });

  const mobileBtn  = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('invisible');
      mobileMenu.classList.toggle('opacity-0');
      mobileMenu.classList.toggle('-translate-y-full');
    });
  }

  document.addEventListener('click', e => {
    if (!e.target.matches('.category-btn')) return;
    const btn = e.target;
    btn.parentElement.querySelectorAll('.category-btn')
       .forEach(b => b.classList.remove('category-btn-active'));
    btn.classList.add('category-btn-active');

    const subId = btn.dataset.subcategory;
    btn.closest('section').querySelectorAll('.subcategory-content')
       .forEach(div => div.classList.toggle('hidden', div.id !== subId));
  });

  document.querySelectorAll('[data-device-id]').forEach(el => {
    const id = el.getAttribute('data-device-id');
    el.classList.add(
      'device-card',
      'bg-white', 'rounded-lg', 'p-4', 'shadow-md',
      'transition', 'transform', 'hover:scale-105',
      'hover:bg-blue-50', 'cursor-pointer'
    );
  });

  document.addEventListener('click', e => {
    const card = e.target.closest('.device-card');
    if (card) showDevice(card.dataset.deviceId || card.dataset.device);
  });

  document.getElementById('device-modal').addEventListener('click', e => {
    if (e.target.id === 'device-modal' || e.target.id === 'closeModal') hideModal();
  });
}

function showDevice(deviceId) {
  const modal     = document.getElementById('device-modal');
  const box       = document.getElementById('modalProductList');
  const nameBox   = document.getElementById('modalDeviceName');
  const iconBox   = document.querySelector('#modalDeviceIcon i');

  const products = (window.productMap && window.productMap[deviceId]) || [];
  nameBox.textContent = products[0]?.deviceId || deviceId || '未知设备';

  const iconMap = {
    surveillanceCamera: 'fa-video-camera',
    doorLock:           'fa-lock',
    alarmSystem:        'fa-bell'
  };
  iconBox.className = `fa ${iconMap[deviceId] || 'fa-box-open'} text-4xl text-primary`;

  box.innerHTML = '';
  if (products.length === 0) {
    box.innerHTML = `<p class="text-center text-gray-500">当前设备暂无产品信息</p>`;
  } else {
    products.forEach(p => {
      box.insertAdjacentHTML('beforeend', `
        <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
          <div class="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
            <div class="flex-1">
              <h4 class="text-lg font-bold text-gray-800">${p.name || '产品名称'}</h4>
              <p class="text-sm text-gray-600 mt-1">${p.description || ''}</p>
              <p class="text-sm text-gray-500 mt-1">
                品牌：${p.brand || '—'} &nbsp;&nbsp; 型号：${p.model || '—'}
              </p>
              <p class="text-primary font-bold mt-2">${p.price || ''}</p>
            </div>
            ${p.imageUrl ? `<img src="${p.imageUrl}" alt="产品图片" class="w-24 h-24 object-cover rounded-md border">` : ''}
          </div>
        </div>
      `);
    });
  }

  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.querySelector('.modal-content').classList.add('scale-100');
}

function hideModal() {
  const modal = document.getElementById('device-modal');
  modal.classList.add('pointer-events-none', 'opacity-0');
  modal.querySelector('.modal-content').classList.remove('scale-100');
}
