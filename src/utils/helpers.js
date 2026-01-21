export const getProgressColor = (percent) => {
  if (percent >= 80) return 'text-emerald-500';
  if (percent >= 50) return 'text-amber-500';
  return 'text-rose-500';
};

export const getProgressBg = (percent) => {
  if (percent >= 80) return 'bg-emerald-500';
  if (percent >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

export const copyToClipboard = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  
  try {
    document.execCommand('copy');
    return true;
  } catch (err) {
    return false;
  } finally {
    document.body.removeChild(el);
  }
};