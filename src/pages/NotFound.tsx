import { useRouter } from "next/router";
import { useEffect } from "react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/button";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", router.asPath);
  }, [router.asPath]);

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mb-8">
          <FileQuestion className="w-14 h-14 text-primary" />
        </div>

        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground text-center max-w-xs mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            onClick={() => router.push("/")}
            className="w-full gradient-primary"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir para o início
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default NotFound;
