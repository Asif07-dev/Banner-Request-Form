const form = document.querySelector('#request-form');
const customToggle = document.querySelector('#custom-toggle');
const customDimensions = document.querySelector('#custom-dimensions');
const fileInput = document.querySelector('#reference-banner');
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
const maxFileSize = 5 * 1024 * 1024;

const showError = (field, message) => {
  document.querySelector(`#${field}-error`).textContent = message;
  const input = document.querySelector(`[name="${field}"]`) || document.querySelector(`#${field}`);
  input?.classList.toggle('invalid', Boolean(message));
};

const clearErrors = () => document.querySelectorAll('.error').forEach((item) => (item.textContent = ''));

customToggle.addEventListener('change', () => {
  customDimensions.hidden = !customToggle.checked;
  if (!customToggle.checked) document.querySelector('#dimension-custom').value = '';
});

document.querySelector('#storyline').addEventListener('input', (event) => {
  document.querySelector('#character-count').textContent = event.target.value.length;
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  showError('referenceBanner', '');
  document.querySelector('#file-name').textContent = '';
  if (!file) return;
  if (!allowedFileTypes.includes(file.type)) {
    showError('referenceBanner', 'Please upload a JPG, PNG, GIF, or PDF file.');
    fileInput.value = '';
    return;
  }
  if (file.size > maxFileSize) {
    showError('referenceBanner', 'File size must be less than 5 MB.');
    fileInput.value = '';
    return;
  }
  document.querySelector('#file-name').textContent = `✓ ${file.name}`;
  document.querySelector('#upload-title').textContent = 'Replace reference file';
});

function validate() {
  clearErrors();
  document.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
  const data = new FormData(form);
  let valid = true;
  const required = [
    ['organisation', 'Organisation is required.'],
    ['designTeam', 'Design team selection is required.'],
    ['name', 'Your name is required.'],
    ['goLiveDate', 'Go-live date is required.'],
  ];
  required.forEach(([field, message]) => { if (!data.get(field)?.trim()) { showError(field, message); valid = false; } });
  const dimensions = data.getAll('dimensions');
  if (!dimensions.length) { showError('dimensions', 'Please select at least one banner dimension.'); valid = false; }
  if (customToggle.checked && !data.get('dimensionCustom').trim()) { showError('dimensionCustom', 'Please specify your custom dimensions.'); valid = false; }
  const email = data.get('email').trim();
  if (!email) { showError('email', 'Your email is required.'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Please enter a valid email address.'); valid = false; }
  const mobile = data.get('mobile').trim();
  if (!mobile) { showError('mobile', 'Mobile number is required.'); valid = false; }
  else if (!/^\d{10}$/.test(mobile)) { showError('mobile', 'Please enter a valid 10-digit mobile number.'); valid = false; }
  const storyline = data.get('storyline').trim();
  if (storyline.length < 10) { showError('storyline', 'Storyline must be at least 10 characters.'); valid = false; }
  return valid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validate()) return;
  const data = new FormData(form);
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replaceAll('-', '');
  const requestId = `REQ-${datePart}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
  const dimensions = data.getAll('dimensions');
  const custom = data.get('dimensionCustom').trim();
  if (custom) dimensions[dimensions.indexOf('Custom size')] = `Custom size (${custom})`;
  sessionStorage.setItem('relipayCreativeRequest', JSON.stringify({
    requestId,
    submittedAt: now.toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }),
    organisation: data.get('organisation'), designTeam: data.get('designTeam'), name: data.get('name'),
    email: data.get('email'), mobile: data.get('mobile'), goLiveDate: data.get('goLiveDate'),
    bannerTypes: dimensions, referenceFile: fileInput.files[0]?.name || '', storyline: data.get('storyline'),
  }));
  window.location.assign('success.html');
});

form.addEventListener('reset', () => setTimeout(() => { clearErrors(); customDimensions.hidden = true; document.querySelector('#character-count').textContent = '0'; document.querySelector('#file-name').textContent = ''; document.querySelector('#upload-title').textContent = 'Drag a file here or browse'; }, 0));
