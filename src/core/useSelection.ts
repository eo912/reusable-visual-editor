import { useCallback, useState } from "react";
import type { ElementId } from "../types";

export function useSelection() {
  const [selected, setSelected] = useState<ElementId | null>(null);
  const select = useCallback((id: ElementId | null) => setSelected(id), []);
  return { selected, select };
}
