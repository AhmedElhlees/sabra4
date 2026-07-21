/* =========================================================
   sw.js — Service Worker لتطبيق Ibn-alSabrah
   =========================================================
   الغرض الوحيد لهذا الملف: تفعيل عرض الإشعارات الحقيقية
   (registration.showNotification) حتى لو كان التطبيق مغلقاً،
   عبر متصفح يدعم ذلك. لا يقوم بأي تخزين مؤقت (cache) للبيانات
   المالية الحساسة عمداً، حفاظاً على مبدأ عدم تخزين شيء خارج
   آلية التشفير الخاصة بالتطبيق نفسه.
   ========================================================= */

const SW_VERSION = 'ibn-alsabrah-v1';

// عند أول تثبيت: فعّله فوراً دون انتظار إغلاق كل التبويبات القديمة
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// عند التفعيل: تولَّ السيطرة على كل الصفحات المفتوحة فوراً
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// عند الضغط على إشعار: افتح نافذة التطبيق إن كانت مغلقة،
// أو ركّز على النافذة المفتوحة أصلاً إن وُجدت
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('./index.html');
      }
    })
  );
});

// هذا التطبيق لا يستخدم Push من سيرفر خارجي (كل الإشعارات تُطلق
// محلياً من صفحة التطبيق نفسها عبر registration.showNotification)،
// لذلك لا حاجة لمعالج 'push'. إن رغبت مستقبلاً بإشعارات فعلية
// حتى مع إغلاق كل تبويبات المتصفح تماماً، ذلك يتطلب Push API
// حقيقي مرتبط بسيرفر (خارج نطاق "سيرفر محلي بسيط لفتح ملف").
