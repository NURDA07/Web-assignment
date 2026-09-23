document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const draft = document.querySelector('#message-draft');
  draft.textContent = `From: ${form.elements.name.value} <${form.elements.email.value}>\nSubject: ${form.elements.reason.selectedOptions[0].text}\nFavorite color: ${form.elements['theme-color'].value}\n\n${form.elements.message.value}`;
  draft.hidden = false;
  document.querySelector('#form-status').textContent = 'Draft ready below. Nothing has been sent. Copy it into your email to contact us.';
});
