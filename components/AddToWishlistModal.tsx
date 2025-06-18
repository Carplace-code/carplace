"use client";

import { Version } from "@prisma/client";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddToWishlist, useCreateWishlist, useGetWishlists, useRemoveFromWishlist } from "@/hooks/useWishlists";

import { Input } from "./ui/input";

interface AddToWishlistModalProps {
  versionId: Version["id"];
}

export default function AddToWishlistModal({ versionId }: AddToWishlistModalProps) {
  const [open, setOpen] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [newWishlistDescription, setNewWishlistDescription] = useState("");

  const { data: userWishlists, isLoading: loadingUserWishlists } = useGetWishlists({
    include: {
      items: true,
    },
  });
  const { mutate: createWishlist } = useCreateWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const isInWishlist =
    !loadingUserWishlists &&
    (userWishlists || []).some((wishlist) => wishlist.items?.map((item) => item.versionId).includes(versionId));

  const onButtonClick = () => {
    if (loadingUserWishlists) return; // Prevent opening dialog while loading

    if (!isInWishlist) {
      setOpen(true);
      return;
    }

    removeFromWishlist(
      {
        wishlistId:
          userWishlists?.find((wishlist) => wishlist.items?.some((item) => item.versionId === versionId))?.id || "",
        versionId,
      },
      {
        onSuccess: () => {
          toast.success("Eliminado de la lista de deseos");
        },
        onError: () => {
          toast.error("Error al eliminar de la lista de deseos");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="default" className="ml-2 h-auto p-1" onClick={onButtonClick}>
        <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir a una lista</DialogTitle>
          <DialogDescription>Elige una lista a la que añadir el auto o crea una nueva!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loadingUserWishlists ? (
            <div className="py-4 text-center">Cargando listas de deseos...</div>
          ) : (
            <>
              {userWishlists?.map((wishlist) => (
                <div
                  className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-gray-50"
                  key={wishlist.id}
                >
                  <div className="flex flex-col">
                    <span>{wishlist.name}</span>
                    <span className="text-sm text-gray-500">{wishlist.description}</span>
                  </div>
                  <Button
                    onClick={() =>
                      addToWishlist(
                        { wishlistId: wishlist.id, versionId },
                        {
                          onSuccess: () => {
                            setOpen(false);
                            toast.success(`Añadido a ${wishlist.name}`);
                          },
                          onError: () => {
                            toast.error("Error al añadir a la lista");
                          },
                        },
                      )
                    }
                  >
                    Añadir
                  </Button>
                </div>
              ))}

              {/* Horizontall divider */}
              <div className="my-4 border-t" />

              {/* Create new wishlist form */}
              <div className="flex w-full items-center gap-2">
                <Input
                  placeholder="Nombre"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  onClick={() => {
                    createWishlist(
                      { name: newWishlistName, description: newWishlistDescription },
                      {
                        onSuccess: async (newWishlist) => {
                          addToWishlist(
                            { wishlistId: newWishlist.id, versionId },
                            {
                              onSuccess: () => {
                                setOpen(false);
                                setNewWishlistName("");
                                setNewWishlistDescription("");
                                toast.success(`Lista creada y añadido a ${newWishlist.name}`);
                              },
                              onError: () => {
                                toast.error("Error al añadir a la nueva lista");
                              },
                            },
                          );
                        },
                        onError: () => {
                          toast.error("Error al crear la lista");
                        },
                      },
                    );
                  }}
                  className="text-sm"
                  disabled={loadingUserWishlists || !newWishlistName.trim() || !newWishlistDescription.trim()}
                >
                  Crear y añadir
                </Button>
              </div>
              <Input
                placeholder="Descripción"
                value={newWishlistDescription}
                onChange={(e) => setNewWishlistDescription(e.target.value)}
                className="mt-2 w-full"
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
