import Modal from 'react-modal';

Modal.setAppElement('#root');

if (Modal.defaultStyles.overlay) {
  Modal.defaultStyles.overlay.backgroundColor = '#00000033';
}
