import Modal from 'react-modal';

Modal.setAppElement('#root');

if (Modal.defaultStyles.overlay) {
  Modal.defaultStyles.overlay.zIndex = 200;
  Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.5)';
}

if (Modal.defaultStyles.content) {
  Modal.defaultStyles.content.borderRadius = '16px';
}
