import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { authQueries } from "@/queries";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import axios from "axios";

interface SecuritySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SecuritySheet({ open, onOpenChange }: SecuritySheetProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authQueries.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return res.data?.data || res.data;
    },
    onSuccess: () => {
      toast.success("Mot de passe mis à jour avec succès");
      onOpenChange(false);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de la mise à jour du mot de passe");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[2rem] h-[75vh] flex flex-col p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
            <Shield className="w-6 h-6 text-primary" />
            Sécurité & Confidentialité
          </SheetTitle>
          <SheetDescription>
            Modifiez votre mot de passe pour sécuriser votre compte.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 px-1 pb-20">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe actuel</label>
            <Input 
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="h-12 rounded-xl"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Nouveau mot de passe</label>
            <Input 
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="••••••••"
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmer le mot de passe</label>
            <Input 
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="h-12 rounded-xl"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl font-semibold text-lg mt-6"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
