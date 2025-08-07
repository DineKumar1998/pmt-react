import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import "./index.scss"

type Props = {
    title: string
    description: string;
    isOpen: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onClose: () => void;
    isDanger?: boolean;
}

export default function CustomModal(props: Props) {
    const { description, isOpen, onConfirm, onClose, title, cancelLabel = "Close", confirmLabel = "Confirm", isDanger = false } = props;

    function close() {
        if (typeof onClose === 'function') {
            onClose()
        }
    }

    function confirm() {
        if (typeof onConfirm === 'function') {
            onConfirm()
        }
    }

    return (
        <>
            <Dialog open={isOpen} as="div" className="modal" onClose={close}>
                <div className="modal__backdrop" />
                <div className="modal__container">
                    <DialogPanel transition className="modal__panel">
                        <DialogTitle as="h3" className="modal__title">
                            {title}
                        </DialogTitle>
                        <p className="modal__description">
                            {description}
                        </p>
                        <div className="mt-1 modal__actions">
                            <Button
                                className={`btn ${isDanger ? 'btn--danger' : 'btn--confirm'}`}
                                onClick={confirm}
                            >
                                {confirmLabel}
                            </Button>
                            <Button
                                className="btn btn--close"
                                onClick={close}
                            >
                                {cancelLabel}
                            </Button>

                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}
