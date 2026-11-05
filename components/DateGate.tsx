"use client";

import { useEffect, useState, type ReactNode } from "react";
import { parisNow } from "@/lib/shop";

/**
 * Contenu daté : rendu dans le HTML statique (prix lisibles par Google), puis masqué
 * côté client si la date du jour (heure de Paris) sort de la période, sans attendre un nouveau déploiement.
 */
export function DateGate({ from, to, children }: { from: string; to: string; children: ReactNode }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const iso = parisNow().iso;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour, connue seulement côté client
    setShow(from <= iso && iso <= to);
  }, [from, to]);
  return show ? <>{children}</> : null;
}
