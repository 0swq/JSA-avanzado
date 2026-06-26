import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Injectable } from '@angular/core';

export interface MapaState {
  termino: string;
  nodos: any[];
  edges: any[];
  setTermino: (termino: string) => void;
  setNodos: (nodos: any[]) => void;
  setEdges: (edges: any[]) => void;
}

export const mapaStore = createStore<MapaState>()(
  persist(
    (set) => ({
      termino: '',
      nodos: [],
      edges: [],
      setTermino: (termino) => set({ termino }),
      setNodos: (nodos) => set({ nodos }),
      setEdges: (edges) => set({ edges }),
    }),
    {
      name: 'mapa-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        termino: state.termino,
        nodos: state.nodos,
        edges: state.edges,
      }),
    }
  )
);

@Injectable({ providedIn: 'root' })
export class MapaService {
  readonly store = mapaStore;
}
