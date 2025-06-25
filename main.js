// main.js

async function initSite() {
  await loadProducts();
  loadNavbar();
  loadModal();
  loadScene('scene-home', 'scenes/home.html');
  loadScene('scene-community', 'scenes/community.html');
  loadScene('scene-city', 'scenes/city.html');
  setupNavigation();
}

function loadNavbar() {
  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar').innerHTML = html;
    });
}

function loadModal() {
  fetch('modal.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('device-modal').innerHTML = html;
      document.getElementById('closeModal').addEventListener('click', hideModal);
    });
}

function loadScene(containerId, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById(containerId);
      container.innerHTML = html;

      // 给所有设备卡片加样式和点击事件
      container.querySelectorAll('[data-device], [data-device-id]').forEach(el => {
        const id = el.getAttribute('data-device') || el.getAttribute('data-device-id');
        el.classList.add(
          'bg-white',
          'rounded-lg',
          'p-4',
          'shadow-md',
          'transition',
          'transform',
          'hover:scale-105',
          'hover:bg-blue-50',
          'cursor-pointer',
          'device-card'
        );
        el.setAttribute('data-device', id); // 标准化属性
        el.addEventListener('click', () => showDevice(id));
      });
    });
}

function setupNavigation() {
  document.addEventListener('click', e => {
    if (e.target.matches('.nav-link')) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('nav-link-active'));
      e.target.classList.add('nav-link-active');

      const target = e.target.dataset.category;
      ['home', 'community', 'city'].forEach(c => {
        const scene = document.getElementById(`scene-${c}`);
        scene.classList.toggle('hidden', c !== target);
        const section = scene.querySelector('section');
        if (section) section.classList.remove('hidden');
      });
    }

    // 子场景切换
    if (e.target.matches('.category-btn')) {
      const btn = e.target;
      btn.parentElement.querySelectorAll('.category-btn')
         .forEach(b => b.classList.remove('category-btn-active'));
      btn.classList.add('category-btn-active');

      const subId = btn.dataset.subcategory;
      btn.closest('section').querySelectorAll('.subcategory-content')
         .forEach(div => div.classList.toggle('hidden', div.id !== subId));
    }
  });
}

function showDevice(deviceId) {
  const modal     = document.getElementById('deviceModal');
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
  const modal = document.getElementById('deviceModal');
  modal.classList.add('pointer-events-none', 'opacity-0');
  modal.querySelector('.modal-content').classList.remove('scale-100');
}

initSite();
