import React from "react";
import "./Style/DeletModal.css";

const DeleteModal = ({ blog, onClose, onConfirm }) => {
  if (!blog) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Blog Yazısını Sil</h3>

        <p className="modal-text">
          "<strong className="blog-title-highlight">{blog.title}</strong>" adlı
          blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri
          alınamaz.
        </p>

        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onClose}>
            İptal
          </button>

          <button
            className="modal-delete-btn"
            onClick={() => onConfirm(blog.id)}
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
