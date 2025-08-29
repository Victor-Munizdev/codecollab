import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ShareProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (email: string) => void;
}

export function ShareProjectDialog({ isOpen, onClose, onShare }: ShareProjectDialogProps) {
  const [email, setEmail] = useState('');

  const handleShare = () => {
    if (email.trim()) {
      onShare(email);
      setEmail(''); // Clear input after sharing
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compartilhar Projeto</DialogTitle>
          <DialogDescription>
            Convide um colaborador por e-mail.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="email@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleShare}>Convidar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
