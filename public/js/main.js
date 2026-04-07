document.querySelectorAll('.field input').forEach(input => {
  input.addEventListener('blur', () => {
    input.classList.toggle('invalid', !input.checkValidity());
  });
});