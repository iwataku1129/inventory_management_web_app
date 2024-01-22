import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export const SWUpdateDialog: React.FC<{ registration: ServiceWorkerRegistration }> = ({ registration }) => {
    const [show, setShow] = useState(!!registration.waiting);
    const handleUpdate = () => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        setShow(false);
        window.location.reload();
    };

    return show ? (
        <Dialog open={show}>
            <DialogTitle style={{ textAlign: "center" }}>
                アップデート通知
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    新しいバージョンがリリースされました。
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button onClick={handleUpdate}>アップデート</Button>
            </DialogActions>
        </Dialog>
    ) : (
        <></>
    );
};