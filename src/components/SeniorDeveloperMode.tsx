"use client";

import { useI18n } from "@/i18n/context";
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, useTheme } from "@mui/material";
import { ChevronDown, Code2 } from "lucide-react";

interface SeniorDeveloperModeProps {
  titleTr?: string;
  titleEn?: string;
  contentTr: React.ReactNode;
  contentEn: React.ReactNode;
}

export default function SeniorDeveloperMode({
  titleTr = "Senior Developer Modu: Gerçek Hayatta Neler Dönüyor?",
  titleEn = "Senior Developer Mode: Real-World Architecture",
  contentTr,
  contentEn,
}: SeniorDeveloperModeProps) {
  const { locale } = useI18n();
  const theme = useTheme();

  const title = locale === "tr" ? titleTr : titleEn;
  const content = locale === "tr" ? contentTr : contentEn;

  return (
    <Accordion
      disableGutters
      square={false}
      sx={{
        mt: 4,
        borderRadius: 3,
        border: 1,
        borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.300",
        bgcolor: theme.palette.mode === "dark" ? "rgba(17, 24, 39, 0.3)" : "rgba(255, 255, 255, 0.4)",
        backgroundImage: "none",
        "&:before": { display: "none" },
        overflow: "hidden"
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown style={{ color: theme.palette.text.secondary, width: 22, height: 22 }} />}
        sx={{
          py: 1,
          px: 3,
          bgcolor: theme.palette.mode === "dark" ? "rgba(17, 24, 39, 0.1)" : "rgba(0, 0, 0, 0.02)",
          "&:hover": {
            bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.04)"
          }
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Code2 style={{ color: "#0071e3", width: 22, height: 22 }} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontFamily: "monospace", 
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontWeight: "bold"
            }}
          >
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails 
        sx={{ 
          p: 3, 
          borderTop: 1, 
          borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.300",
          bgcolor: theme.palette.mode === "dark" ? "rgba(10, 15, 30, 0.4)" : "rgba(255, 255, 255, 0.5)",
          color: "text.primary",
          fontSize: "1rem",
          lineHeight: 1.7,
          fontFamily: "var(--font-sans)",
          "& p": { mb: 2 },
          "& p:last-child": { mb: 0 },
          "& code": {
            bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100",
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            fontFamily: "monospace"
          }
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {content}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
