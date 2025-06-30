import React from "react";
import "./components.scss";
import Button from "@/views/components/button";


interface ConfirmationModalProps {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title = "Confirm Action",
    message,
    onConfirm,
    onCancel,
    confirmText = "Yes",
    cancelText = "Cancel",
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>{title}</h4>
                <p>{message}</p>
                <div className="modal-actions">
                    <Button
                        text={cancelText}
                        onClick={onCancel}
                        type="button"
                    />
                    <Button
                        text={confirmText}
                        onClick={onConfirm}
                        type="button"
                    />
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
