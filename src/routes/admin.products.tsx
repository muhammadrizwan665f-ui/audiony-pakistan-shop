import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatPKR } from "@/lib/pricing";
import { useAdmin } from "@/lib/admin-store";
import {
  deleteProductFn,
  duplicateProductFn,
  saveProduct,
  uploadProductImage,
} from "@/lib/admin.functions";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function blankProduct(sortOrder: number): Product {
  return {
    id: "",
    slug: "",
    name: "",
    category: "Earbuds",
    brand: "Audiony",
    sku: "",
    tagline: "",
    description: "",
    price: 0,
    salePrice: null,
    stock: 0,
    sold: 0,
    rating: 5,
    images: [],
    features: [],
    specs: [],
    included: [],
    warranty: "6 months brand warranty",
    shippingDetails: "Delivery in 2–4 working days across Pakistan.",
    flashSale: false,
    flashEndsAt: null,
    bulkRules: [],
    badges: [],
    featured: false,
    trending: false,
    active: true,
    sortOrder,
    reviews: [],
    faqs: [],
  };
}

function AdminProducts() {
  const { products, reload } = useAdmin();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const upsertProduct = async (product: Product) => {
    setSaving(true);
    try {
      await saveProduct({ data: { product } });
      await reload();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save this product.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = (id: string) => {
    void deleteProductFn({ data: { id } })
      .then(() => reload())
      .then(() => toast.success("Product deleted"))
      .catch(() => toast.error("Could not delete this product."));
  };

  const duplicate = (id: string) => {
    void duplicateProductFn({ data: { id } })
      .then(() => reload())
      .then(() => toast.success("Product duplicated (hidden until you activate it)"))
      .catch(() => toast.error("Could not duplicate this product."));
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add new products, edit prices, stock, flash sale timers and bulk discount rules —
            changes apply to the storefront instantly.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setCreating(creating ? null : blankProduct(products.length + 1));
          }}
        >
          {creating ? "Cancel" : "+ Add product"}
        </Button>
      </div>

      {creating ? (
        <div className="premium-card mt-6 p-5">
          <p className="font-display text-lg font-semibold">New product</p>
          <ProductForm
            value={creating}
            onChange={setCreating}
            saving={saving}
            submitLabel="Create product"
            onSubmit={async () => {
              const name = creating.name.trim();
              if (!name) {
                toast.error("Please add a product name.");
                return;
              }
              const product: Product = {
                ...creating,
                name,
                slug: creating.slug.trim() || slugify(name),
                sku: creating.sku.trim() || `AUD-${Date.now().toString(36).toUpperCase().slice(-5)}`,
              };
              const ok = await upsertProduct(product);
              if (ok) {
                toast.success("Product added");
                setCreating(null);
              }
            }}
          />
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {products.map((p) => (
          <div key={p.id} className="premium-card p-5">
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={p.images[0] ?? "/placeholder.svg"}
                alt=""
                loading="lazy"
                className="size-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-display font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.category} · {formatPKR(p.salePrice ?? p.price)} · stock {p.stock} · sold {p.sold}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`active-${p.id}`} className="text-xs">
                  Active
                </Label>
                <Switch
                  id={`active-${p.id}`}
                  checked={p.active}
                  onCheckedChange={(v) => void upsertProduct({ ...p, active: v })}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setCreating(null);
                    setEditing(editing?.id === p.id ? null : p);
                  }}
                >
                  {editing?.id === p.id ? "Close" : "Edit"}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => duplicate(p.id)}>
                  Duplicate
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteProduct(p.id)}>
                  Delete
                </Button>
              </div>
            </div>

            {editing?.id === p.id ? (
              <ProductForm
                value={editing}
                onChange={setEditing}
                saving={saving}
                submitLabel="Save changes"
                onSubmit={async () => {
                  const ok = await upsertProduct(editing);
                  if (ok) {
                    toast.success("Product updated");
                    setEditing(null);
                  }
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({
  value,
  onChange,
  onSubmit,
  saving,
  submitLabel,
}: {
  value: Product;
  onChange: (p: Product) => void;
  onSubmit: () => void | Promise<void>;
  saving: boolean;
  submitLabel: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read this file."));
        reader.readAsDataURL(file);
      });
      const { url } = await uploadProductImage({ data: { dataUrl, name: file.name } });
      onChange({ ...value, images: [...value.images, url] });
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
    >
      <div>
        <Label>Name</Label>
        <Input
          className="mt-1.5"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>
      <div>
        <Label>Category</Label>
        <Input
          className="mt-1.5"
          placeholder="Earbuds / Headphones / Solar Lights / Cooling Fans"
          value={value.category}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
        />
      </div>
      <div>
        <Label>URL slug</Label>
        <Input
          className="mt-1.5"
          placeholder="auto-generated from name"
          value={value.slug}
          onChange={(e) => onChange({ ...value, slug: e.target.value })}
        />
      </div>
      <div>
        <Label>SKU</Label>
        <Input
          className="mt-1.5"
          value={value.sku}
          onChange={(e) => onChange({ ...value, sku: e.target.value })}
        />
      </div>
      <div>
        <Label>Original price</Label>
        <Input
          type="number"
          className="mt-1.5"
          value={value.price}
          onChange={(e) => onChange({ ...value, price: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label>Sale price</Label>
        <Input
          type="number"
          className="mt-1.5"
          value={value.salePrice ?? ""}
          onChange={(e) =>
            onChange({ ...value, salePrice: e.target.value ? Number(e.target.value) : null })
          }
        />
      </div>
      <div>
        <Label>Stock</Label>
        <Input
          type="number"
          className="mt-1.5"
          value={value.stock}
          onChange={(e) => onChange({ ...value, stock: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label>Sold counter</Label>
        <Input
          type="number"
          className="mt-1.5"
          value={value.sold}
          onChange={(e) => onChange({ ...value, sold: Number(e.target.value) })}
        />
      </div>
      <div className="sm:col-span-2">
        <Label>Tagline</Label>
        <Input
          className="mt-1.5"
          value={value.tagline}
          onChange={(e) => onChange({ ...value, tagline: e.target.value })}
        />
      </div>
      <div className="sm:col-span-2">
        <Label>Description</Label>
        <Textarea
          className="mt-1.5"
          rows={3}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </div>

      <div className="sm:col-span-2">
        <Label>Images</Label>
        <div className="mt-2 flex flex-wrap gap-3">
          {value.images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative">
              <img src={src} alt="" className="size-20 rounded-xl object-cover" />
              <button
                type="button"
                className="absolute -right-2 -top-2 rounded-full bg-destructive px-2 text-xs text-destructive-foreground"
                onClick={() => onChange({ ...value, images: value.images.filter((_, k) => k !== i) })}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            className="max-w-xs"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
          {uploading ? <span className="text-xs text-muted-foreground">Uploading…</span> : null}
        </div>
      </div>

      <div>
        <Label>Flash sale ends at</Label>
        <Input
          type="datetime-local"
          className="mt-1.5"
          value={value.flashEndsAt ? new Date(value.flashEndsAt).toISOString().slice(0, 16) : ""}
          onChange={(e) =>
            onChange({
              ...value,
              flashEndsAt: e.target.value ? new Date(e.target.value).toISOString() : null,
              flashSale: Boolean(e.target.value),
            })
          }
        />
      </div>
      <div className="flex items-end gap-6 pb-1">
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={value.featured}
            onCheckedChange={(v) => onChange({ ...value, featured: v })}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={value.trending}
            onCheckedChange={(v) => onChange({ ...value, trending: v })}
          />
          Trending
        </label>
      </div>

      <div className="sm:col-span-2">
        <Label>Bulk discount rules</Label>
        <div className="mt-2 space-y-2">
          {value.bulkRules.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                type="number"
                className="w-28"
                value={r.minQty}
                aria-label="Minimum quantity"
                onChange={(e) => {
                  const rules = [...value.bulkRules];
                  rules[i] = { ...r, minQty: Number(e.target.value) };
                  onChange({ ...value, bulkRules: rules });
                }}
              />
              <span className="text-sm text-muted-foreground">pcs →</span>
              <Input
                type="number"
                className="w-28"
                value={r.discountPct}
                aria-label="Discount percent"
                onChange={(e) => {
                  const rules = [...value.bulkRules];
                  rules[i] = { ...r, discountPct: Number(e.target.value) };
                  onChange({ ...value, bulkRules: rules });
                }}
              />
              <span className="text-sm text-muted-foreground">% off</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  onChange({ ...value, bulkRules: value.bulkRules.filter((_, k) => k !== i) })
                }
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              onChange({ ...value, bulkRules: [...value.bulkRules, { minQty: 10, discountPct: 30 }] })
            }
          >
            Add rule
          </Button>
        </div>
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
