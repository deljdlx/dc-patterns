

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');

  buttons.forEach(button => {
      button.addEventListener('click', () => {
          // Supprimer l'état actif
          buttons.forEach(btn => btn.classList.remove('active'));
          panels.forEach(panel => panel.classList.remove('active'));

          // Activer le bon onglet
          button.classList.add('active');
          document.getElementById(button.dataset.tab).classList.add('active');
      });
  });
});