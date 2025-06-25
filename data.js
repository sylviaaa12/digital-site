/* 载入 products.csv → productMap[deviceId] = [ {...}, ... ] */
let productMap = {};

async function loadProducts() {
  const res  = await fetch('products.csv');
  const text = await res.text();
  const rows = text.trim().split(/\r?\n/).map(r => r.split(','));
  const header = rows.shift().map(h => h.trim());
  const idx = k => header.indexOf(k);

  rows.forEach(r => {
    const deviceId = r[idx('设备ID')]?.trim();
    if (!deviceId) return;
    const p = {
      sceneId:   r[idx('场景ID')]?.trim() || '',
      subSceneId:r[idx('子场景ID')]?.trim() || '',
      deviceId,
      productId: r[idx('产品ID')]?.trim() || '',
      name:      r[idx('产品名称')]?.trim() || '',
      description:r[idx('产品描述')]?.trim() || '',
      price:     r[idx('价格')]?.trim() || '',
      brand:     r[idx('品牌')]?.trim() || '',
      model:     r[idx('型号')]?.trim() || '',
      imageUrl:  r[idx('图片URL')]?.trim() || ''
    };
    if (!productMap[deviceId]) productMap[deviceId] = [];
    productMap[deviceId].push(p);
  });
}
