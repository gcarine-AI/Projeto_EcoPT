import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface EcoTip {
  title: string;
  category: 'Transporte' | 'Alimentação' | 'Energia' | 'Recursos' | 'Compensação';
  description: string;
  icon: string;
}

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatCardModule],
  templateUrl: './tips.html',
  styleUrl: './tips.css',
})
export class TipsComponent {
  tips: EcoTip[] = [
    {
      title: 'Reduzir consumo de carne vermelha',
      category: 'Alimentação',
      description:
        'A produção de carne bovina emite muito mais CO2 do que a produção de grãos e vegetais.',
      icon: 'restaurant',
    },
    {
      title: 'Usar transportes públicos',
      category: 'Transporte',
      description:
        'Sempre que possível, opta pelo comboio, metro ou autocarro para reduzir as emissões por passageiro.',
      icon: 'directions_bus',
    },
    {
      title: 'Trocar lâmpadas por LED',
      category: 'Energia',
      description:
        'As lâmpadas LED são muito mais eficientes e duradouras do que as incandescentes.',
      icon: 'lightbulb',
    },
    {
      title: 'Preferir comida sazonal e local',
      category: 'Alimentação',
      description:
        'Frutas e legumes da época e de produtores da região reduzem o impacto do transporte e apoiam a economia local.',
      icon: 'local_grocery_store',
    },
    {
      title: 'Desligar equipamentos em standby',
      category: 'Energia',
      description:
        'Apagar luzes e retirar da tomada equipamentos que não estão a ser utilizados evita o consumo fantasma.',
      icon: 'power_off',
    },
    {
      title: 'Reduzir o consumo de água',
      category: 'Recursos',
      description:
        'Uma torneira a verter pode gastar 750L por dia. Vigia fugas e fecha a torneira enquanto lavas os dentes.',
      icon: 'water_drop',
    },
    {
      title: 'Máquinas na capacidade máxima',
      category: 'Recursos',
      description:
        'Usa as máquinas de lavar loiça e roupa apenas quando estiverem cheias para rentabilizar água e luz.',
      icon: 'local_laundry_service',
    },
    {
      title: 'Plantar árvores e reflorestar',
      category: 'Compensação',
      description:
        'Equilibra as emissões que não consegues eliminar plantando árvores ou doando para projetos de reflorestação.',
      icon: 'park',
    },
  ];
}
