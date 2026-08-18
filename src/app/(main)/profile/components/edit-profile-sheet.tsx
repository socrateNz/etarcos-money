import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueries } from "@/queries";
import { toast } from "sonner";
import { User } from "lucide-react";

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileSheet({ open, onOpenChange }: EditProfileSheetProps) {
  const { user, setUser } = useUserStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        country: user?.country || "",
      });
    }
  }, [open, user]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await authQueries.updateProfile(data);
      return res.data?.data || res.data;
    },
    onSuccess: (updatedUser) => {
      setUser({ ...user, ...updatedUser });
      toast.success("Profil mis à jour avec succès");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du profil");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[2rem] h-[85vh] flex flex-col p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
            <User className="w-6 h-6 text-primary" />
            Modifier le profil
          </SheetTitle>
          <SheetDescription>
            Mettez à jour vos informations personnelles.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 px-1 pb-20">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prénom</label>
            <Input 
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Ex: John"
              className="h-12 rounded-xl"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom (Optionnel)</label>
            <Input 
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Ex: Doe"
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Téléphone (Optionnel)</label>
            <Input 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Ex: +33 6 12 34 56 78"
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Pays (Optionnel)</label>
            <Input 
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="Ex: France"
              className="h-12 rounded-xl"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl font-semibold text-lg mt-6"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
