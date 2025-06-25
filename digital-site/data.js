let productMap = {}; // deviceId -> [products]

async function loadProducts() {
  const res = await fetch('products.csv');
  const text = await res.text();
  const rows = text.trim().split(/\r?\n/).map(r => r.split(','));

  const header = rows.shift().map(h => h.trim());
  const indexMap = Object.fromEntries(header.map((k, i) => [k, i]));

  rows.forEach(r => {
    const deviceId = r[indexMap['设备ID']]?.trim();
    if (!deviceId) return;

    const product = {
      sceneId:     r[indexMap['场景ID']]?.trim() || '',
      subSceneId:  r[indexMap['子场景ID']]?.trim() || '',
      deviceId:    deviceId,
      productId:   r[indexMap['产品ID']]?.trim() || '',
      name:        r[indexMap['产品名称']]?.trim() || '',
      description: r[indexMap['产品描述']]?.trim() || '',
      price:       r[indexMap['价格']]?.trim() || '',
      brand:       r[indexMap['品牌']]?.trim() || '',
      model:       r[indexMap['型号']]?.trim() || '',
      imageUrl:    r[indexMap['图片URL']]?.trim() || ''
    };

    if (!productMap[deviceId]) productMap[deviceId] = [];
    productMap[deviceId].push(product);
  });
}
