# Sistema de Controle de Frota - Frontend Simples

## Descrição

Projeto simples para controle de frota veicular desenvolvido usando apenas **HTML**, **CSS** e **JavaScript** puro. 

Este sistema permite o cadastro, busca, exibição e gerenciamento de veículos e abastecimentos, além de gerar relatórios customizados, tudo no front-end sem dependência de backend.

---

## Funcionalidades

- Geração de IDs únicos para registros  
- Organização da interface por abas  
- Atualização dinâmica do dashboard com dados atuais  
- Busca de veículos e abastecimentos por filtros  
- Atualização dinâmica das tabelas de veículos e abastecimentos  
- Paginação para melhor navegação dos dados  
- População de selects para escolha de veículos  
- Exibição e ocultação dos formulários de cadastro  
- Manipulação do envio dos formulários (cadastro e edição)  
- Geração de relatórios por período e por veículo  
- Exportação dos relatórios gerados  
- Formatação de datas para exibição amigável  
- Salvamento dos dados localmente (ex: localStorage)  

---

## Tecnologias Utilizadas

- **HTML5** para estrutura da página  
- **CSS3** para estilização e layout responsivo  
- **JavaScript (ES6+)** para lógica e interatividade  
- Não há uso de frameworks ou bibliotecas externas  
- Dados armazenados localmente no navegador (localStorage)  

---

## Estrutura do Projeto

- `index.html` - página principal com a interface do sistema  
- `styles.css` - estilos para o layout e componentes  
- `app.js` - lógica principal com todas as funções mencionadas:  
  - `generateId`  
  - `setupEventListeners`  
  - `showTab`  
  - `updateDashboard`  
  - `searchVeiculos`  
  - `searchAbastecimentos`  
  - `updateVeiculosTable`  
  - `updateAbastecimentosTable`  
  - `paginate`  
  - `updatePagination`  
  - `populateVeiculoSelects`  
  - `showVeiculoForm` / `hideVeiculoForm`  
  - `handleVeiculoSubmit`  
  - `showAbastecimentoForm` / `hideAbastecimentoForm`  
  - `handleAbastecimentoSubmit`  
  - `gerarRelatorioPeriodo`  
  - `gerarRelatorioVeiculo`  
  - `exportarRelatorio`  
  - `formatarData`  
  - `saveData`  

---

## Como usar

1. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge, etc).  
2. Navegue pelas abas para cadastrar veículos e abastecimentos.  
3. Use os campos de busca para filtrar os registros.  
4. Gere relatórios customizados para análise.  
5. Os dados ficam salvos localmente no navegador, permitindo continuidade entre sessões.  

---

## Próximos passos e melhorias

- Implementar backend para persistência real dos dados  
- Autenticação de usuários  
- Módulo mobile ou versão responsiva aprimorada  
- Melhoria na exportação de relatórios (ex: PDF)  
- Integração com APIs externas para dados adicionais  

...


## Preview do Relatório

![Preview do Relatório](https://github.com/BetinRibeiro/controle_frota/blob/main/assets/icons/preview.png?raw=true)


---

## Autor

Rogoberto Ribeiro - Betinho

---

## Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais informações.
