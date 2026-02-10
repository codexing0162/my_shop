// notification.js
// Simple dropdown notification system for global messages/errors

(function () {
  const notificationContainer = document.createElement('div');
  notificationContainer.id = 'notification-dropdown';
  notificationContainer.style.position = 'fixed';
  notificationContainer.style.top = '20px';
  notificationContainer.style.left = '50%';
  notificationContainer.style.transform = 'translateX(-50%)';
  notificationContainer.style.zIndex = '9999';
  notificationContainer.style.minWidth = '300px';
  notificationContainer.style.maxWidth = '90vw';
  notificationContainer.style.display = 'none';
  notificationContainer.style.background = '#fff';
  notificationContainer.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
  notificationContainer.style.borderRadius = '8px';
  notificationContainer.style.overflow = 'hidden';
  notificationContainer.style.fontFamily = 'inherit';
  document.body.appendChild(notificationContainer);

  function show(message, type = 'info', timeout = 3500) {
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    const color = type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460';
    const bg = type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1';

    notificationContainer.innerHTML = `
    <div style="padding: 1rem 1.5rem; background: ${bg}; color: ${color}; display: flex; align-items: center; gap: 10px;">
      <span style="font-size:1.2em;">${icon}</span>
      <span style="flex:1; font-weight:500;">${message}</span>
      <button style="background:none;border:none;font-size:1.2em;cursor:pointer;opacity:0.6;" onclick="document.getElementById('notification-dropdown').style.display='none'">×</button>
    </div>`;

    notificationContainer.style.display = 'block';

    if (window.notificationTimeout) clearTimeout(window.notificationTimeout);
    window.notificationTimeout = setTimeout(() => {
      notificationContainer.style.display = 'none';
    }, timeout);
  }

  window.showNotification = show; // Legacy support

  window.Toast = {
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    info: (msg) => show(msg, 'info')
  };

})();
