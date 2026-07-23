const submission = JSON.parse(sessionStorage.getItem('relipayCreativeRequest') || 'null');
const escapeHtml = (value) => {
  const node = document.createElement('div');
  node.textContent = String(value || 'Not available');
  return node.innerHTML;
};
const item = (label, value) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`;

if (!submission) {
  window.location.replace('index.html');
} else {
  document.querySelector('#success-email').innerHTML = `Confirmation will be sent to <strong>${escapeHtml(submission.email)}</strong>.`;
  document.querySelector('#submitted-at').textContent = submission.submittedAt;
  document.querySelector('#request-id').textContent = submission.requestId;
  document.querySelector('#submission-summary').innerHTML = [
    item('Organisation', submission.organisation), item('Design team', submission.designTeam),
    item('Go-live date', submission.goLiveDate), item('Requested by', submission.name),
  ].join('');
  document.querySelector('#request-summary').innerHTML = [
    item('Banner type', submission.bannerTypes.join(', ')), item('Mobile number', submission.mobile),
    item('Reference file', submission.referenceFile || 'Not attached'),
  ].join('');
  document.querySelector('#submitted-brief').textContent = submission.storyline;
}
