import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../_shared/componentes/navegacion/header.component';
import { FooterComponent } from '../../_shared/componentes/navegacion/footer.component';
import { BotonComponent } from '../../_shared/componentes/botones/boton.component';
import { TextoNormalComponent } from '../../_shared/componentes/texto/texto-normal.component';
import { TextoPequenoComponent } from '../../_shared/componentes/texto/texto-pequeno.component';
import { MapaService } from '../../_services/mapa-store';
import { NavigationService } from '../../_services/navigation-store';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, BotonComponent, TextoNormalComponent, TextoPequenoComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header></app-header>

      <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-10 flex flex-col">
        <div class="flex items-center justify-between gap-4 mb-8">
          <div class="flex flex-col gap-1">
            <texto-normal>Mapa de relaciones — visualización de red.</texto-normal>
            @if (termino) {
              <texto-pequeno>Búsqueda: <span class="font-medium text-stone-700">{{ termino }}</span></texto-pequeno>
            }
          </div>
          <app-boton etiqueta="Volver al catálogo" tamanio="sm" (presionado)="volverCatalogo()"/>
        </div>

        @if (!tieneDatos) {
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center py-12">
              <texto-pequeno>No se hizo ninguna consulta.</texto-pequeno>
            </div>
          </div>
        } @else {
          <div class="flex-1 flex flex-col gap-4">
            <div class="flex-1 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden relative min-h-[500px]">
              <div #networkContainer class="absolute inset-0"></div>
            </div>
            @if (nodoSeleccionado) {
              <div class="bg-white rounded-xl border border-amber-200 shadow-sm p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-stone-800">{{ nodoSeleccionado.label }}</span>
                  <span class="px-2 py-0.5 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                    Relevancia: {{ nodoSeleccionado.value }}
                  </span>
                </div>
                <p class="text-sm text-stone-600 mb-3">{{ nodoSeleccionado.data?.razon ?? 'Sin descripción' }}</p>
                <app-boton etiqueta="Ver en catálogo" tamanio="sm" (presionado)="verEnCatalogo(nodoSeleccionado.id)"/>
              </div>
            }
          </div>
        }
      </main>

      <app-footer/>
    </div>
  `,
  styles: [`
    .vis-tooltip {
      display: none !important;
    }
  `],
})
export class MapaComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly mapaService = inject(MapaService);
  private readonly navigationService = inject(NavigationService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('networkContainer', { static: false }) containerRef!: ElementRef;

  private network: Network | null = null;
  tieneDatos = false;
  termino = '';
  nodoSeleccionado: any = null;

  ngOnInit(): void {
    // @ts-ignore
    const { nodos, termino } = this.mapaService.store.getState();
    this.termino = termino;
    this.tieneDatos = Array.isArray(nodos) && nodos.length > 0;
  }

  ngAfterViewInit(): void {
    if (!this.tieneDatos) return;

    const { nodos, edges: rawEdges } = this.mapaService.store.getState();

    const nodosProcesados = nodos.map((n: any) => ({
      ...n,
      title: undefined,
    }));

    const nodes = new DataSet(nodosProcesados);
    const edges = new DataSet(rawEdges);

    const data = { nodes, edges };

    this.network = new Network(this.containerRef.nativeElement, data, {
      nodes: {
        shape: 'dot',
        size: 30,
        font: { size: 14, color: '#292524' },
        borderWidth: 2,
        shadow: { enabled: true, size: 8 },
      },
      edges: {
        width: 2,
        color: { color: '#d6d3d1', highlight: '#b45309' },
        smooth: { enabled: true, type: 'continuous', roundness: 0.5 },
      },
      physics: {
        stabilization: { iterations: 100 },
        solver: 'forceAtlas2Based',
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
    });

    this.network.on('click', (params: any) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodes.get(nodeId) as any;
        if (node?.id) {
          console.log(node.id);
          this.nodoSeleccionado = node;
          this.cdr.detectChanges();
        }
      } else {
        this.nodoSeleccionado = null;
        this.cdr.detectChanges();
      }
    });
  }

  verEnCatalogo(libroId: string): void {
    this.navigationService.store.getState().seleccionarLibro(libroId);
    this.router.navigate(['/catalogo', libroId]);
  }

  volverCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }
}
