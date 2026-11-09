'use client';

import { useState } from 'react';
import { useCart } from '@/lib/useCart';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  // 默认选中第一个尺寸规格
  const sizes = product.sizes || [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || { name: '标准尺寸', price: 0 });
  const [added, setAdded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false); // 控制大图弹窗

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-amber-100 flex flex-col justify-between">
        <div>
          {/* 商品图片区：点击查看大框 */}
          <div 
            onClick={() => setShowImageModal(true)}
            className="relative w-full h-80 bg-amber-50/50 cursor-pointer group overflow-hidden flex items-center justify-center p-2"
          >
            <img
              src={product.image_url || 'https://via.placeholder.com/400x400?text=手工金纸'}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* 提示图标：点击放大 */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm shadow flex items-center gap-1">
                🔍 点击查看大图
              </span>
            </div>

            {/* 预订时间标签 */}
            {product.lead_time && (
              <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow z-10">
                {product.lead_time}
              </span>
            )}
          </div>

          {/* 商品内容 */}
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

            {/* 尺寸/规格选择逻辑：规格大于1个时显示下拉菜单，只有1个时显示静态清爽标签 */}
            {sizes.length > 1 ? (
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
            ) : sizes.length === 1 ? (
              <div className="mb-4 text-xs font-semibold text-gray-500 flex items-center gap-2">
                <span>规格：</span>
                <span className="text-amber-900 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  {selectedSize.name}
                </span>
              </div>
            ) : null}
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

      {/* 点击大图弹窗 Modal */}
      {showImageModal && (
        <div 
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}