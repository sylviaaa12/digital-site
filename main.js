// -------------------------------------------------
// main.js · 数字生活场景前端交互脚本（最新版）
// -------------------------------------------------
// 1. 动态注入片段（navbar、各场景、modal）
// 2. 解析 products.csv → productMap
// 3. 主场景 / 子场景切换 + 高亮
// 4. 设备卡片插图标 + 样式 + 弹出产品列表
// -------------------------------------------------

/* ---------- 0. 片段注入 ---------- */
async function loadFragment(id, url) {
  const res = await fetch(url);
  document.getElementById(id).innerHTML = await res.text();
}

Promise.all([
  loadFragment('navbar',         'navbar.html'),
  loadFragment('device-modal',   'modal.html'),
  loadFragment('scene-home',     'scenes/home.html'),
  loadFragment('scene-community','scenes/community.html'),
  loadFragment('scene-city',     'scenes/city.html')
]).then(initSite);

/* ---------- 1. 初始化 ---------- */
async function initSite() {
  if (typeof loadProducts === 'function') await loadProducts();

  // 主场景切换
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('nav-link-active'));
      link.classList.add('nav-link-active');
      const target = link.dataset.category;
      ['home','community','city'].forEach(c => {
        document.getElementById(`scene-${c}`).classList.toggle('hidden', c !== target);
      });
    });
  });

  // 移动端菜单
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('invisible');
      mobileMenu.classList.toggle('opacity-0');
      mobileMenu.classList.toggle('-translate-y-full');
    });
  }

  // ✅ 修复子场景按钮高亮
  document.addEventListener('click', e => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;
    btn.closest('.subcategory-nav')
      ?.querySelectorAll('.category-btn')
      .forEach(b => b.classList.remove('category-btn-active'));
    btn.classList.add('category-btn-active');

    const subId = btn.dataset.subcategory;
    btn.closest('section').querySelectorAll('.subcategory-content')
       .forEach(div => div.classList.toggle('hidden', div.id !== subId));
  });

  styleAndBindDeviceCards();

  document.getElementById('device-modal').addEventListener('click', e => {
    if (e.target.id === 'device-modal' || e.target.id === 'closeModal') hideModal();
  });
}

/* ---------- 2. 设备卡片样式 + 点击 + 插入图标 ---------- */
function styleAndBindDeviceCards() {
  document.querySelectorAll('.device-card').forEach(card => {
    card.classList.add(
      'bg-white', 'rounded-lg', 'p-4', 'shadow-md',
      'transition', 'transform', 'hover:scale-105',
      'hover:bg-blue-50', 'cursor-pointer',
      'flex', 'flex-col', 'items-center', 'text-center', 'gap-2'
    );

    const deviceId = card.dataset.device || card.dataset.deviceId;
    if (deviceId) {
      card.dataset.device = deviceId;
      card.addEventListener('click', () => showDevice(deviceId));
    }
    // 插入图标
    if (!card.querySelector('i.device-icon')) {
      const icon = document.createElement('i');
      icon.className = 'fa fa-cube device-icon';
      card.insertBefore(icon, card.firstChild);
    }
  });
}

/* ---------- 3. 模态框展示 ---------- */
function showDevice(deviceId) {
  const modal   = document.getElementById('device-modal');
  const box     = document.getElementById('modalProductList');
  const nameBox = document.getElementById('modalDeviceName');
  const iconBox = document.querySelector('#modalDeviceIcon i');

  const products = (window.productMap && window.productMap[deviceId]) || [];
  nameBox.textContent = products[0]?.deviceId || deviceId || '未知设备';

  const iconMap = {
    surveillanceCamera: 'fa-video-camera',
    doorLock:           'fa-lock',
    alarmSystem:        'fa-bell'
  };
  iconBox.className = `fa ${iconMap[deviceId] || 'fa-box-open'} text-4xl text-primary`;

  box.innerHTML = products.length === 0
    ? '<p class="text-center text-gray-500">当前设备暂无产品信息</p>'
    : products.map(p => productCardHTML(p)).join('');

  modal.classList.remove('pointer-events-none','opacity-0');
  modal.querySelector('.modal-content').classList.add('scale-100');
}

function hideModal() {
  const modal = document.getElementById('device-modal');
  modal.classList.add('pointer-events-none','opacity-0');
  modal.querySelector('.modal-content').classList.remove('scale-100');
}

function productCardHTML(p) {
  return `
    <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
      <div class="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
        <div class="flex-1">
          <h4 class="text-lg font-bold text-gray-800">${p.name || '产品名称'}</h4>
          <p class="text-sm text-gray-600 mt-1">${p.description || ''}</p>
          <p class="text-sm text-gray-500 mt-1">品牌：${p.brand || '—'} &nbsp;&nbsp; 型号：${p.model || '—'}</p>
          <p class="text-primary font-bold mt-2">${p.price || ''}</p>
        </div>
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="产品图片" class="w-24 h-24 object-cover rounded-md border">` : ''}
      </div>
    </div>`;
}
