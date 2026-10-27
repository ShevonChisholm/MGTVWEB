import { useLocation } from "react-router";
import { catalogMode, type CatalogKind } from "@/lib/catalogDemand";
export function useCatalogDemand(kind:CatalogKind){const {pathname}=useLocation();return catalogMode(kind,pathname);}
