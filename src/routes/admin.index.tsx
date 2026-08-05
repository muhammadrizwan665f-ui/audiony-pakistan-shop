import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import { formatPKR } from "@/lib/pricing";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { orders, products } = useAdmin();
  const revenue = orders.reduce((a: number, o: { total: number }) => a + o.total, 0);
  const sold = products.reduce((a: number, p: { sold: number }) => a + p.sold, 0);

  const chart = products.slice(0, 6).map((p) => ({
    name: p.name.split(" ")[1] ?? p.name.slice(0, 8),
    sold: p.sold,
  }));

  const cards = [
    { label: "Revenue (live orders)", value: formatPKR(revenue), Icon: DollarSign },
    { label: "Orders", value: String(orders.length), Icon: ShoppingBag },
    { label: "Products", value: String(products.length), Icon: Package },
    { label: "Units sold", value: sold.toLocaleString(), Icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, Icon }) => (
          <div key={label} className="premium-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="premium-card mt-6 p-6">
        <h2 className="font-display font-bold">Units sold by product</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <XAxis dataKey="name" fontSize={12} />
              <Tooltip />
              <Bar dataKey="sold" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="premium-card mt-6 p-6">
        <h2 className="font-display font-bold">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No orders yet — place a test order from the storefront.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex flex-wrap justify-between gap-2 text-sm">
                <span className="font-medium">
                  {o.id} · {o.customer.fullName} ({o.customer.city})
                </span>
                <span className="text-muted-foreground">
                  {o.status} · {formatPKR(o.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
