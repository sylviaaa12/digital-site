// main.js · 最新版

/* ------------- 片段注入 ------------- */
async function loadFragment(id, url) {
  const res = await fetch(url);
  document.getElementById(id).innerHTML = await res.text();
}

Promise.all([
  loadFragment('navbar', 'navbar.html'),
  loadFragment('device-modal', 'modal.html'),
  loadFragment('scene-home', 'scenes/home.html'),
  loadFragment('scene-community', 'scenes/community.html'),
  loadFragment('scene-city', 'scenes/city.html')
]).then(initSite);

/* ------------- 初始化 ------------- */
async function initSite() {
  if (typeof loadProducts === 'function') await loadProducts();

  // 主场景按钮
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.nav-link')
        .forEach(b => b.classList.remove('nav-link-active'));
      btn.classList.add('nav-link-active');

      ['home', 'community', 'city'].forEach(c => {
        document.getElementById(`scene-${c}`)
          .classList.toggle('hidden', c !== btn.dataset.category);
      });
    };
  });

  // 移动端菜单
  const mb = document.getElementById('mobile-menu-btn');
  const mm = document.getElementById('mobile-menu');
  if (mb && mm) mb.onclick = () => mm.classList.toggle('invisible');

  // 子场景按钮（事件委托）
  document.addEventListener('click', e => {
    const card = e.target.closest('.device-card');
    if (card) showDevice(card.dataset.device);
  });

    btn.closest('.subcategory-nav')
       ?.querySelectorAll('.category-btn')
       .forEach(b => b.classList.remove('category-btn-active'));
    btn.classList.add('category-btn-active');

    const subId = btn.dataset.subcategory;
    btn.closest('section')
       .querySelectorAll('.subcategory-content')
       .forEach(div => div.classList.toggle('hidden', div.id !== subId));
  });

  styleAndBindCards();

  // 关闭弹窗
  document.getElementById('device-modal').onclick = e => {
    if (['device-modal', 'closeModal'].includes(e.target.id)) hideModal();
  };
}

/* ------------- 设备卡片样式+点击 ------------- */
function styleAndBindCards() {
  document.querySelectorAll('.device-card').forEach(card => {
    card.classList.add(
      'flex', 'flex-col', 'items-center', 'text-center', 'gap-2'
    );
    const id = card.dataset.device || card.dataset.deviceId;
    if (id) {
      card.dataset.device = id;
      card.onclick = () => showDevice(id);
    }
    if (!card.querySelector('i.device-icon')) {
      const i = document.createElement('i');
      i.className = 'fa fa-cube device-icon';
      card.prepend(i);
    }
  });
}

/* ------------- 弹窗 ------------- */
function showDevice(id) {
  const modal = document.getElementById('device-modal');
  const list  = document.getElementById('modalProductList');
  const name  = document.getElementById('modalDeviceName');
  const icon  = document.querySelector('#modalDeviceIcon i');

  const arr = (window.productMap && window.productMap[id]) || [];
  name.textContent = arr[0]?.deviceId || id;
  icon.className = 'fa fa-box-open text-4xl text-primary';

  list.innerHTML = arr.length
    ? arr.map(p => productCardHTML(p)).join('')
    : '<p class="text-center text-gray-500">当前设备暂无产品信息</p>';

  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.querySelector('.modal-content').classList.add('scale-100');
}

function hideModal() {
  const m = document.getElementById('device-modal');
  m.classList.add('pointer-events-none', 'opacity-0');
  m.querySelector('.modal-content').classList.remove('scale-100');
}

function productCardHTML(p) {
  return `<div class="bg-gray-50 border p-4 rounded-lg shadow-sm">
    <h4 class="font-bold">${p.name||''}</h4>
    <p class="text-sm text-gray-600">${p.description||''}</p>
    <p class="text-sm text-gray-500">品牌：${p.brand||'—'} 型号：${p.model||'—'}</p>
    <p class="text-primary font-bold mt-1">${p.price||''}</p>
  </div>`;
}
