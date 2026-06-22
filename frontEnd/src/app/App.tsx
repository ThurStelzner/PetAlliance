import { useState, useEffect, useRef, useCallback } from "react";
import {
  PawPrint, User, Heart, Star, MessageCircle, X, Eye,
  Calendar, Weight, Shield, Award, Palette, Menu, LogOut,
  Upload, Check, Camera, CreditCard, Smartphone, Barcode,
  ChevronRight, Zap, Pencil, Send, Shuffle, Bell,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = "home" | "login" | "register" | "members" | "profile" | "my-animals" | "favorites";

interface Pet {
  id: number; ownerName: string; ownerPhone: string; photo: string;
  name: string; breed: string; color: string; sex: "Macho" | "Fêmea";
  type: string; size: "Mini" | "Pequeno" | "Médio" | "Grande" | "Gigante";
  birthDate: string; weight: string; description: string;
  vaccinated: boolean; breedCertified: boolean; isMember?: boolean;
}

interface AppUser {
  nome: string; email: string; cpf: string; cep: string; avatar?: string;
}

interface MatchNotification {
  id: number; pet: Pet; fromUser: string; accepted: boolean | null;
}

interface MatchRecord {
  id: number; petId: number; petName: string; petPhoto: string;
  withUser: string; date: number; status: "pending" | "accepted" | "declined";
  cooldownUntil: number;
}

interface ChatMessage {
  from: "me" | "them"; text: string; time: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PETS: Pet[] = [
  {
    id: 1, ownerName: "Mariana Costa", ownerPhone: "5511998234567",
    photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop&auto=format",
    name: "Thor", breed: "Golden Retriever", color: "Dourado", sex: "Macho",
    type: "Cachorro", size: "Grande", birthDate: "2021-03-14", weight: "34 kg",
    description: "Thor é um golden super dócil e brincalhão, adora crianças e outros animais. Muito carinhoso e bem treinado.",
    vaccinated: true, breedCertified: true,
  },
  {
    id: 2, ownerName: "Lucas Ferreira", ownerPhone: "5521986543210",
    photo: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&h=600&fit=crop&auto=format",
    name: "Mel", breed: "Bulldog Francês", color: "Branco e Malhado", sex: "Fêmea",
    type: "Cachorro", size: "Pequeno", birthDate: "2022-07-20", weight: "10 kg",
    description: "Mel é uma bulldog cheia de personalidade, adora um sofá e muito carinho. Adapta-se bem a apartamentos.",
    vaccinated: true, breedCertified: true,
  },
  {
    id: 3, ownerName: "Beatriz Santos", ownerPhone: "5531974321098",
    photo: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&auto=format",
    name: "Simba", breed: "Maine Coon", color: "Laranja Rajado", sex: "Macho",
    type: "Gato", size: "Grande", birthDate: "2020-11-05", weight: "8 kg",
    description: "Simba é um Maine Coon majestoso e inteligente. Muito sociável e adora explorar ambientes.",
    vaccinated: true, breedCertified: true,
  },
  {
    id: 4, ownerName: "Rafael Oliveira", ownerPhone: "5585963210987",
    photo: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop&auto=format",
    name: "Bolt", breed: "Border Collie", color: "Preto e Branco", sex: "Macho",
    type: "Cachorro", size: "Médio", birthDate: "2021-09-12", weight: "22 kg",
    description: "Bolt é extremamente inteligente e ativo. Campeão em agility, precisa de exercícios diários e estimulação mental.",
    vaccinated: true, breedCertified: false,
  },
  {
    id: 5, ownerName: "Camila Rocha", ownerPhone: "5547952109876",
    photo: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&h=600&fit=crop&auto=format",
    name: "Nina", breed: "Poodle", color: "Branco", sex: "Fêmea",
    type: "Cachorro", size: "Mini", birthDate: "2023-01-28", weight: "4 kg",
    description: "Nina é uma princesa! Super inteligente, aprende comandos rapidamente e é ótima companheira.",
    vaccinated: true, breedCertified: true,
  },
  {
    id: 6, ownerName: "Felipe Alves", ownerPhone: "5562941098765",
    photo: "https://images.unsplash.com/photo-1513360371669-4adf264d4f85?w=600&h=600&fit=crop&auto=format",
    name: "Luna", breed: "Siamês", color: "Bege e Marrom", sex: "Fêmea",
    type: "Gato", size: "Pequeno", birthDate: "2022-04-03", weight: "3.5 kg",
    description: "Luna é muito expressiva e comunicativa. Adora atenção e companhia.",
    vaccinated: true, breedCertified: false,
  },
  {
    id: 7, ownerName: "Ana Lima", ownerPhone: "5551930987654",
    photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format",
    name: "Zeus", breed: "Husky Siberiano", color: "Cinza e Branco", sex: "Macho",
    type: "Cachorro", size: "Grande", birthDate: "2020-06-17", weight: "28 kg",
    description: "Zeus é um husky lindo e cheio de energia. Precisa de exercício diário intenso.",
    vaccinated: true, breedCertified: true,
  },
  {
    id: 13, ownerName: "Fernanda Gomes", ownerPhone: "5561912345678",
    photo: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=600&fit=crop&auto=format",
    name: "Kiko", breed: "Calopsita", color: "Cinza e Amarelo", sex: "Macho",
    type: "Ave", size: "Mini", birthDate: "2022-03-01", weight: "90 g",
    description: "Kiko é uma calopsita muito inteligente e carinhosa. Aprende músicas e imita sons do ambiente.",
    vaccinated: false, breedCertified: false,
  },
  {
    id: 14, ownerName: "Roberto Nunes", ownerPhone: "5581913456789",
    photo: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600&h=600&fit=crop&auto=format",
    name: "Rex", breed: "Iguana Verde", color: "Verde", sex: "Macho",
    type: "Réptil", size: "Médio", birthDate: "2021-07-10", weight: "2 kg",
    description: "Rex é uma iguana verde dócil e bem cuidada. Já está acostumado com o contato humano.",
    vaccinated: false, breedCertified: false,
  },
  {
    id: 15, ownerName: "Patrícia Leal", ownerPhone: "5531914567890",
    photo: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=600&fit=crop&auto=format",
    name: "Fofinho", breed: "Angorá", color: "Branco", sex: "Macho",
    type: "Coelho", size: "Pequeno", birthDate: "2023-04-15", weight: "1.8 kg",
    description: "Fofinho é um coelho Angorá lindíssimo, super tranquilo e adora ser escovado.",
    vaccinated: true, breedCertified: false,
  },
  {
    id: 16, ownerName: "Caio Barros", ownerPhone: "5511915678901",
    photo: "https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=600&h=600&fit=crop&auto=format",
    name: "Peanut", breed: "Hamster Sírio", color: "Laranja e Branco", sex: "Fêmea",
    type: "Hamster", size: "Mini", birthDate: "2024-01-10", weight: "180 g",
    description: "Peanut é uma hamster muito ativa e curiosa. Adora correr na roda e explorar o terrário.",
    vaccinated: false, breedCertified: false,
  },
  {
    id: 17, ownerName: "Vanessa Cruz", ownerPhone: "5551916789012",
    photo: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&h=600&fit=crop&auto=format",
    name: "Nemo", breed: "Peixe-palhaço", color: "Laranja e Branco", sex: "Macho",
    type: "Peixe", size: "Mini", birthDate: "2023-08-20", weight: "30 g",
    description: "Nemo é um peixe-palhaço vibrante e saudável, em aquário de 200L com anemôna.",
    vaccinated: false, breedCertified: false,
  },
  {
    id: 18, ownerName: "Eduardo Pinto", ownerPhone: "5541917890123",
    photo: "https://images.unsplash.com/photo-1591389703635-e15a07b842d7?w=600&h=600&fit=crop&auto=format",
    name: "Tartaruga", breed: "Jabuti Piranga", color: "Marrom e Laranja", sex: "Fêmea",
    type: "Réptil", size: "Médio", birthDate: "2018-05-05", weight: "3.5 kg",
    description: "Jabuti piranga com 6 anos, muito saudável. Adora frutas e sol da manhã.",
    vaccinated: false, breedCertified: false,
  },
  // Members
  {
    id: 8, ownerName: "Thiago Mendes", ownerPhone: "5541929876543",
    photo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop&auto=format",
    name: "Bella", breed: "Labrador", color: "Caramelo", sex: "Fêmea",
    type: "Cachorro", size: "Grande", birthDate: "2021-12-01", weight: "30 kg",
    description: "Bella é a alegria do lar! Ama brincar na água, correr e receber carinho.",
    vaccinated: false, breedCertified: false, isMember: true,
  },
  {
    id: 9, ownerName: "Juliana Pereira", ownerPhone: "5571918765432",
    photo: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&h=600&fit=crop&auto=format",
    name: "Oliver", breed: "Ragdoll", color: "Branco e Azul", sex: "Macho",
    type: "Gato", size: "Grande", birthDate: "2019-08-22", weight: "9 kg",
    description: "Oliver é um ragdoll verdadeiro, dócil e adorável.",
    vaccinated: true, breedCertified: true, isMember: true,
  },
  {
    id: 10, ownerName: "Gabriel Souza", ownerPhone: "5519907654321",
    photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop&auto=format",
    name: "Max", breed: "Dachshund", color: "Marrom", sex: "Macho",
    type: "Cachorro", size: "Pequeno", birthDate: "2022-10-15", weight: "7 kg",
    description: "Max é muito curioso e aventureiro apesar do tamanho.",
    vaccinated: true, breedCertified: false, isMember: true,
  },
  {
    id: 19, ownerName: "Renata Silva", ownerPhone: "5511918901234",
    photo: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=600&fit=crop&auto=format",
    name: "Periquito", breed: "Periquito Australiano", color: "Verde e Amarelo", sex: "Macho",
    type: "Ave", size: "Mini", birthDate: "2023-02-14", weight: "35 g",
    description: "Periquito falador e agitado, já sabe dizer seu nome e algumas palavras.",
    vaccinated: false, breedCertified: true, isMember: true,
  },
  {
    id: 20, ownerName: "Marcos Teles", ownerPhone: "5521919012345",
    photo: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=600&fit=crop&auto=format",
    name: "Bolinha", breed: "Mini Rex", color: "Preto", sex: "Fêmea",
    type: "Coelho", size: "Pequeno", birthDate: "2023-09-01", weight: "1.2 kg",
    description: "Bolinha é uma coelha Mini Rex super tranquila e carinhosa.",
    vaccinated: true, breedCertified: true, isMember: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCPF(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").slice(0, 14);
}
function formatCEP(v: string) {
  return v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
}
function calcAge(bd: string) {
  const diff = Date.now() - new Date(bd).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  if (years > 0) return `${years} ano${years > 1 ? "s" : ""}`;
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  return `${months} mês${months !== 1 ? "es" : ""}`;
}
function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}
function now() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ children, color = "primary" }: { children: React.ReactNode; color?: "primary" | "accent" | "gray" }) {
  const cls = { primary: "bg-primary/10 text-primary", accent: "bg-accent/20 text-amber-700", gray: "bg-muted text-muted-foreground" }[color];
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{children}</span>;
}

// ─── Internal Chat Modal ──────────────────────────────────────────────────────

function ChatModal({ pet, onClose }: { pet: Pet; onClose: () => void }) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    { from: "them", text: `Olá! Vi que você tem interesse no(a) ${pet.name}. Como posso ajudar?`, time: now() },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const myMsg: ChatMessage = { from: "me", text: input, time: now() };
    setMsgs(m => [...m, myMsg]);
    setInput("");
    setTimeout(() => {
      setMsgs(m => [...m, { from: "them", text: "Claro! Vamos combinar os detalhes do encontro 🐾", time: now() }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full sm:max-w-md h-[85vh] sm:h-[70vh] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-primary text-white">
          <div className="w-9 h-9 rounded-full bg-white/20 overflow-hidden shrink-0">
            <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{pet.ownerName}</p>
            <p className="text-xs text-white/70">sobre {pet.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-secondary/30">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${m.from === "me" ? "bg-primary text-white rounded-br-sm" : "bg-card text-foreground rounded-bl-sm border border-border"}`}>
                <p className="text-sm">{m.text}</p>
                <p className={`text-[10px] mt-0.5 ${m.from === "me" ? "text-white/60" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="px-4 py-3 border-t border-border flex gap-2">
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Escreva uma mensagem..."
            className="flex-1 bg-input-background rounded-xl px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button onClick={send} className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Matches History Popup ────────────────────────────────────────────────────

function MatchesPopup({ records, onClose }: { records: MatchRecord[]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const statusLabel: Record<MatchRecord["status"], string> = {
    pending: "Aguardando", accepted: "Aceito ✓", declined: "Recusado",
  };
  const statusCls: Record<MatchRecord["status"], string> = {
    pending: "bg-accent/20 text-amber-700",
    accepted: "bg-primary/10 text-primary",
    declined: "bg-red-100 text-red-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full sm:max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary text-white">
          <div className="flex items-center gap-2">
            <Shuffle size={18} />
            <h2 className="font-display font-semibold text-lg">Meus Matches</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {records.length === 0 ? (
            <div className="text-center py-16 px-6">
              <Shuffle className="mx-auto text-muted-foreground/30 mb-3" size={40} />
              <p className="text-sm text-muted-foreground">Você ainda não fez nenhum match.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {records.map(r => {
                const cooldownDays = Math.ceil((r.cooldownUntil - Date.now()) / (1000 * 60 * 60 * 24));
                const inCooldown = r.status === "accepted" && Date.now() < r.cooldownUntil;
                return (
                  <div key={r.id} className="flex items-center gap-3 px-5 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img src={r.petPhoto} alt={r.petName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{r.petName}</p>
                      <p className="text-xs text-muted-foreground">com {r.withUser}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString("pt-BR")}</p>
                      {inCooldown && (
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          Próximo match disponível em {cooldownDays} dia{cooldownDays !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusCls[r.status]}`}>
                      {statusLabel[r.status]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Match Payment Modal ──────────────────────────────────────────────────────

function MatchPaymentModal({ pet, onClose, onConfirm, cooldownUntil }: {
  pet: Pet; onClose: () => void; onConfirm: (record: Omit<MatchRecord, "id">) => void;
  cooldownUntil: number | null;
}) {
  const [payMethod, setPayMethod] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleConfirm = () => {
    if (!payMethod) return;
    setDone(true);
    const now = Date.now();
    onConfirm({
      petId: pet.id, petName: pet.name, petPhoto: pet.photo,
      withUser: pet.ownerName, date: now, status: "pending",
      cooldownUntil: now + 30 * 24 * 60 * 60 * 1000,
    });
  };

  // Cooldown active — show block screen
  if (cooldownUntil && Date.now() < cooldownUntil) {
    const daysLeft = Math.ceil((cooldownUntil - Date.now()) / (1000 * 60 * 60 * 24));
    const available = new Date(cooldownUntil).toLocaleDateString("pt-BR");
    return (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-accent" size={28} />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Match em período de espera</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>{pet.name}</strong> já participou de um match recente.<br />
            Para proteger o bem-estar do animal, é necessário aguardar <strong>1 mês</strong> entre matches.
          </p>
          <div className="bg-secondary rounded-xl p-4 my-5 text-center">
            <p className="text-xs text-muted-foreground mb-1">Próximo match disponível em</p>
            <p className="font-display text-2xl font-bold text-primary">{available}</p>
            <p className="text-xs text-muted-foreground mt-1">{daysLeft} dia{daysLeft !== 1 ? "s" : ""} restante{daysLeft !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Entendido</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-lg text-foreground">Solicitar Match</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted transition-colors"><X size={20} /></button>
        </div>
        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shuffle className="text-primary" size={28} />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Match enviado!</h3>
            <p className="text-sm text-muted-foreground">O dono de <strong>{pet.name}</strong> receberá sua solicitação. Aguarde a resposta!</p>
            <p className="text-xs text-muted-foreground mt-2">O cooldown de 1 mês começa após o match ser aceito.</p>
            <button onClick={onClose} className="mt-5 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Fechar
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="bg-secondary rounded-xl p-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{pet.name}</p>
                <p className="text-xs text-muted-foreground">Dono: {pet.ownerName}</p>
              </div>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-3">
              <p className="text-xs text-foreground leading-relaxed">
                <strong>Taxa de Match: R$ 5,00</strong><br />
                Ao confirmar, você paga a taxa que será repassada ao anunciante após o match aceito. Após aceito, o animal ficará em <strong>período de espera de 1 mês</strong>.
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground">Forma de pagamento</p>
            <div className="space-y-2">
              {[
                { id: "pix", label: "PIX", desc: "Imediato", icon: <Zap size={16} /> },
                { id: "card", label: "Cartão de Crédito", desc: "Aprovação rápida", icon: <CreditCard size={16} /> },
              ].map(m => (
                <button key={m.id} onClick={() => setPayMethod(m.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${payMethod === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  <span className={payMethod === m.id ? "text-primary" : "text-muted-foreground"}>{m.icon}</span>
                  <div>
                    <p className={`text-sm font-semibold ${payMethod === m.id ? "text-primary" : "text-foreground"}`}>{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                  {payMethod === m.id && <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center"><Check size={11} className="text-white" /></div>}
                </button>
              ))}
            </div>
            <button
              onClick={handleConfirm}
              disabled={!payMethod}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${payMethod ? "bg-primary text-white hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
            >
              <Shuffle size={16} /> Confirmar Match — R$ 5,00
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Animal Modal ─────────────────────────────────────────────────────────────

function AnimalModal({ pet, onClose, matchRecords, onAddMatch }: {
  pet: Pet; onClose: () => void;
  matchRecords: MatchRecord[]; onAddMatch: (r: Omit<MatchRecord, "id">) => void;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Find cooldown for this specific pet
  const petRecord = matchRecords
    .filter(r => r.petId === pet.id && r.status === "accepted")
    .sort((a, b) => b.cooldownUntil - a.cooldownUntil)[0];
  const cooldownUntil = petRecord ? petRecord.cooldownUntil : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-card w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl">
          <div className="sticky top-0 bg-card/95 backdrop-blur-sm z-10 flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-xl text-foreground">{pet.name}</h2>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-muted transition-colors"><X size={20} /></button>
          </div>
          <div className="p-5 space-y-5">
            <div className="aspect-video bg-muted rounded-xl overflow-hidden">
              <img src={pet.photo} alt={`Foto de ${pet.name}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {pet.vaccinated && <Badge color="primary"><Shield size={11} /> Vacinado</Badge>}
              {pet.breedCertified && <Badge color="accent"><Award size={11} /> Pedigree</Badge>}
              <Badge color="gray">{pet.sex}</Badge>
              <Badge color="gray">{pet.type}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <PawPrint size={14} />, label: "Raça", value: pet.breed },
                { icon: <Palette size={14} />, label: "Cor", value: pet.color },
                { icon: <Weight size={14} />, label: "Peso", value: pet.weight },
                { icon: <Calendar size={14} />, label: "Nascimento", value: formatDate(pet.birthDate) },
                { icon: <PawPrint size={14} />, label: "Porte", value: pet.size },
                { icon: <User size={14} />, label: "Dono", value: pet.ownerName },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-secondary rounded-xl p-3 flex gap-2 items-start">
                  <span className="text-primary mt-0.5">{icon}</span>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Sobre {pet.name}</h4>
              <p className="text-sm text-foreground leading-relaxed">{pet.description}</p>
            </div>

            {/* Cooldown info banner */}
            {cooldownUntil && Date.now() < cooldownUntil && (
              <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-xl px-4 py-3">
                <Calendar size={15} className="text-accent shrink-0" />
                <p className="text-xs text-foreground">
                  Match disponível novamente em{" "}
                  <strong>{new Date(cooldownUntil).toLocaleDateString("pt-BR")}</strong>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3 font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <MessageCircle size={16} /> Conversar no Site
              </button>
              <button
                onClick={() => setMatchOpen(true)}
                className="flex items-center justify-center gap-2 bg-accent/80 text-amber-900 rounded-xl py-3 font-semibold text-sm hover:bg-accent transition-colors"
              >
                <Shuffle size={16} /> Dar Match
              </button>
            </div>
          </div>
        </div>
      </div>
      {chatOpen && <ChatModal pet={pet} onClose={() => setChatOpen(false)} />}
      {matchOpen && (
        <MatchPaymentModal
          pet={pet}
          onClose={() => setMatchOpen(false)}
          onConfirm={onAddMatch}
          cooldownUntil={cooldownUntil}
        />
      )}
    </>
  );
}

// ─── Match Notification Popup ─────────────────────────────────────────────────

function MatchPopup({ notif, onAccept, onChat, onDismiss }: {
  notif: MatchNotification; onAccept: () => void; onChat: () => void; onDismiss: () => void;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in">
        <div className="bg-primary px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Shuffle size={16} /> <span className="text-sm font-semibold">Nova solicitação de Match!</span>
          </div>
          <button onClick={onDismiss} className="text-white/70 hover:text-white transition-colors"><X size={16} /></button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <img src={notif.pet.photo} alt={notif.pet.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{notif.fromUser}</p>
              <p className="text-xs text-muted-foreground">quer fazer match com <strong>{notif.pet.name}</strong></p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setChatOpen(true); }}
              className="flex items-center justify-center gap-1.5 text-sm font-semibold bg-secondary text-foreground py-2 rounded-xl hover:bg-muted transition-colors"
            >
              <MessageCircle size={14} /> Conversar
            </button>
            <button
              onClick={onAccept}
              className="flex items-center justify-center gap-1.5 text-sm font-semibold bg-primary text-white py-2 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Check size={14} /> Aceitar
            </button>
          </div>
        </div>
      </div>
      {chatOpen && <ChatModal pet={notif.pet} onClose={() => setChatOpen(false)} />}
    </>
  );
}

// ─── Animal Card ──────────────────────────────────────────────────────────────

function AnimalCard({ pet, onViewMore, liked, onToggleLike }: {
  pet: Pet; onViewMore: (p: Pet) => void; liked: boolean; onToggleLike: (id: number) => void;
}) {
  return (
    <article className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img src={pet.photo} alt={`Foto de ${pet.name}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3 flex gap-1.5">
          {pet.breedCertified && <span className="bg-white/90 backdrop-blur-sm text-accent rounded-full p-1.5 shadow-sm" title="Pedigree"><Award size={14} /></span>}
          {pet.vaccinated && <span className="bg-white/90 backdrop-blur-sm text-primary rounded-full p-1.5 shadow-sm" title="Vacinado"><Shield size={14} /></span>}
        </div>
        {pet.isMember && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent text-amber-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star size={10} fill="currentColor" /> MEMBRO
            </span>
          </div>
        )}
        <button onClick={() => onToggleLike(pet.id)} className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm transition-transform hover:scale-110">
          <Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-semibold text-lg text-foreground">{pet.name}</h3>
            <Badge color={pet.sex === "Macho" ? "primary" : "gray"}>{pet.sex}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{pet.breed} · {pet.color}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User size={12} /><span>{pet.ownerName}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge color="gray">{pet.type}</Badge>
          <Badge color="gray">{pet.size}</Badge>
          <Badge color="gray">{calcAge(pet.birthDate)}</Badge>
        </div>
        <button onClick={() => onViewMore(pet)} className="mt-auto w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors duration-200">
          <Eye size={15} /> Veja Mais
        </button>
      </div>
    </article>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────

function NavBar({ page, setPage, loggedUser, onLogout, favCount, matchRecords, onOpenMatches }: {
  page: Page; setPage: (p: Page) => void;
  loggedUser: AppUser | null; onLogout: () => void; favCount: number;
  matchRecords: MatchRecord[]; onOpenMatches: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingMatches = matchRecords.filter(r => r.status === "pending").length;

  const baseLinks: { label: string; page: Page }[] = [
    { label: "Início", page: "home" },
    { label: "Membros", page: "members" },
    { label: "Seus Animais", page: "my-animals" },
  ];

  const links = loggedUser ? [...baseLinks, { label: "Perfil", page: "profile" as Page }] : baseLinks;

  return (
    <nav className="sticky top-0 z-40 bg-primary text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <button onClick={() => setPage("home")} className="flex items-center gap-2 font-display font-bold text-xl text-white">
          <PawPrint size={26} /> Pet<span className="text-accent">Alliance</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button key={l.page} onClick={() => setPage(l.page)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === l.page ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
              {l.page === "profile" && loggedUser?.avatar ? (
                <img src={loggedUser.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover border border-white/30" />
              ) : null}
              {l.label}
            </button>
          ))}
          {/* Favorites button */}
          <button onClick={() => setPage("favorites")}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === "favorites" ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
            <Heart size={16} />
            {favCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{favCount}</span>}
          </button>
          {/* Matches button */}
          {loggedUser && (
            <button onClick={onOpenMatches}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <Shuffle size={16} />
              {pendingMatches > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-amber-900 text-[9px] font-bold rounded-full flex items-center justify-center">{pendingMatches}</span>}
            </button>
          )}
          {loggedUser ? (
            <button onClick={onLogout} className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <LogOut size={15} /> Sair
            </button>
          ) : (
            <button onClick={() => setPage("login")} className="ml-2 bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
              Entrar
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <button onClick={() => setPage("favorites")} className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Heart size={20} />
            {favCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{favCount}</span>}
          </button>
          {loggedUser && (
            <button onClick={onOpenMatches} className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Shuffle size={20} />
              {pendingMatches > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-amber-900 text-[9px] font-bold rounded-full flex items-center justify-center">{pendingMatches}</span>}
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/20 bg-primary px-4 py-3 space-y-1">
          {links.map(l => (
            <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${page === l.page ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
              {l.page === "profile" && loggedUser?.avatar && <img src={loggedUser.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />}
              {l.label}
            </button>
          ))}
          {loggedUser ? (
            <button onClick={() => { onLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2">
              <LogOut size={15} /> Sair
            </button>
          ) : (
            <button onClick={() => { setPage("login"); setMenuOpen(false); }} className="w-full bg-white text-primary px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
              Entrar
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

// ─── Home Feed ────────────────────────────────────────────────────────────────

function HomeFeed({ onViewMore, likedIds, onToggleLike, matchNotif, onAcceptMatch, onDismissMatch }: {
  onViewMore: (p: Pet) => void; likedIds: Set<number>; onToggleLike: (id: number) => void;
  matchNotif: MatchNotification | null; onAcceptMatch: () => void; onDismissMatch: () => void;
}) {
  const regularAnimals = PETS.filter(p => !p.isMember);
  const [visible, setVisible] = useState(6);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visible < regularAnimals.length)
        setTimeout(() => setVisible(v => Math.min(v + 3, regularAnimals.length)), 500);
    }, { threshold: 0.5 });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [visible, regularAnimals.length]);

  return (
    <main className="flex-1">
      <div className="bg-gradient-to-br from-primary/10 to-background py-12 px-4 sm:px-6 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-3">
          Encontre seu <span className="text-primary">companheiro</span> ideal
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Conectamos donos apaixonados por seus animais. Explore, conheça e faça conexões reais.
        </p>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Animais Cadastrados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {regularAnimals.slice(0, visible).map(pet => (
            <AnimalCard key={pet.id} pet={pet} onViewMore={onViewMore} liked={likedIds.has(pet.id)} onToggleLike={onToggleLike} />
          ))}
        </div>
        {visible < regularAnimals.length ? (
          <div ref={loaderRef} className="flex justify-center py-10">
            <div className="flex gap-2 items-center text-muted-foreground text-sm">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Carregando mais animais...
            </div>
          </div>
        ) : <div ref={loaderRef} />}
      </div>
      <footer className="border-t border-border bg-card mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-foreground"><PawPrint className="text-primary" size={20} /> PetAlliance</div>
          <p className="text-sm text-muted-foreground text-center">© {new Date().getFullYear()} PetAlliance. Feito com amor pelos animais.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Termos</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
            <a href="#" className="hover:text-foreground transition-colors">Contato</a>
          </div>
        </div>
      </footer>
      {matchNotif && (
        <MatchPopup notif={matchNotif} onAccept={onAcceptMatch} onChat={() => {}} onDismiss={onDismissMatch} />
      )}
    </main>
  );
}

// ─── Favorites Page ───────────────────────────────────────────────────────────

function FavoritesPage({ likedIds, onViewMore, onToggleLike }: {
  likedIds: Set<number>; onViewMore: (p: Pet) => void; onToggleLike: (id: number) => void;
}) {
  const favPets = PETS.filter(p => likedIds.has(p.id));
  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-red-500 fill-red-500" size={28} />
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Animais Favoritos</h1>
      </div>
      {favPets.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
          <Heart className="mx-auto text-muted-foreground/30 mb-3" size={48} />
          <p className="text-muted-foreground">Você ainda não favoritou nenhum animal.</p>
          <p className="text-sm text-muted-foreground mt-1">Clique no coração nos cards para salvar seus favoritos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favPets.map(pet => <AnimalCard key={pet.id} pet={pet} onViewMore={onViewMore} liked={true} onToggleLike={onToggleLike} />)}
        </div>
      )}
    </main>
  );
}

// ─── Plans & Checkout ─────────────────────────────────────────────────────────

const PLANS = [
  { id: 1, name: "Iniciante", price: "7,50", animals: 5, highlight: false },
  { id: 2, name: "Básico", price: "15,00", animals: 10, highlight: false },
  { id: 3, name: "Profissional", price: "30,00", animals: 20, highlight: true },
  { id: 4, name: "Premium", price: "45,00", animals: 30, highlight: false },
];

const PAYMENT_METHODS = [
  { id: "pix", label: "PIX", icon: <Zap size={18} />, desc: "Aprovação imediata" },
  { id: "card", label: "Cartão de Crédito", icon: <CreditCard size={18} />, desc: "Em até 12x" },
  { id: "boleto", label: "Boleto Bancário", icon: <Barcode size={18} />, desc: "Vence em 3 dias úteis" },
  { id: "debito", label: "Cartão de Débito", icon: <Smartphone size={18} />, desc: "Débito online" },
];

function CheckoutModal({ plan, onClose }: { plan: typeof PLANS[0]; onClose: () => void }) {
  const [payMethod, setPayMethod] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm z-10 flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-xl text-foreground">Assinar Plano</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted transition-colors"><X size={20} /></button>
        </div>
        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="text-primary" size={32} /></div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Assinatura realizada!</h3>
            <p className="text-muted-foreground">Plano <strong>{plan.name}</strong> ativo. Cadastre até <strong>{plan.animals} animais</strong>/mês.</p>
            <button onClick={onClose} className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Fechar</button>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <div className="bg-secondary rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Plano selecionado</p>
                <p className="font-display text-lg font-bold text-foreground">{plan.name}</p>
                <p className="text-sm text-muted-foreground">{plan.animals} animais/mês</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">por mês</p>
                <p className="font-display text-3xl font-bold text-primary">R$ {plan.price}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Forma de pagamento</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${payMethod === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-card"}`}>
                    <span className={payMethod === m.id ? "text-primary" : "text-muted-foreground"}>{m.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${payMethod === m.id ? "text-primary" : "text-foreground"}`}>{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                    {payMethod === m.id && <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0"><Check size={11} className="text-white" /></div>}
                  </button>
                ))}
              </div>
            </div>
            {(payMethod === "card" || payMethod === "debito") && (
              <div className="space-y-3 p-4 bg-secondary rounded-xl">
                <p className="text-sm font-semibold text-foreground mb-1">Dados do cartão</p>
                <input placeholder="Número do cartão" className="w-full bg-card rounded-xl px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <input placeholder="Nome no cartão" className="w-full bg-card rounded-xl px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="MM/AA" className="w-full bg-card rounded-xl px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <input placeholder="CVV" className="w-full bg-card rounded-xl px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            )}
            {payMethod === "pix" && (
              <div className="p-4 bg-secondary rounded-xl text-center">
                <div className="w-28 h-28 bg-white border border-border rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-0.5 p-2">
                    {[1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1].map((v, i) => (
                      <div key={i} className={`w-4 h-4 rounded-sm ${v ? "bg-foreground" : "bg-white"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Escaneie o QR Code ou copie a chave PIX</p>
                <p className="text-xs font-mono text-primary mt-1">petalliance@pagamentos.com.br</p>
              </div>
            )}
            {payMethod === "boleto" && (
              <div className="p-4 bg-secondary rounded-xl">
                <p className="text-xs text-muted-foreground mb-2">Código de barras</p>
                <p className="text-xs font-mono text-foreground break-all leading-relaxed">23791.23400 12345.678901 23456.789012 3 00010000007500</p>
                <button className="mt-3 text-xs text-primary font-semibold hover:underline">Copiar código</button>
              </div>
            )}
            <button onClick={() => payMethod && setDone(true)} disabled={!payMethod}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${payMethod ? "bg-primary text-white hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
              <ChevronRight size={18} />
              {payMethod ? `Confirmar Assinatura — R$ ${plan.price}/mês` : "Selecione a forma de pagamento"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Members Page ─────────────────────────────────────────────────────────────

function MembersPage({ onViewMore, likedIds, onToggleLike }: { onViewMore: (p: Pet) => void; likedIds: Set<number>; onToggleLike: (id: number) => void; }) {
  const memberAnimals = PETS.filter(p => p.isMember);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<typeof PLANS[0] | null>(null);

  return (
    <main className="flex-1">
      <div className="bg-gradient-to-br from-primary/10 to-background py-10 px-4 sm:px-6 text-center border-b border-border">
        <div className="inline-flex items-center gap-2 bg-accent/20 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Star size={15} fill="currentColor" /> Comunidade Premium
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">Ver Os Membros</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Conheça os animais de quem faz parte da nossa comunidade e escolha seu plano.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Seja Membro</h2>
          <p className="text-muted-foreground">Escolha o plano ideal e comece a publicar seus animais</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {PLANS.map(plan => (
            <div key={plan.id} onClick={() => setSelectedPlan(plan)}
              className={`relative bg-card rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${plan.highlight ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]" : "border-border hover:border-primary/50"} ${selectedPlan?.id === plan.id ? "ring-2 ring-primary ring-offset-2" : ""}`}>
              {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">Mais popular</span></div>}
              {selectedPlan?.id === plan.id && <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center"><Check size={11} className="text-white" /></div>}
              <p className="font-display font-semibold text-lg text-foreground mb-1">{plan.name}</p>
              <div className="my-4">
                <span className="text-xs text-muted-foreground">R$</span>
                <span className="font-display text-4xl font-bold text-primary mx-1">{plan.price}</span>
                <span className="text-xs text-muted-foreground">/mês</span>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-foreground"><PawPrint size={14} className="text-primary shrink-0" /><span><strong>{plan.animals} animais</strong> por mês</span></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Shield size={14} className="text-primary shrink-0" /><span>Perfil verificado</span></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Star size={14} className="text-primary shrink-0" /><span>Badge de membro</span></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MessageCircle size={14} className="text-primary shrink-0" /><span>Chat com donos</span></div>
              </div>
              <button onClick={e => { e.stopPropagation(); setSelectedPlan(plan); setCheckoutPlan(plan); }}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${plan.highlight ? "bg-primary text-white hover:bg-primary/90" : "bg-secondary text-foreground hover:bg-primary hover:text-white"}`}>
                Comprar
              </button>
            </div>
          ))}
        </div>
        {selectedPlan && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 mb-12">
            <div>
              <p className="font-semibold text-foreground">Plano <span className="text-primary">{selectedPlan.name}</span> selecionado</p>
              <p className="text-sm text-muted-foreground">R$ {selectedPlan.price}/mês · {selectedPlan.animals} animais por mês</p>
            </div>
            <button onClick={() => setCheckoutPlan(selectedPlan)} className="shrink-0 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
              <CreditCard size={16} /> Ir para pagamento
            </button>
          </div>
        )}
        <div className="border-t border-border pt-10">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Animais dos Membros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {memberAnimals.map(pet => <AnimalCard key={pet.id} pet={pet} onViewMore={onViewMore} liked={likedIds.has(pet.id)} onToggleLike={onToggleLike} />)}
          </div>
        </div>
      </div>
      {checkoutPlan && <CheckoutModal plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} />}
    </main>
  );
}

// ─── Terms text ───────────────────────────────────────────────────────────────

const TERMS_TEXT = `AUSÊNCIA DE GARANTIA DE SUCESSO DA MONTA
O usuário declara estar ciente de que o PetAlliance não garante, sob nenhuma hipótese, o sucesso do cruzamento, a compatibilidade biológica ou comportamental entre os animais, tampouco a ocorrência de gestação.

ISENÇÃO DE RESPONSABILIDADE SOBRE A SAÚDE DOS ANIMAIS E FILHOTES
A plataforma não realiza exames clínicos, triagem médica ou verificação de saúde nos animais cadastrados. É de responsabilidade exclusiva e obrigatória dos respectivos tutores verificar o estado de saúde, o histórico de vacinação e realizar os exames genéticos e clínicos necessários antes de qualquer aproximação física. O PetAlliance exime-se de qualquer responsabilidade por doenças de pele, infecções, vírus, lesões físicas decorrentes de brigas, óbito de animais, complicações no parto ou quaisquer doenças genéticas, congênitas ou hereditárias que venham a acometer os filhotes resultantes do cruzamento.

AUTENTICIDADE, PUREZA GENÉTICA E PEDIGREE
O PetAlliance não faz auditoria, não valida e não emite certificados de pureza racial ou pedigree. As informações sobre a raça, linhagem e características dos animais são inseridas por conta e risco de cada usuário. A plataforma não se responsabiliza por declarações falsas, omissões ou equívocos cometidos pelos usuários quanto à árvore genealógica ou padrão estético do animal.

Ao aceitar estes Termos, o usuário concorda em isentar o PetAlliance, seus fundadores e administradores de qualquer pleito judicial, extrajudicial, custos veterinários, indenizações por danos materiais ou morais decorrentes dos encontros agendados através da plataforma.

CLÁUSULA DA REMUNERAÇÃO DOS SERVIÇOS DE TECNOLOGIA

Objeto da Cobrança: Os valores cobrados pelo PetAlliance (seja por planos de assinatura, créditos ou recursos de destaque) referem-se estritamente à licença de uso das ferramentas tecnológicas de busca, filtros e aproximação de perfis dentro da plataforma.

Independência do Resultado: A assinatura ou pagamento de taxas não vincula a plataforma a qualquer garantia de resultado biológico, sucesso de acasalamento ou nascimento de filhotes. O serviço é considerado integralmente prestado e consumido a partir do momento em que as ferramentas tecnológicas de interação são disponibilizadas ao usuário.

Vedação de Comércio: É expressamente proibida a utilização do ecossistema de pagamentos do aplicativo para a comercialização de animais, taxas de cobertura (monta) ou venda de filhotes. Qualquer transação financeira realizada entre usuários de forma externa é de responsabilidade civil e criminal exclusiva dos envolvidos.`;

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({ setPage, onLogin }: { setPage: (p: Page) => void; onLogin: (u: AppUser) => void }) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.replace(/\D/g, "").length !== 11) { setError("CPF inválido."); return; }
    if (senha.length < 6) { setError("Senha deve ter ao menos 6 caracteres."); return; }
    onLogin({ nome: "Usuário Demo", email: "demo@petalliance.com", cpf, cep: "01310-100" });
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"><PawPrint className="text-primary" size={28} /></div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">Entre com seu CPF e senha</p>
        </div>
        <form onSubmit={handle} className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4 shadow-sm">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">CPF</label>
            <input type="text" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))}
              className="w-full bg-input-background rounded-xl px-4 py-3 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Senha</label>
            <input type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)}
              className="w-full bg-input-background rounded-xl px-4 py-3 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Entrar</button>
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <button type="button" onClick={() => setPage("register")} className="text-primary font-semibold hover:underline">Cadastre-se</button>
          </p>
        </form>
      </div>
    </main>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────

function RegisterPage({ setPage, onLogin }: { setPage: (p: Page) => void; onLogin: (u: AppUser) => void }) {
  const [form, setForm] = useState({ nome: "", email: "", cpf: "", cep: "", senha: "" });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [termsRead, setTermsRead] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (k === "cpf") v = formatCPF(v);
    if (k === "cep") v = formatCEP(v);
    setForm(f => ({ ...f, [k]: v }));
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleTermsScroll = () => {
    const el = termsRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) setTermsRead(true);
  };

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { setError("Nome é obrigatório."); return; }
    if (!form.email.includes("@")) { setError("Email inválido."); return; }
    if (form.cpf.replace(/\D/g, "").length !== 11) { setError("CPF inválido."); return; }
    if (form.cep.replace(/\D/g, "").length !== 8) { setError("CEP inválido."); return; }
    if (form.senha.length < 6) { setError("Senha deve ter ao menos 6 caracteres."); return; }
    if (!termsAccepted) { setError("Você deve aceitar os termos para continuar."); return; }
    setDone(true);
    setTimeout(() => { onLogin({ nome: form.nome, email: form.email, cpf: form.cpf, cep: form.cep, avatar: avatar ?? undefined }); }, 1500);
  };

  if (done) return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="text-primary" size={32} /></div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Cadastro realizado!</h2>
        <p className="text-muted-foreground">Entrando em sua conta...</p>
      </div>
    </main>
  );

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"><PawPrint className="text-primary" size={28} /></div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Crie sua conta</h1>
          <p className="text-muted-foreground">Junte-se à comunidade PetAlliance</p>
        </div>
        <form onSubmit={handle} className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-5 shadow-sm">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

          {/* Avatar upload */}
          <div className="flex items-center gap-5 p-4 bg-secondary rounded-2xl">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                {avatar ? <img src={avatar} alt="Foto de perfil" className="w-full h-full object-cover" /> : <User className="text-muted-foreground" size={32} />}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                <Camera size={13} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-0.5">{form.nome || "Seu nome aqui"}</p>
              <p className="text-xs text-muted-foreground truncate">{form.email || "seu@email.com"}</p>
              <button type="button" onClick={() => fileRef.current?.click()} className="mt-2 text-xs text-primary font-medium hover:underline flex items-center gap-1">
                <Upload size={11} /> {avatar ? "Alterar foto" : "Adicionar foto"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {([
              { k: "nome", label: "Nome completo", type: "text", ph: "João Silva" },
              { k: "email", label: "Email", type: "email", ph: "joao@email.com" },
              { k: "cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
              { k: "cep", label: "CEP", type: "text", ph: "00000-000" },
              { k: "senha", label: "Senha", type: "password", ph: "Mínimo 6 caracteres" },
            ] as { k: keyof typeof form; label: string; type: string; ph: string }[]).map(({ k, label, type, ph }) => (
              <div key={k}>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
                <input type={type} placeholder={ph} value={form[k]} onChange={set(k)}
                  className="w-full bg-input-background rounded-xl px-4 py-3 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
              </div>
            ))}
          </div>

          {/* Terms */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Termos de Uso <span className="text-red-500">*</span></p>
            <div ref={termsRef} onScroll={handleTermsScroll}
              className="h-40 overflow-y-auto bg-secondary rounded-xl px-4 py-3 text-xs text-muted-foreground leading-relaxed border border-border whitespace-pre-wrap">
              {TERMS_TEXT}
            </div>
            {!termsRead && <p className="text-[11px] text-muted-foreground mt-1.5">Role até o final para aceitar os termos.</p>}
            <label className={`flex items-start gap-3 mt-3 cursor-pointer ${!termsRead ? "opacity-50 pointer-events-none" : ""}`}>
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 accent-primary mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">
                Li e aceito os <strong>Termos de Uso</strong> e a <strong>Política de Privacidade</strong> do PetAlliance.
              </span>
            </label>
          </div>

          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Criar Conta</button>
          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <button type="button" onClick={() => setPage("login")} className="text-primary font-semibold hover:underline">Entrar</button>
          </p>
        </form>
      </div>
    </main>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

function ProfilePage({ user, onLogout, onUpdateUser }: { user: AppUser | null; onLogout: () => void; onUpdateUser: (u: AppUser) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<AppUser | null>(null);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setForm(user ? { ...user } : null);
    setNewAvatar(null);
    setEditing(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNewAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const saveEdit = () => {
    if (!form) return;
    const updated = { ...form, avatar: newAvatar ?? form.avatar };
    onUpdateUser(updated);
    setEditing(false);
  };

  if (!user) return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 text-center">
      <div>
        <User className="mx-auto text-muted-foreground mb-4" size={48} />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Você não está logado</h2>
        <p className="text-muted-foreground">Entre na sua conta para ver seu perfil.</p>
      </div>
    </main>
  );

  const displayAvatar = editing ? (newAvatar ?? form?.avatar) : user.avatar;

  return (
    <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary to-primary/70" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full border-4 border-card bg-muted overflow-hidden shadow-md">
                {displayAvatar
                  ? <img src={displayAvatar} alt={user.nome} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center bg-primary/10"><User className="text-primary" size={28} /></div>
                }
              </div>
              {editing && (
                <>
                  <button type="button" onClick={() => avatarRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                    <Camera size={13} />
                  </button>
                  <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </>
              )}
            </div>
            <div className="pb-1 min-w-0 flex-1">
              {editing && form
                ? <input value={form.nome} onChange={e => setForm(f => f ? { ...f, nome: e.target.value } : f)}
                    className="w-full bg-input-background rounded-xl px-3 py-1.5 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold mb-1" />
                : <h2 className="font-display text-xl font-bold text-foreground">{user.nome}</h2>
              }
              {editing && form
                ? <input value={form.email} onChange={e => setForm(f => f ? { ...f, email: e.target.value } : f)}
                    className="w-full bg-input-background rounded-xl px-3 py-1.5 text-xs border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-muted-foreground" />
                : <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              }
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">CPF</p>
              <p className="text-sm font-semibold text-foreground">{user.cpf}</p>
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">CEP</p>
              {editing && form
                ? <input value={form.cep} onChange={e => setForm(f => f ? { ...f, cep: formatCEP(e.target.value) } : f)}
                    className="w-full bg-card rounded-lg px-2 py-1 text-sm border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 font-semibold mt-0.5" />
                : <p className="text-sm font-semibold text-foreground">{user.cep}</p>
              }
            </div>
          </div>

          <div className="flex gap-3">
            {editing ? (
              <>
                <button onClick={saveEdit} className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Check size={14} /> Salvar
                </button>
                <button onClick={() => setEditing(false)} className="flex items-center gap-2 bg-secondary text-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                  <X size={14} /> Cancelar
                </button>
              </>
            ) : (
              <button onClick={startEdit} className="flex items-center gap-2 bg-secondary text-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                <Pencil size={14} /> Editar Perfil
              </button>
            )}
            <button onClick={onLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Doc Upload Field ─────────────────────────────────────────────────────────

function DocUpload({ label, accept, file, onChange }: {
  label: string; accept: string; file: string | null; onChange: (name: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div
        onClick={() => ref.current?.click()}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${file ? "border-primary bg-primary/5" : "border-dashed border-border hover:border-primary/50 bg-secondary/40"}`}
      >
        {file ? (
          <><Check size={16} className="text-primary shrink-0" /><span className="text-sm text-primary font-medium truncate">{file}</span></>
        ) : (
          <><Upload size={16} className="text-muted-foreground shrink-0" /><span className="text-sm text-muted-foreground">Clique para enviar o documento (PDF, JPG, PNG)</span></>
        )}
      </div>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => { if (e.target.files?.[0]) onChange(e.target.files[0].name); }} />
    </div>
  );
}

// ─── My Animals Page ──────────────────────────────────────────────────────────

function MyAnimalsPage({ user, setPage }: { user: AppUser | null; setPage: (p: Page) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [animalPhoto, setAnimalPhoto] = useState<string | null>(null);
  const [vaccinaFile, setVaccinaFile] = useState<string | null>(null);
  const [pedigreeFile, setPedigreeFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);

  if (!user) return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 text-center">
      <div>
        <PawPrint className="mx-auto text-muted-foreground mb-4" size={48} />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Acesso restrito</h2>
        <p className="text-muted-foreground mb-6">Entre na sua conta para gerenciar seus animais.</p>
        <button onClick={() => setPage("login")} className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Entrar</button>
      </div>
    </main>
  );

  const handleAnimalPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAnimalPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalPhoto) { setFormError("A foto do animal é obrigatória."); return; }
    if (!vaccinaFile) { setFormError("A carteira de vacinação é obrigatória."); return; }
    if (!pedigreeFile) { setFormError("O certificado de raça (pedigree) é obrigatório."); return; }
    setFormError("");
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Seus Animais</h1>
      <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 mb-6 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center shrink-0">
          {user.avatar ? <img src={user.avatar} alt={user.nome} className="w-full h-full object-cover" /> : <User className="text-primary" size={18} />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{user.nome}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      <button onClick={() => { setShowForm(f => !f); setSubmitted(false); setFormError(""); }}
        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors mb-6">
        {showForm ? <X size={15} /> : <Upload size={15} />}
        {showForm ? "Cancelar" : "Cadastrar Animal"}
      </button>

      {showForm && !submitted && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-8">
          <h2 className="font-display text-xl font-semibold text-foreground mb-1">Novo Animal</h2>
          <p className="text-xs text-muted-foreground mb-5">Campos com <span className="text-red-500 font-bold">*</span> são obrigatórios</p>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{formError}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Animal photo */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Foto do Animal <span className="text-red-500">*</span>
              </label>
              <div onClick={() => photoRef.current?.click()}
                className="relative border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors bg-secondary/40"
                style={{ height: 180 }}>
                {animalPhoto ? <img src={animalPhoto} alt="Foto do animal" className="w-full h-full object-cover" />
                  : <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground"><Upload size={28} /><p className="text-sm">Clique para enviar a foto</p></div>}
                {animalPhoto && <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><Camera className="text-white" size={24} /></div>}
              </div>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handleAnimalPhoto} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { k: "nome", label: "Nome do Animal", type: "text", ph: "Ex: Thor" },
                { k: "raca", label: "Raça", type: "text", ph: "Ex: Golden Retriever" },
                { k: "cor", label: "Cor", type: "text", ph: "Ex: Dourado" },
                { k: "peso", label: "Peso", type: "text", ph: "Ex: 30 kg" },
                { k: "nascimento", label: "Data de Nascimento", type: "date", ph: "" },
              ].map(({ k, label, type, ph }) => (
                <div key={k}>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
                  <input type={type} placeholder={ph} className="w-full bg-input-background rounded-xl px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              ))}
              {[
                { k: "sexo", label: "Sexo", opts: ["Macho", "Fêmea"] },
                { k: "tipo", label: "Tipo de Animal", opts: ["Cachorro", "Gato", "Ave", "Coelho", "Hamster", "Peixe", "Réptil", "Tartaruga", "Furão", "Porco-da-índia", "Outro"] },
                { k: "porte", label: "Porte", opts: ["Mini", "Pequeno", "Médio", "Grande", "Gigante"] },
              ].map(({ k, label, opts }) => (
                <div key={k}>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
                  <select className="w-full bg-input-background rounded-xl px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Selecione</option>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Descrição</label>
              <textarea rows={3} placeholder="Conte um pouco sobre o seu animal..." className="w-full bg-input-background rounded-xl px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>

            {/* Mandatory document uploads */}
            <div className="space-y-3 pt-2 border-t border-border">
              <p className="text-sm font-semibold text-foreground">Documentos Obrigatórios</p>
              <DocUpload
                label="Carteira de Vacinação"
                accept=".pdf,.jpg,.jpeg,.png"
                file={vaccinaFile}
                onChange={setVaccinaFile}
              />
              <DocUpload
                label="Certificado de Raça (Pedigree)"
                accept=".pdf,.jpg,.jpeg,.png"
                file={pedigreeFile}
                onChange={setPedigreeFile}
              />
              <p className="text-[11px] text-muted-foreground">
                Ambos os documentos são obrigatórios para garantir a autenticidade e segurança dos matches.
              </p>
            </div>

            <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Cadastrar Animal
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-4 flex items-center gap-3 mb-6">
          <Check className="text-primary shrink-0" size={20} />
          <p className="text-sm font-medium text-foreground">Animal cadastrado com sucesso!</p>
        </div>
      )}

      <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
        <PawPrint className="mx-auto mb-3 opacity-30" size={40} />
        <p className="text-sm">Seus animais cadastrados aparecerão aqui.</p>
      </div>
    </main>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [loggedUser, setLoggedUser] = useState<AppUser | null>(null);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [matchNotif, setMatchNotif] = useState<MatchNotification | null>(null);
  const [matchRecords, setMatchRecords] = useState<MatchRecord[]>([]);
  const [matchesOpen, setMatchesOpen] = useState(false);
  const nextMatchId = useRef(1);

  // Simulate incoming match notification after 8s
  useEffect(() => {
    const t = setTimeout(() => {
      setMatchNotif({ id: 1, pet: PETS[0], fromUser: "Carlos Mendonça", accepted: null });
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  const onToggleLike = useCallback((id: number) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleAddMatch = useCallback((record: Omit<MatchRecord, "id">) => {
    setMatchRecords(prev => [...prev, { ...record, id: nextMatchId.current++ }]);
  }, []);

  const handleAcceptMatch = () => {
    if (!matchNotif) return;
    // Mark it as accepted and apply cooldown
    handleAddMatch({
      petId: matchNotif.pet.id, petName: matchNotif.pet.name, petPhoto: matchNotif.pet.photo,
      withUser: matchNotif.fromUser, date: Date.now(), status: "accepted",
      cooldownUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
    setMatchNotif(null);
  };

  const handleLogin = (u: AppUser) => { setLoggedUser(u); setPage("home"); };
  const handleLogout = () => { setLoggedUser(null); setPage("home"); };
  const handleUpdateUser = (u: AppUser) => setLoggedUser(u);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <style>{`
        .font-display { font-family: 'Fraunces', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes slide-up { from { transform: translateY(120%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-in { animation: slide-up 0.35s ease-out; }
      `}</style>

      <NavBar
        page={page} setPage={setPage} loggedUser={loggedUser} onLogout={handleLogout}
        favCount={likedIds.size} matchRecords={matchRecords} onOpenMatches={() => setMatchesOpen(true)}
      />

      {page === "home" && (
        <HomeFeed onViewMore={setSelectedPet} likedIds={likedIds} onToggleLike={onToggleLike}
          matchNotif={matchNotif} onAcceptMatch={handleAcceptMatch} onDismissMatch={() => setMatchNotif(null)} />
      )}
      {page === "members" && <MembersPage onViewMore={setSelectedPet} likedIds={likedIds} onToggleLike={onToggleLike} />}
      {page === "favorites" && <FavoritesPage likedIds={likedIds} onViewMore={setSelectedPet} onToggleLike={onToggleLike} />}
      {page === "login" && <LoginPage setPage={setPage} onLogin={handleLogin} />}
      {page === "register" && <RegisterPage setPage={setPage} onLogin={handleLogin} />}
      {page === "profile" && <ProfilePage user={loggedUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />}
      {page === "my-animals" && <MyAnimalsPage user={loggedUser} setPage={setPage} />}

      {selectedPet && (
        <AnimalModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          matchRecords={matchRecords}
          onAddMatch={handleAddMatch}
        />
      )}

      {matchesOpen && (
        <MatchesPopup records={matchRecords} onClose={() => setMatchesOpen(false)} />
      )}
    </div>
  );
}
