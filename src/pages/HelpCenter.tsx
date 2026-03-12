import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Search, BookOpen, ThumbsUp, ThumbsDown, ArrowLeft, MessageSquare, HelpCircle } from "lucide-react";
import { mockKBArticles, kbCategoryLabels, type KBArticle } from "@/data/mock-support";
import { Link } from "react-router-dom";

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const published = mockKBArticles.filter((a) => a.is_published);

  const filtered = published.filter((a) => {
    if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.tags.some((t) => t.includes(q));
    }
    return true;
  });

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Torna al Help Center
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{kbCategoryLabels[selectedArticle.category]}</Badge>
                {selectedArticle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
              <CardTitle className="text-xl">{selectedArticle.title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                Aggiornato il {new Date(selectedArticle.updated_at).toLocaleDateString("it-IT")} · 👁 {selectedArticle.view_count} visualizzazioni
              </p>
            </CardHeader>
            <CardContent>
              {/* Simple markdown rendering */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {selectedArticle.content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold text-foreground mt-4 mb-2">{line.replace("## ", "")}</h2>;
                  if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold text-foreground mt-3 mb-1">{line.replace("### ", "")}</h3>;
                  if (line.startsWith("- **")) {
                    const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                    if (match) return <p key={i} className="text-sm text-foreground ml-4 my-1"><strong>{match[1]}</strong>: {match[2]}</p>;
                  }
                  if (line.match(/^\d+\. /)) return <p key={i} className="text-sm text-foreground ml-4 my-1">{line}</p>;
                  if (line.startsWith("- ")) return <p key={i} className="text-sm text-foreground ml-4 my-1">• {line.replace("- ", "")}</p>;
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  return <p key={i} className="text-sm text-foreground my-1">{line.replace(/\*\*(.+?)\*\*/g, "$1")}</p>;
                })}
              </div>

              {/* Feedback */}
              <div className="border-t mt-6 pt-4 text-center space-y-2">
                <p className="text-sm font-medium text-foreground">Questo articolo è stato utile?</p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => toast.success("Grazie per il feedback! 👍")}>
                    <ThumbsUp className="h-4 w-4 mr-1" /> Sì ({selectedArticle.helpful_count})
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Grazie, cercheremo di migliorare questo articolo")}>
                    <ThumbsDown className="h-4 w-4 mr-1" /> No ({selectedArticle.not_helpful_count})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="mt-4 border-primary/20">
            <CardContent className="py-4 text-center space-y-2">
              <HelpCircle className="h-6 w-6 mx-auto text-primary" />
              <p className="text-sm font-medium text-foreground">Non hai trovato la risposta?</p>
              <Button asChild size="sm">
                <Link to="/app/supporto">
                  <MessageSquare className="h-4 w-4 mr-1" /> Contatta il supporto
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary/5 border-b">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
          <BookOpen className="h-10 w-10 mx-auto text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground">Trova risposte alle tue domande su Cantiere in Cloud</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca articoli, guide, FAQ..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Category tabs */}
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
          <TabsList>
            <TabsTrigger value="all">Tutti</TabsTrigger>
            <TabsTrigger value="user_guide">Guide Utente</TabsTrigger>
            <TabsTrigger value="admin_guide">Guide Admin</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Articles grid */}
        <div className="grid gap-3">
          {filtered.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => setSelectedArticle(article)}
            >
              <CardContent className="py-4 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px]">{kbCategoryLabels[article.category]}</Badge>
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
                <p className="font-medium text-foreground">{article.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  👁 {article.view_count} · 👍 {article.helpful_count} utili
                </p>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nessun articolo trovato per "{search}"</p>
              <Button asChild variant="link" size="sm" className="mt-2">
                <Link to="/app/supporto">Contatta il supporto</Link>
              </Button>
            </div>
          )}
        </div>

        {/* CTA bottom */}
        <Card className="border-primary/20">
          <CardContent className="py-6 text-center space-y-3">
            <HelpCircle className="h-8 w-8 mx-auto text-primary" />
            <h2 className="text-lg font-bold text-foreground">Hai bisogno di aiuto?</h2>
            <p className="text-sm text-muted-foreground">Il nostro team di supporto è disponibile dal lunedì al venerdì, 9:00 - 18:00</p>
            <Button asChild>
              <Link to="/app/supporto">
                <MessageSquare className="h-4 w-4 mr-1" /> Apri un ticket
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
