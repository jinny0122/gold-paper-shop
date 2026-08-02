'use client';

import { useState } from 'react';
import { useCart } from '@/lib/useCart';
import Link from 'next/link';

export default function InquiryPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  // 计算总价
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.selectedSize.price * item.quantity,
    0
  );

  // 提交订单并唤起 WhatsApp
  const handleSendWhatsApp = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('您的预订清单是空的哦！');
      return;
    }

    // 1. 组装发给老板的 WhatsApp 消息文本
    let message = `🏮 *【传统手工金纸】预订咨询单*\n`;
    message += `------------------------\n`;
    message += `👤 *顾客姓名*：${customerName}\n`;
    message += `📞 *联系电话*：${phone}\n`;
    if (note) message += `📝 *备注/送货要求*：${note}\n`;
    message += `------------------------\n`;
    message += `📦 *预订项目清单*：\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\n`;
      message += `   - 规格：${item.selectedSize.name}\n`;
      message += `   - 数量：${item.quantity} 件\n`;
      message += `   - 单价：RM ${item.selectedSize.price}\n`;
    });

    message += `------------------------\n`;
    message += `💰 *预估总额*：*RM ${totalPrice}*\n\n`;
    message += `请问老板，这些款式有货吗？我想确认预订细节！`;

    // 2. 读取你在 .env.local 设定的 WhatsApp 号码
    const whatsappNumber = process.env.NEXT_PUBLIC_MY_WHATSAPP_NUMBER || '';

    // 3. 编码网址并打开 WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-amber-50/30 pb-20 text-gray-800">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-amber-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-amber-800 hover:text-red-600 font-bold flex items-center gap-1 text-sm"
          >
            ← 返回继续选购
          </Link>
          <h1 className="text-lg font-bold text-gray-800">📋 确认预订清单</h1>
          <div className="w-16"></div> {/* 占位平衡 */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-amber-100 max-w-md mx-auto">
            <span className="text-5xl mb-4 block">🛒</span>
            <h3 className="text-lg font-bold text-gray-700 mb-2">预订清单还是空的</h3>
            <p className="text-sm text-gray-500 mb-6">快去挑选喜庆精致的手工大黄梨吧！</p>
            <Link
              href="/"
              className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-red-700 transition"
            >
              前往产品目录
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 左侧：已选商品列表 */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                  <h2 className="font-bold text-gray-800 text-lg">选购项目 ({cart.length})</h2>
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-600 transition"
                  >
                    清空清单
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.map((item, index) => (
                    <div key={index} className="py-4 flex gap-4 items-center">
                      <div className="w-16 h-16 bg-amber-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || 'https://via.placeholder.com/150'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                        <p className="text-xs text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded font-medium mt-1">
                          规格: {item.selectedSize.name}
                        </p>
                        <div className="text-red-600 font-bold text-sm mt-1">
                          RM {item.selectedSize.price}
                        </div>
                      </div>

                      {/* 数量调节器 */}
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="text-gray-500 hover:text-red-600 font-bold px-1"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="text-gray-500 hover:text-red-600 font-bold px-1"
                        >
                          +
                        </button>
                      </div>

                      {/* 删除按钮 */}
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-gray-300 hover:text-red-500 p-1 text-sm ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：简单联系资料填写 + 提交按钮 */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-200 sticky top-24">
                <h3 className="font-bold text-gray-800 text-lg mb-4">简单联系资料</h3>

                <form onSubmit={handleSendWhatsApp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">您的名字 *</label>
                    <input
                      type="text"
                      required
                      placeholder="例：陈太太 / Mr. Tan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">联系电话 *</label>
                    <input
                      type="tel"
                      required
                      placeholder="例：012-3456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">备注 / 预订日期（选填）</label>
                    <textarea
                      rows="2"
                      placeholder="例：希望农历十五前送达 / 自取"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    ></textarea>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500 font-medium">预估总额：</span>
                      <span className="text-2xl font-black text-red-600">RM {totalPrice}</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span className="text-lg">💬</span>
                      发送 WhatsApp 预订
                    </button>
                    <p className="text-[11px] text-gray-400 text-center mt-2">
                      点击后将自动打开 WhatsApp，直接发送清单给专人确认。免注册登录！
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}