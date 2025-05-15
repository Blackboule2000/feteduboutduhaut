import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { SMTPClient } from "npm:emailjs@4.0.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const smtp = new SMTPClient({
  user: Deno.env.get("SMTP_USER"),
  password: Deno.env.get("SMTP_PASSWORD"),
  host: Deno.env.get("SMTP_HOST"),
  port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
  tls: true,
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

async function generateReport() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Statistiques des dernières 24h
  const { data: dailyStats } = await supabase
    .from("stats")
    .select("*")
    .gte("created_at", yesterday.toISOString());

  // Messages de contact non lus
  const { data: unreadMessages } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("read", false);

  // Statistiques par page
  const pageViews = dailyStats?.reduce((acc: Record<string, number>, curr) => {
    acc[curr.page_view] = (acc[curr.page_view] || 0) + curr.view_count;
    return acc;
  }, {});

  // Statistiques par pays
  const countryStats = dailyStats?.reduce((acc: Record<string, number>, curr) => {
    if (curr.country) {
      acc[curr.country] = (acc[curr.country] || 0) + curr.view_count;
    }
    return acc;
  }, {});

  const totalVisits = dailyStats?.reduce((sum, curr) => sum + curr.view_count, 0) || 0;

  return `
    <h2>Rapport des dernières 24 heures</h2>
    <p>Période: ${yesterday.toLocaleDateString()} - ${now.toLocaleDateString()}</p>
    
    <h3>Vue d'ensemble</h3>
    <ul>
      <li>Visites totales: ${totalVisits}</li>
      <li>Messages non lus: ${unreadMessages?.length || 0}</li>
    </ul>

    <h3>Visites par page</h3>
    <ul>
      ${Object.entries(pageViews || {})
        .map(([page, count]) => `<li>${page}: ${count} visites</li>`)
        .join("")}
    </ul>

    <h3>Répartition géographique</h3>
    <ul>
      ${Object.entries(countryStats || {})
        .map(([country, count]) => `<li>${country}: ${count} visites</li>`)
        .join("")}
    </ul>

    ${unreadMessages?.length ? `
      <h3>Derniers messages non lus</h3>
      <ul>
        ${unreadMessages.map(msg => `
          <li>
            <strong>${msg.name}</strong> (${msg.email})<br>
            ${msg.message.substring(0, 100)}...
          </li>
        `).join("")}
      </ul>
    ` : ""}
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const report = await generateReport();

    await smtp.send({
      from: Deno.env.get("SMTP_FROM"),
      to: Deno.env.get("ADMIN_EMAIL"),
      subject: `Rapport statistiques - Fête du Bout du Haut`,
      text: "Voir la version HTML",
      html: report,
    });

    return new Response(
      JSON.stringify({ message: "Rapport envoyé avec succès" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de l'envoi du rapport" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});