import prisma from "@../../lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE() {
    try {
        // Borra todas las imágenes relacionadas primero (por FK)
        await prisma.image.deleteMany({});
        // Borra todos los historiales de precios
        await prisma.priceHistory.deleteMany({});
        // Borra todos los car listings
        await prisma.carListing.deleteMany({});
        return NextResponse.json({ message: "All car listings deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete car listings" }, { status: 500 });
    }
}
