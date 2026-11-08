'use client';

import { useState } from 'react';
import { useCart } from '@/lib/useCart';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  // 默认选中第一个尺寸规格
  const sizes = product.sizes || [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || { name: '标准尺寸', price: 0 });
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500); // 1.5秒后恢复按钮状态
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-amber-100 flex flex-col justify-between">
      <div>
        {/* 商品图片 */}
        <div className="relative w-full h-64 bg-amber-50">
          <img
            src={product.image_url || 'https://via.placeholder.com/400x400?text=手工金纸'}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.lead_time && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow">
              {product.lead_time}
            </span>
          )}
        </div>

        {/* 商品内容 */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

          {/* 尺寸选择框 */}
          {sizes.length > 0 && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1">选择尺寸规格：</label>
              <select
                value={selectedSize.name}
                onChange={(e) => {
                  const found = sizes.find((s) => s.name === e.target.value);
                  if (found) setSelectedSize(found);
                }}
                className="w-full p-2.5 bg-amber-50/50 border border-amber-200 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {sizes.map((size, index) => (
                  <option key={index} value={size.name}>
                    {size.name} - RM {size.price}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 底部价格与动作按钮 */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">当前规格价格</span>
          <span className="text-2xl font-black text-red-600">
            <span className="text-sm font-normal">RM</span> {selectedSize.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`w-full py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white'
          }`}
        >
          {added ? '✓ 已加入预订清单' : '🛒 加入预订清单'}
        </button>
      </div>
    </div>
  );
}