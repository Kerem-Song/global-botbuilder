import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');
if (ReactModal.defaultStyles.overlay) {
  ReactModal.defaultStyles.overlay.zIndex = 200;
  ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.5)';
}

if (ReactModal.defaultStyles.content) {
  ReactModal.defaultStyles.content.borderRadius = '16px';
}
