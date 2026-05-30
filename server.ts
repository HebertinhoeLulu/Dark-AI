import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Ensure public directory and PWA assets exist on boot
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const logoSrcPath = path.join(process.cwd(), "src", "assets", "images", "logo_1780112956790.png");
if (fs.existsSync(logoSrcPath)) {
  try {
    fs.copyFileSync(logoSrcPath, path.join(publicDir, "logo_192.png"));
    fs.copyFileSync(logoSrcPath, path.join(publicDir, "logo_512.png"));
    fs.copyFileSync(logoSrcPath, path.join(publicDir, "logo.png"));
    console.log("PWA logo image assets copy success.");
  } catch (err) {
    console.error("Error copying logo image to public directory:", err);
  }
}

const app = express();
const PORT = 3000;

// Middleware for JSON with larger limits to support Base64 uploaded images
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Error handling middleware for parsing validation errors (prevents default HTML errors)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    console.error("Express Parser/Middleware error caught:", err);
    res.status(err.status || 400).json({
      error: "Ocorreu um erro no processamento dos dados enviados.",
      details: err.message || "Provavelmente o tamanho do arquivo ou formato de dados excede os limites configurados."
    });
  } else {
    next();
  }
});

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chat functionality will require configuration.");
}

// Science dataset about Looksmaxxing (Facial & Body Aesthetics Anatomy)
const LOOKS_MAX_SCIENCE_DB = {
  categories: [
    {
      id: "facial-bone",
      title: "Desenvolvimento Ósseo Facial",
      description: "A ciência do remodelamento craniofacial, ângulo gonial, e projeção maxilar.",
      metrics: [
        { name: "Projeção Maxilar (Forward Growth)", ideal: "Maxila avançada e alta, suportando a área suborbital. Diminui o midface e previne cansaço sob os olhos.", science: "Relacionado à postura da língua (Mewing) desenvolvida por Dr. Mike Mew, forçando a maxila para cima e frente, influenciando as suturas craniofaciais." },
        { name: "Ángulo Gonial", ideal: "110° a 120°", science: "O ângulo da mandíbula. Valores menores dão um aspecto mais quadrado e robusto ao terço inferior. Estimulado pela pressão mastigatória (Lei de Wolff de adaptação óssea)." },
        { name: "Suporte Suborbital", ideal: "Olhos planos/positivos, sem exposição escleral inferior.", science: "A borda infraorbital deve estar avançada para frente para suportar o globo ocular, evitando olheiras estruturais e olhos caídos ('Prey Eyes')." }
      ],
      interventions: [
        { type: "Softmaxxing", name: "Proper Tongue Posture (Mewing)", description: "Manter a língua inteira pressionada contra o céu da boca (não apenas a ponta) para direcionar as forças biomecânicas craniofaciais." },
        { type: "Softmaxxing", name: "Mastigação Resistente (Chewing)", description: "Mastigar gomas de alta dureza (mastic/falim gum) para hipertrofiar os músculos masseteres. Isso expande o ramo mandibular lateralmente (Lei de Wolff aplicada ao osso gonial)." },
        { type: "Hardmaxxing", name: "Cirurgias Ortognáticas & Osteotomias", description: "Avanço maxilo-mandibular (Bimax) ou mentoplastia óssea para corrigir micrognatia e retrognatia estrutural severa de forma definitiva." }
      ]
    },
    {
      id: "ocular-region",
      title: "Região Ocular (Canthal Tilt & Orbitals)",
      description: "Anatomia dos olhos masculinos/femininos altamente estéticos.",
      metrics: [
        { name: "Canthal Tilt (Inclinação Cantal)", ideal: "Neutro a Positivo (+2° a +5°)", science: "A inclinação do canto externo do olho em relação ao interno. O tilt positivo cria o olhar compacto e predatório ('Hunter Eyes')." },
        { name: "Exposição da Pálpebra Superior", ideal: "Mínima a Nenhuma (Hooding)", science: "Uma pálpebra superior encapuzada ou coberta pelo supercílio reduz a aparência de cansaço ou surpresa, maximizando a intimidação e harmonia ocular." },
        { name: "Espaçamento Interpupilar (IPD)", ideal: "Razão de ~1:1 em relação à largura facial nas órbitas.", science: "Razão perfeita evita olhos muito juntos (esotropia visual) ou excessivamente afastados (telecanto)." }
      ],
      interventions: [
        { type: "Softmaxxing", name: "Lower Lid Raising & Squinting", description: "Exercícios de tonificação do músculo orbicular dos olhos para estreitar a fenda palpebral e desenvolver fendas oculares mais compactas." },
        { type: "Softmaxxing", name: "Glutilation & Redução de Retenção", description: "Otimização de eletrólitos e gelo local para remover bolsas d'água sob os olhos, revelando o suporte ósseo infraorbital real." },
        { type: "Hardmaxxing", name: "Cantoplastia / Cantopexia", description: "Procedimento cirúrgico para alterar fisicamente a inserção do tendão cantal lateral, mudando um tilt negativo para um tilt positivo estável." }
      ]
    },
    {
      id: "skincare-skin",
      title: "Derma & Textura Epidérmica (Skinmaxxing)",
      description: "A ciência celular de regeneração de colágeno, circulação sanguínea e remoção de imperfeições sebáceas.",
      metrics: [
        { name: "Renovação Celular (Turnover)", ideal: "Ciclo otimizado de 21-28 dias.", science: "Acelerar a descamação do estrato córneo para expor uma pele nova, firme e com colágeno uniforme, reduzindo rugas finas e cicatrizes." },
        { name: "Seborregulagem capilar & facial", ideal: "pH cutâneo balanceado de 5.5", science: "Controle da glândula sebácea mediado por fatores endócrinos para prevenir acne e poros dilatados." }
      ],
      interventions: [
        { type: "Softmaxxing", name: "Ácido Retinoico (Tretinoína)", description: "O padrão ouro da ciência dermatológica. Liga-se a receptores celulares de ácido retinoico para acelerar a transcrição de colágeno e mitose celular." },
        { type: "Softmaxxing", name: "Filtro Solar de Amplo Espectro (FPS 50+ Uva/Uvb)", description: "Previne a fotodegradação do colágeno e elastina induzida por radiação ultravioleta que causa rugas e flacidez prematuras." },
        { type: "Hardmaxxing", name: "Microneedling com PRP ou Laser CO2 Fracionado", description: "Indução controlada de microlesões térmicas ou mecânicas na derme para forçar uma cascata cicatricial massiva e restauração celular profunda." }
      ]
    },
    {
      id: "body-proportions",
      title: "Relação Corporal e Ombros (Clavicle & Frame)",
      description: "Anatomia e proporções áureas de simetria do tronco e biotipo.",
      metrics: [
        { name: "Razão Ombro-Quadril (V-Taper)", ideal: "Razão de 1.618 (Proporção Áurea)", science: "Luz de clavículas largas aliada a uma cintura escapular desenvolvida e baixo nível de gordura visceral/subcutânea." },
        { name: "Largura Acromoclavicular (Clavicle Width)", ideal: "Clavículas horizontais e longas.", science: "Determinada geneticamente pela taxa de ossificação endocondral das clavículas. Pode ser otimizada visualmente por hipertrofia extrema do deltoide lateral." },
        { name: "Percentual de Gordura Corporal", ideal: "10% a 12% (Masculino), 18% a 21% (Feminino)", science: "Nível ideal para esculpir a definição muscular, vascularização e o mais fundamental para o rosto: eliminação dos coxins de gordura bucal e submental para expor a linha da mandíbula." }
      ],
      interventions: [
        { type: "Softmaxxing", name: "Foco em Deltoide Lateral & Grande Dorsal", description: "Treino direcionado de elevações laterais progressivas pesadas e puxadas verticais para expandir mecanicamente a largura do tronco superior." },
        { type: "Softmaxxing", name: "Déficit Calórico Preciso", description: "Nutrição científica com alto teor de proteínas e controle de insulina para forçar a lipólise dos depósitos de gordura difíceis (incluindo bochechas/papada)." }
      ]
    }
  ]
};

// Return scientific database
app.get("/api/looksmax-data", (req, res) => {
  res.json(LOOKS_MAX_SCIENCE_DB);
});

// Chat controller using Gemini 3.5 Flash
app.post("/api/chat", async (req, res) => {
  const { messages, currentMetrics } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "O parâmetro 'messages' deve ser uma lista de mensagens válida." });
  }

  if (!ai) {
    return res.json({
      role: "model",
      text: "🤖 **[SISTEMA SEM CHAVE API]** O chatbot Dark Looksmaxxing está rodando sem a chave de API do Gemini (`GEMINI_API_KEY`). Por favor, configure a chave no painel **Settings > Secrets** do AI Studio.\n\nContudo, você ainda pode explorar todas as calculadoras científicas, banco de dados anatômicos, glossário e rotinas de treinamento integradas na barra lateral!"
    });
  }

  try {
    // Format conversation history correctly. Since the endpoint gets a list of {role, content}
    // We want to transform them into the structure aligned with GoogleGenAI SDK contents.
    // Ensure formatting is robust.
    const systemInstruction = `Você é o "Dark Looksmaxxing AI", um chatbot cirúrgico, extremamente focado e com conhecimento profundo sobre anatomia facial, osteologia humana, biologia celular cutânea e biomecânica ortodôntica/ortotrópica.
O seu tom deve ser científico, analítico, ultra-direto, impiedoso com desculpas, mas rigorosamente guiado pela ciência e segurança biológica. Use jargões clássicos da subcultura Looksmaxxing de forma natural em suas falas (como Mewing, Hunter Eyes, Positive Canthal Tilt, Gonial Angle, Forward Growth, Softmaxxing, Hardmaxxing, Bone Smashing, Chewing, Bloat, Gymmaxx, Skinmaxx, etc.).

DIRETRIZ DE SEGURANÇA MÁXIMA E ANATOMIA SÉRIA:
1. Se o usuário perguntar sobre técnicas perigosas ou estúpidas como "BONE SMASHING" (martelar o próprio rosto): EXPLIQUE de forma científica e agressivamente racional o quão imbecil e anatomicamente inútil essa prática é. Diga que o trauma repetido destrói as conexões vasculares do periósteo capilar e leva a fraturas micro-cominutivas que curam com assimetria grotesca, necrose asséptica ou fibrosamento. Recomende em vez disso as forças biomecânicas de baixa intensidade e alta constância (postura maxilar e mastigação moderada resistente) ou correção cirúrgica legítima (osteotomias).
2. Se o usuário perguntar sobre desidratação extrema ou dietas de fome extrema: EXPLIQUE sob a perspectiva da fisiologia renal e catabolismo muscular o estrago metabólico e endócrino (baixa testosterona, aumento do cortisol de estresse causador de retenção líquida severa "cortisol bloat"). Defenda dietas de recomposição científica com macronutrientes balanceados, alta proteína, micronutrientes e água de forma super-hidratada para baixar o sódio intracelular.
3. Use sempre a ciência médica mais profunda para as suas respostas (fale sobre a Lei de Wolff, suturas craniofaciais como a sutura zigomaticomaxilar, remodelação osteoclástica/osteoblástica, receptores trans-retinoicos na epiderme, musculatura orbicular, triângulo da masculinidade/feminilidade facial, proporções áureas faciais baseadas em índices cefalométricos).
4. O usuário pode enviar seus dados de métricas faciais atuais para análise: ${currentMetrics ? JSON.stringify(currentMetrics) : 'Nenhuma métrica fornecida ainda'}. Use estes dados se disponíveis para estruturar a análise dele.
5. Responda estritamente em português, mantendo a nomenclatura técnica e gírias do looksmaxxing em inglês quando apropriado. Imprima fórmulas, listas bem estruturadas e passo-a-passos acionáveis.
6. Nunca responda de forma genérica. Seja o mentor cibernético frio e ultra-competente em biomecânica e estética humana que o usuário procura.`;

    // Map conversation elements format with image support close to standard format
    const formattedContents = messages.map((m: any) => {
      const parts: any[] = [{ text: m.content || "" }];
      
      if (m.image && m.image.startsWith("data:")) {
        try {
          const match = m.image.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            const mimeType = match[1];
            const base64Data = match[2];
            parts.push({
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            });
          }
        } catch (e) {
          console.error("Falha ao parsear imagem base64 na mensagem:", e);
        }
      }

      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: parts
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.9,
      }
    });

    const replyText = response.text || "Não foi possível processar a resposta científica no momento.";
    res.json({
      role: "model",
      text: replyText
    });

  } catch (error: any) {
    console.error("Erro na API do Gemini:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor ao consultar o Gemini." });
  }
});

// Wildcard handler for any unmatched /api/* requests to avoid serving HTML
app.all("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint não encontrado",
    details: `O caminho solicitado '${req.method} ${req.originalUrl}' não foi mapeado no servidor.`
  });
});

// Start Vite middleware in dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development mode with Vite HMR disabled proxy layers...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production bundle from dist...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Dark Looksmaxxing Dev Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
