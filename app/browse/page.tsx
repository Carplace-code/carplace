import ClientBrowsePage from "@/components/ClientBrowsePage";
import db from "@/lib/prisma";

export default async function BrowsePage() {
  const brands = await db.brand.findMany({
    where: {
      models: {
        some: {
          versions: {
            some: {
              trims: {
                some: {
                  carListings: {
                    some: {},
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
    include: {
      models: {
        where: {
          versions: {
            some: {
              trims: {
                some: {
                  carListings: {
                    some: {},
                  },
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      },
    },
  });

  return <ClientBrowsePage brands={brands} />;
}
