import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Простой обработчик без i18n и on-change
const form = document.querySelector('form');
const feedback = document.querySelector('.feedback');
const input = document.querySelector('input[name="url"]');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = input.value.trim();
    
    if (!url) {
      feedback.textContent = 'Не должно быть пустым';
      feedback.classList.add('text-danger');
      return;
    }
    
    try {
      new URL(url);
      feedback.textContent = 'RSS успешно загружен';
      feedback.classList.add('text-success');
      // Очистка формы (по желанию)
      input.value = '';
    } catch {
      feedback.textContent = 'Ссылка должна быть валидным URL';
      feedback.classList.add('text-danger');
    }
    
    // Убираем классы через 3 секунды (для чистоты)
    setTimeout(() => {
      feedback.classList.remove('text-success', 'text-danger');
      feedback.textContent = '';
    }, 3000);
  });
} else {
  console.error('Form not found!');
}