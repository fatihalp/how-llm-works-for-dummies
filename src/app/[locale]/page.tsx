"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Brain, Layers, Zap, Sun, Moon, Menu } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { I18nProvider, useI18n } from "@/i18n/context";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Button,
  LinearProgress,
  Drawer,
  Fab,
  useMediaQuery,
} from "@mui/material";

import Overview from "@/components/sections/Overview";
import Tokenization from "@/components/sections/Tokenization";
import Embedding from "@/components/sections/Embedding";
import LayerNorm from "@/components/sections/LayerNorm";
import SelfAttention from "@/components/sections/SelfAttention";
import MLP from "@/components/sections/MLP";
import TransformerBlock from "@/components/sections/TransformerBlock";
import Softmax from "@/components/sections/Softmax";
import Output from "@/components/sections/Output";
import Training from "@/components/sections/Training";
import Inference from "@/components/sections/Inference";

// ─── data ────────────────────────────────────────────────────────────────────

const sections = [
  { id: "overview",      titleKey: "nav.overview",     icon: Brain,  slidesCount: 3 },
  { id: "tokenization",  titleKey: "nav.tokenization",  icon: Zap,    slidesCount: 3 },
  { id: "embedding",     titleKey: "nav.embedding",     icon: Layers, slidesCount: 3 },
  { id: "layernorm",     titleKey: "nav.layernorm",     icon: Layers, slidesCount: 3 },
  { id: "attention",     titleKey: "nav.attention",     icon: Zap,    slidesCount: 3 },
  { id: "mlp",           titleKey: "nav.mlp",           icon: Zap,    slidesCount: 3 },
  { id: "transformer",   titleKey: "nav.transformer",   icon: Brain,  slidesCount: 3 },
  { id: "softmax",       titleKey: "nav.softmax",       icon: Zap,    slidesCount: 3 },
  { id: "output",        titleKey: "nav.output",        icon: Layers, slidesCount: 3 },
  { id: "training",      titleKey: "nav.training",      icon: Brain,  slidesCount: 3 },
  { id: "inference",     titleKey: "nav.inference",     icon: Zap,    slidesCount: 2 },
];

const sectionComponents: Record<string, React.FC<{ slide: number }>> = {
  overview:     Overview     as any,
  tokenization: Tokenization as any,
  embedding:    Embedding    as any,
  layernorm:    LayerNorm    as any,
  attention:    SelfAttention as any,
  mlp:          MLP          as any,
  transformer:  TransformerBlock as any,
  softmax:      Softmax      as any,
  output:       Output       as any,
  training:     Training     as any,
  inference:    Inference    as any,
};

// ─── WhatsApp icon ────────────────────────────────────────────────────────────

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.859-4.417 9.862-9.859.002-2.638-1.023-5.117-2.884-6.98C16.772 1.898 14.293.87 11.661.87 6.223.87 1.802 5.289 1.799 10.73c-.001 1.758.463 3.475 1.347 4.996l-.993 3.63 3.733-.979a9.87 9.87 0 0 0 4.261 1.018zm6.518-12.753c-.279-.624-.573-.636-.838-.647l-.714-.008c-.248 0-.651.093-.992.467-.341.373-1.302 1.272-1.302 3.102 0 1.83 1.333 3.595 1.519 3.843.186.248 2.624 4.009 6.357 5.617 3.11 1.34 3.743 1.074 4.425.981.683-.093 2.2-.899 2.51-1.768.31-.869.31-1.614.217-1.768-.093-.155-.341-.248-.714-.435-.372-.187-2.2-1.085-2.54-1.21-.341-.124-.589-.187-.838.187-.248.373-.961 1.21-1.178 1.459-.217.248-.434.279-.806.093-.373-.187-1.57-.578-2.99-1.848-1.105-.986-1.853-2.202-2.07-2.575-.217-.373-.023-.574.164-.76.168-.168.373-.435.559-.652.186-.217.248-.373.372-.622.124-.248.062-.466-.031-.652-.093-.187-.806-1.942-1.116-2.692z"/>
  </svg>
);

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

// ─── AppContent ───────────────────────────────────────────────────────────────

function AppContent() {
  const router = useRouter();
  const params = useParams();
  const { t, locale, setLocale } = useI18n();

  // ── theme ──────────────────────────────────────────────────────────────────
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  const customTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: { main: "#0071e3" },
          background: {
            default: themeMode === "dark" ? "#0b0f19" : "#f5f5f7",
            paper:   themeMode === "dark" ? "#111827" : "#ffffff",
          },
          text: {
            primary:   themeMode === "dark" ? "#f3f4f6" : "#1d1d1f",
            secondary: themeMode === "dark" ? "#9ca3af" : "#86868b",
          },
        },
        typography: {
          fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        },
      }),
    [themeMode]
  );

  // ── responsive – must be called AFTER theme is created, but UNCONDITIONALLY ─
  const isMobile = useMediaQuery(customTheme.breakpoints.down("md"));

  // ── state ──────────────────────────────────────────────────────────────────
  const [currentStep,  setCurrentStep]  = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction,    setDirection]    = useState(0);
  const [sidebarOpen,  setSidebarOpen]  = useState(true); // user controls via hamburger
  const [shareUrl,     setShareUrl]     = useState("");
  const [mounted,      setMounted]      = useState(false);

  // ── effects ────────────────────────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // Note: sidebar state is user-controlled via hamburger button only.
  // No auto-sync on resize — user's choice is preserved.

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [currentStep]);

  useEffect(() => {
    if (params?.step) {
      const parsed = parseInt(params.step as string, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < sections.length) {
        setCurrentStep(parsed);
      }
    } else {
      setCurrentStep(0);
    }
  }, [params?.step]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === "light" ? "dark" : "light");
  }, []);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > currentStep ? 1 : -1);
    setCurrentStep(idx);
    setCurrentSlide(0);
    router.push(`/${locale}/${idx}`);
  }, [currentStep, locale, router]);

  const next = useCallback(() => {
    const ch = sections[currentStep];
    if (currentSlide < ch.slidesCount - 1) {
      setCurrentSlide(s => s + 1);
    } else if (currentStep < sections.length - 1) {
      setDirection(1);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setCurrentSlide(0);
      router.push(`/${locale}/${nextStep}`);
    }
  }, [currentStep, currentSlide, locale, router]);

  const prev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
    } else if (currentStep > 0) {
      setDirection(-1);
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setCurrentSlide(sections[prevStep].slidesCount - 1);
      router.push(`/${locale}/${prevStep}`);
    }
  }, [currentStep, currentSlide, locale, router]);

  // ── derived ────────────────────────────────────────────────────────────────
  const totalSlides     = sections.reduce((sum, s) => sum + s.slidesCount, 0);
  const flatIndex       = (() => { let i = 0; for (let s = 0; s < currentStep; s++) i += sections[s].slidesCount; return i + currentSlide; })();
  const progressPercent = ((flatIndex + 1) / totalSlides) * 100;
  const isFirst         = currentStep === 0 && currentSlide === 0;
  const isLast          = currentStep === sections.length - 1 && currentSlide === sections[currentStep].slidesCount - 1;

  const CurrentSection = sectionComponents[sections[currentStep].id];

  // Avoid SSR flash
  if (!mounted) return null;

  // ── sidebar content ────────────────────────────────────────────────────────
  const sidebarContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
          <Brain style={{ color: "#0071e3", width: 20, height: 20 }} />
          {t("app.title")}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
          {t("app.subtitle")}
        </Typography>
      </Box>

      {/* Nav list */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <List disablePadding>
          {sections.map((s, i) => {
            const isSelected = i === currentStep;
            return (
              <ListItem key={s.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    goTo(i);
                  }}
                  selected={isSelected}
                  sx={{
                    py: 1, px: 2, gap: 1.5,
                    "&.Mui-selected": {
                      bgcolor: themeMode === "dark" ? "grey.800" : "grey.300",
                      borderRight: 3,
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <Box sx={{
                    width: 24, height: 24, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: "bold", color: "white",
                    bgcolor: isSelected ? "primary.main" : i < currentStep ? "grey.500" : (themeMode === "dark" ? "grey.800" : "grey.400"),
                  }}>
                    {i === 0 ? "★" : (i < currentStep ? "✓" : i)}
                  </Box>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap sx={{ fontWeight: isSelected ? "bold" : "normal" }}>
                        {t(s.titleKey)}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Share footer */}
      <Box sx={{ p: 1.5, borderTop: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {locale === "tr" ? "Paylaş:" : "Share:"}
        </Typography>
        <IconButton
          size="small"
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          sx={{ color: "#25D366" }}
        >
          <WhatsAppIcon />
        </IconButton>
        <IconButton
          size="small"
          href={`mailto:?subject=${encodeURIComponent(t("app.title"))}&body=${encodeURIComponent(shareUrl)}`}
          sx={{ color: "text.secondary" }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
          </svg>
        </IconButton>
      </Box>
    </Box>
  );

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <MuiThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "background.default", color: "text.primary" }}>

        {/* ── Sidebar: Drawer on mobile, permanent panel on desktop ── */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            hideBackdrop
            sx={{ "& .MuiDrawer-paper": { width: 260 } }}
          >
            {sidebarContent}
          </Drawer>
        ) : (
          <Box
            component="aside"
            sx={{
              width: sidebarOpen ? 260 : 0,
              overflow: "hidden",
              transition: "width 0.25s ease",
              bgcolor: themeMode === "dark" ? "grey.900" : "grey.200",
              borderRight: sidebarOpen ? 1 : 0,
              borderColor: "divider",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {sidebarContent}
          </Box>
        )}

        {/* ── Main ── */}
        <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

          {/* Header */}
          <Box component="header" sx={{
            height: 56,
            bgcolor: themeMode === "dark" ? "rgba(17,24,39,0.7)" : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            zIndex: 10,
            flexShrink: 0,
          }}>
            {/* Left: hamburger + title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
              <IconButton
                onClick={() => setSidebarOpen(o => !o)}
                size="small"
                sx={{ bgcolor: themeMode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", flexShrink: 0 }}
              >
                <Menu style={{ width: 18, height: 18 }} />
              </IconButton>
              <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                {t(sections[currentStep].titleKey)}
              </Typography>
            </Box>

            {/* Right: controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
              <IconButton onClick={toggleTheme} size="small">
                {themeMode === "dark"
                  ? <Sun style={{ width: 16, height: 16 }} />
                  : <Moon style={{ width: 16, height: 16 }} />}
              </IconButton>
              <Button size="small" variant="outlined" sx={{ minWidth: 44, px: 1, py: 0.25, fontSize: "1rem" }}
                onClick={() => setLocale(locale === "en" ? "tr" : "en")}
              >
                {locale === "en" ? "🇹🇷" : "🇬🇧"}
              </Button>
              <IconButton onClick={prev} disabled={isFirst} size="small">
                <ChevronLeft style={{ width: 18, height: 18 }} />
              </IconButton>
              <IconButton onClick={next} disabled={isLast} size="small">
                <ChevronRight style={{ width: 18, height: 18 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Progress */}
          <LinearProgress variant="determinate" value={progressPercent} sx={{ flexShrink: 0 }} />

          {/* Content */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 3, md: 5 }, pb: { xs: 10, md: 10 }, position: "relative" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={sections[currentStep].id + "_" + currentSlide}
                custom={direction}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                style={{ maxWidth: 900, margin: "auto" }}
              >
                <CurrentSection slide={currentSlide} />
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* ── Floating next button ── */}
          {!isLast && (
            <Fab
              color="primary"
              onClick={next}
              sx={{
                position: "absolute",
                bottom: 24,
                right: 24,
                boxShadow: 6,
              }}
            >
              <ChevronRight style={{ width: 28, height: 28 }} />
            </Fab>
          )}
        </Box>
      </Box>
    </MuiThemeProvider>
  );
}
