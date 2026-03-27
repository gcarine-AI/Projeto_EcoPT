import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

interface FAQItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatCardModule, MatDivider],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class FAQComponent {
  faqs: FAQItem[] = [
    {
      question: 'O que é a Pegada Carbónica?',
      answer: 'É a quantidade total de gases de efeito estufa (incluindo dióxido de carbono e metano) gerada pelas nossas ações diárias.'
    },
    {
      question: 'Como é feito o cálculo no EcoPT?',
      answer: 'Utilizamos fatores de emissão médios para Portugal. O cálculo baseia-se nos quilómetros percorridos, tipo de dieta e consumo energético da habitação.'
    },
    {
      question: 'Os meus dados estão seguros?',
      answer: 'Sim, todos os dados de cálculo são privados e associados apenas à tua conta pessoal, protegidos por autenticação JWT.'
    },
    {
      question: 'Qual é a média de emissões em Portugal?',
      answer: 'Em média, um cidadão português emite cerca de 5.1 toneladas de CO₂ por ano. O objetivo europeu é reduzir este valor drasticamente até 2030.'
    },
    {
      question: 'Como posso editar um cálculo errado?',
      answer: 'Podes ir ao separador "Histórico" e clicar no ícone de lápis (editar) para corrigir qualquer valor inserido anteriormente.'
    },
    {
    question: 'O que é uma compensação de emissões de carbono?',
    answer: 'É um mecanismo onde se investe em projetos que removem ou evitam a emissão de CO2 (como reflorestação ou energias renováveis) para equilibrar as emissões que não conseguimos eliminar no nosso dia a dia.'
  },
  {
    question: 'Como deve ser feita uma compensação carbónica?',
    answer: 'Primeiro deve-se medir (usando a nossa calculadora), depois reduzir o máximo possível e, só então, compensar o restante através de créditos de carbono certificados.'
  },
  {
    question: 'Como garantir a qualidade dos créditos de carbono?',
    answer: 'Deve-se procurar créditos verificados por normas internacionais como o Gold Standard ou o Verified Carbon Standard (VCS), que garantem que a redução de emissões é real, adicional e permanente.'
  },
  {
    question: 'Porque usamos a unidade "CO2 equivalente"?',
    answer: 'É uma unidade criada pelo IPCC para comparar diferentes gases (como metano ou óxido nitroso). Cada gás tem um potencial de aquecimento diferente, e o CO2e reduz todos a uma base comum para facilitar a medição.'
  },
  {
    question: 'O que é uma DAP ou FDES?',
    answer: 'A DAP (Declaração Ambiental de Produto) ou FDES é um documento que analisa o ciclo de vida de um produto (etapas A1-A3: extração e fabrico). Ajuda a entender o impacto ambiental de materiais antes mesmo de chegarem ao consumidor.'
  },
  {
    question: 'A reciclagem está incluída no cálculo?',
    answer: 'Sim, a reciclagem reduz a pegada pois evita a extração de matérias-primas virgens e reduz o desperdício, embora o processo de reciclagem em si também tenha um custo energético menor.'
  },
  {
    question: 'Como seria viver num país desenvolvido com baixa pegada?',
    answer: 'Significaria ter cidades desenhadas para peões/bicicletas, energia 100% renovável, dietas baseadas em produtos locais/sazonais e uma economia circular onde o lixo é quase inexistente.'
  }
  ];
}
