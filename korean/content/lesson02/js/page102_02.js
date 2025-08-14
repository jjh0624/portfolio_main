  document.querySelectorAll('.rating-box').forEach(box => {
    const stars = box.querySelectorAll('.star');

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));

        stars.forEach(s => {
          const sValue = parseInt(s.getAttribute('data-value'));
          s.classList.toggle('active', sValue <= value);
        });
      });
    });
  });