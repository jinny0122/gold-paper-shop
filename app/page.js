'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/useCart';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const cart = useCart((state) => state.cart);

  // 计算购物车总件数
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        // 打印详细错误信息
        console.error('读取商品失败详情:', error.message, error.details, error.hint);
      } else {
        console.log('读取到的商品数据:', data);
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-amber-50/30 text-gray-800 pb-16">
      {/* 1. 顶部 Header：自适应内边距与字体，手机端按钮保持精简不压挤 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center gap-2">
          {/* 左侧 Logo & 标题 */}
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-2xl font-black text-red-600 tracking-wide truncate">
              🏮 传统手工金纸工艺
            </h1>
            <p className="text-[10px] sm:text-xs text-amber-700 font-medium truncate">
              手工大黄梨 · 传统祭拜礼品预订
            </p>
          </div>

          {/* 右侧预订清单按钮：手机显示简版胶囊（防换行），电脑显示完整文本 */}
          <Link
            href="/inquiry"
            className="relative bg-red-600 hover:bg-red-700 text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow transition-all flex items-center gap-1.5 shrink-0 text-xs sm:text-sm active:scale-95"
          >
            <span>📋</span>
            <span className="hidden sm:inline">我的预订清单</span>
            <span className="sm:hidden">清单</span>
            {totalItems > 0 && (
              <span className="bg-amber-400 text-red-900 text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* 2. Hero Banner 区块：自适应上下间距与字体大小 */}
      <section className="bg-gradient-to-b from-red-600 to-amber-600 text-white py-8 sm:py-12 px-4 text-center shadow-inner">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3">
          精制作大黄梨 · 祈福迎祥
        </h2>
        <p className="text-amber-100 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
          纯手工折制，规格多样，专人送货与自取。\n先选购款式，提交后将直接通过 WhatsApp 与专人确认细节。
        </p>
      </section>

      {/* 3. 主体商品列表：自适应 Grid 布局与内边距 */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-red-600 rounded-full inline-block"></span>
          选购商品产品目录
        </h3>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">加载商品中...</div>
        ) : products.length === 0 ? (
          /* 如果 Supabase 里还没有商品，显示占位提示 */
          <div className="bg-white rounded-2xl p-8 sm:p-10 text-center border border-amber-200 shadow-sm max-w-md mx-auto">
            <p className="text-gray-500 mb-4">数据库中暂时还没有上线商品哦！</p>
            <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              💡 提示：下一步我们可以去 Supabase 随意插入一条测试数据，或者写 Admin 后台来上传大黄梨图片！
            </p>
          </div>
        ) : (
          /* 核心自适应 Grid：手机 1 列，平板 2 列，电脑 3 列 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}