import { useState } from "react";
import { Search, ShoppingCart, Filter, Heart, Store } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader/PageHeader";
import { ProductCard } from "@/components/organisms/marketplace/ProductCard";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categories = [
  { id: "all", label: "Todos" },
  { id: "suplementos", label: "Suplementos" },
  { id: "roupas", label: "Roupas" },
  { id: "acessorios", label: "Acessórios" },
  { id: "equipamentos", label: "Equipamentos" },
];

const productsData = [
  {
    id: 1,
    name: "Whey Protein Isolado 900g - Chocolate",
    price: 189.9,
    originalPrice: 249.9,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    store: "Max Titanium",
    rating: 4.8,
    reviews: 1234,
    isVerified: true,
    category: "suplementos",
  },
  {
    id: 2,
    name: "Legging Fitness Cintura Alta - Preta",
    price: 89.9,
    originalPrice: 129.9,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400",
    store: "Fit Fashion",
    rating: 4.6,
    reviews: 567,
    isVerified: true,
    category: "roupas",
  },
  {
    id: 3,
    name: "Creatina Monohidratada 300g",
    price: 79.9,
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
    store: "Growth Supplements",
    rating: 4.9,
    reviews: 2341,
    isVerified: true,
    category: "suplementos",
  },
  {
    id: 4,
    name: "Top Esportivo com Bojo - Rosa",
    price: 59.9,
    originalPrice: 79.9,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    store: "Fit Fashion",
    rating: 4.5,
    reviews: 234,
    isVerified: true,
    category: "roupas",
  },
  {
    id: 5,
    name: "Luva de Musculação com Munhequeira",
    price: 49.9,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400",
    store: "Iron Gym Store",
    rating: 4.7,
    reviews: 456,
    isVerified: false,
    category: "acessorios",
  },
  {
    id: 6,
    name: "BCAA 2:1:1 - 120 Cápsulas",
    price: 59.9,
    originalPrice: 89.9,
    image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=400",
    store: "Growth Supplements",
    rating: 4.8,
    reviews: 890,
    isVerified: true,
    category: "suplementos",
  },
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MobileLayout>
      <PageHeader
        title="Loja"
        rightElement={
          <div className="flex items-center gap-2">
            <Link href="/marketplace/sell">
              <Button variant="ghost" size="icon-sm" className="rounded-full">
                <Store className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon-sm" className="rounded-full relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-xs flex items-center justify-center text-primary-foreground font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        }
      />

      <div className="px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-secondary border-0 rounded-xl"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === cat.id
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Marketplace Banner */}
        <div className="gradient-primary rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          <div className="relative z-10">
            <h3 className="font-bold text-primary-foreground mb-1">Venda seus produtos</h3>
            <p className="text-sm text-primary-foreground/80 mb-3">
              Cadastre sua loja e alcance milhares de atletas
            </p>
            <Link href="/marketplace/sell">
              <Button variant="glass" size="sm" className="bg-white/20 hover:bg-white/30 text-primary-foreground">
                <Store className="w-4 h-4 mr-2" />
                Cadastrar Loja
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h3 className="font-bold mb-4">Produtos em Destaque</h3>
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
