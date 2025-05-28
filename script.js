// Gerador de ID único baseado em timestamp e random
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Configuração de paginação
const itemsPerPage = 10;
let currentVeiculosPage = 1;
let currentAbastecimentosPage = 1;
let filteredVeiculos = [];
let filteredAbastecimentos = [];

// Carregar dados do localStorage ou inicializar
let veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
let abastecimentos = JSON.parse(localStorage.getItem("abastecimentos")) || [];

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  // Atualizar dashboard
  updateDashboard();

  // Carregar tabelas
  updateVeiculosTable();
  updateAbastecimentosTable();

  // Preencher selects
  populateVeiculoSelects();

  // Configurar eventos
  setupEventListeners();
});

function setupEventListeners() {
  // Tabs
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      showTab(tabId);
    });
  });

  // Veículos
  document
    .getElementById("novo-veiculo-btn")
    .addEventListener("click", showVeiculoForm);
  document
    .getElementById("cancelar-veiculo")
    .addEventListener("click", hideVeiculoForm);
  document
    .getElementById("veiculo-form")
    .addEventListener("submit", handleVeiculoSubmit);
  document
    .getElementById("search-veiculo")
    .addEventListener("input", searchVeiculos);

  // Abastecimentos
  document
    .getElementById("novo-abastecimento-btn")
    .addEventListener("click", showAbastecimentoForm);
  document
    .getElementById("cancelar-abastecimento")
    .addEventListener("click", hideAbastecimentoForm);
  document
    .getElementById("abastecimento-form")
    .addEventListener("submit", handleAbastecimentoSubmit);
  document
    .getElementById("search-abastecimento")
    .addEventListener("input", searchAbastecimentos);

  // Relatórios
  document
    .getElementById("gerar-relatorio")
    .addEventListener("click", gerarRelatorioPeriodo);
  document
    .getElementById("gerar-relatorio-veiculo")
    .addEventListener("click", gerarRelatorioVeiculo);
  document
    .getElementById("exportar-relatorio")
    .addEventListener("click", exportarRelatorio);

  // Atualizar KM do veículo quando selecionado no abastecimento
  document.getElementById("veiculo").addEventListener("change", function () {
    const veiculoId = this.value;
    if (veiculoId) {
      const veiculo = veiculos.find((v) => v.id === veiculoId);
      if (veiculo) {
        document.getElementById("km-atual").value = veiculo.km;
      }
    }
  });

  // Paginação veículos
  document
    .getElementById("veiculos-pagination")
    .addEventListener("click", function (e) {
      if (e.target.closest("[data-page]")) {
        const page = e.target.closest("[data-page]").getAttribute("data-page");
        if (page === "prev" && currentVeiculosPage > 1) {
          currentVeiculosPage--;
        } else if (
          page === "next" &&
          currentVeiculosPage <
            Math.ceil(filteredVeiculos.length / itemsPerPage)
        ) {
          currentVeiculosPage++;
        } else if (!isNaN(page)) {
          currentVeiculosPage = parseInt(page);
        }
        updateVeiculosTable();
      }
    });

  // Paginação abastecimentos
  document
    .getElementById("abastecimentos-pagination")
    .addEventListener("click", function (e) {
      if (e.target.closest("[data-page]")) {
        const page = e.target.closest("[data-page]").getAttribute("data-page");
        if (page === "prev" && currentAbastecimentosPage > 1) {
          currentAbastecimentosPage--;
        } else if (
          page === "next" &&
          currentAbastecimentosPage <
            Math.ceil(filteredAbastecimentos.length / itemsPerPage)
        ) {
          currentAbastecimentosPage++;
        } else if (!isNaN(page)) {
          currentAbastecimentosPage = parseInt(page);
        }
        updateAbastecimentosTable();
      }
    });
}

function showTab(tabId) {
  // Esconder todas as tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Desativar todos os botões
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.remove("active");
  });

  // Mostrar tab selecionada
  document.getElementById(tabId).classList.add("active");

  // Ativar botão
  document
    .querySelector(`.tab-button[data-tab="${tabId}"]`)
    .classList.add("active");

  // Atualizar conteúdo se necessário
  if (tabId === "veiculos") {
    currentVeiculosPage = 1;
    updateVeiculosTable();
  }
  if (tabId === "abastecimentos") {
    currentAbastecimentosPage = 1;
    updateAbastecimentosTable();
  }
}

function updateDashboard() {
  // Total de veículos
  document.getElementById("total-veiculos").textContent = veiculos.length;

  // Abastecimentos do mês
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();
  const abastecimentosMes = abastecimentos.filter((a) => {
    const date = new Date(a.data);
    return date.getMonth() === mesAtual && date.getFullYear() === anoAtual;
  });

  const totalLitros = abastecimentosMes.reduce((sum, a) => sum + a.litros, 0);
  const totalValor = abastecimentosMes.reduce((sum, a) => sum + a.valor, 0);

  document.getElementById("total-abastecimentos-mes").textContent =
    totalLitros.toFixed(2) + " L";
  document.getElementById("gasto-total-mes").textContent =
    "R$ " + totalValor.toFixed(2);

  // Média de consumo (simplificado)
  if (veiculos.length > 0 && abastecimentos.length > 0) {
    const kmTotal = veiculos.reduce((sum, v) => sum + v.km, 0);
    const litrosTotal = abastecimentos.reduce((sum, a) => sum + a.litros, 0);
    const media = litrosTotal > 0 ? kmTotal / litrosTotal : 0;
    document.getElementById("media-consumo").textContent =
      media.toFixed(2) + " km/L";
  }
}

function searchVeiculos() {
  const searchTerm = document
    .getElementById("search-veiculo")
    .value.toLowerCase();

  if (searchTerm) {
    filteredVeiculos = veiculos.filter(
      (veiculo) =>
        veiculo.placa.toLowerCase().includes(searchTerm) ||
        veiculo.modelo.toLowerCase().includes(searchTerm) ||
        veiculo.marca.toLowerCase().includes(searchTerm)
    );
  } else {
    filteredVeiculos = [...veiculos];
  }

  currentVeiculosPage = 1;
  updateVeiculosTable();
}

function searchAbastecimentos() {
  const searchTerm = document
    .getElementById("search-abastecimento")
    .value.toLowerCase();

  if (searchTerm) {
    filteredAbastecimentos = abastecimentos.filter((abastecimento) => {
      const veiculo = veiculos.find((v) => v.id === abastecimento.veiculoId);
      const veiculoText = veiculo
        ? `${veiculo.placa} ${veiculo.modelo} ${veiculo.marca}`.toLowerCase()
        : "";

      return (
        veiculoText.includes(searchTerm) ||
        abastecimento.combustivel.toLowerCase().includes(searchTerm) ||
        abastecimento.data.includes(searchTerm)
      );
    });
  } else {
    filteredAbastecimentos = [...abastecimentos];
  }

  currentAbastecimentosPage = 1;
  updateAbastecimentosTable();
}

function updateVeiculosTable() {
  const tbody = document.getElementById("veiculos-table");
  tbody.innerHTML = "";

  const dataToShow = filteredVeiculos.length > 0 ? filteredVeiculos : veiculos;
  const paginatedData = paginate(dataToShow, currentVeiculosPage, itemsPerPage);

  if (paginatedData.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" class="p-4 text-center text-gray-500">Nenhum veículo encontrado</td>`;
    tbody.appendChild(tr);
  } else {
    paginatedData.forEach((veiculo) => {
      const tr = document.createElement("tr");
      tr.className = "border-b";

      // Cor do status
      let statusClass = "";
      if (veiculo.situacao === "ativo")
        statusClass = "bg-green-100 text-green-800";
      else if (veiculo.situacao === "manutencao")
        statusClass = "bg-yellow-100 text-yellow-800";
      else statusClass = "bg-red-100 text-red-800";

      tr.innerHTML = `
                        <td class="p-3">${veiculo.placa || ""}</td>
                        <td class="p-3">${veiculo.modelo || ""}</td>
                        <td class="p-3">${veiculo.marca || ""}</td>
                        <td class="p-3">${
                          veiculo.km ? veiculo.km.toLocaleString("pt-BR") : "0"
                        } km</td>
                        <td class="p-3">
                            <span class="px-2 py-1 text-xs rounded-full ${statusClass}">
                                ${
                                  veiculo.situacao
                                    ? veiculo.situacao.charAt(0).toUpperCase() +
                                      veiculo.situacao.slice(1)
                                    : ""
                                }
                            </span>
                        </td>
                        <td class="p-3">
                            <button class="text-blue-600 hover:text-blue-800 mr-2 editar-veiculo" data-id="${
                              veiculo.id
                            }">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800 excluir-veiculo" data-id="${
                              veiculo.id
                            }">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;

      tbody.appendChild(tr);
    });
  }

  // Atualizar paginação
  updatePagination("veiculos", dataToShow.length);

  // Adicionar eventos aos botões
  document.querySelectorAll(".editar-veiculo").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const veiculo = veiculos.find((v) => v.id === id);
      if (veiculo) showVeiculoForm(veiculo);
    });
  });

  document.querySelectorAll(".excluir-veiculo").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      if (confirm("Tem certeza que deseja excluir este veículo?")) {
        veiculos = veiculos.filter((v) => v.id !== id);
        abastecimentos = abastecimentos.filter((a) => a.veiculoId !== id);
        saveData();
        updateVeiculosTable();
        updateAbastecimentosTable();
        updateDashboard();
        populateVeiculoSelects();
      }
    });
  });
}

function updateAbastecimentosTable() {
  const tbody = document.getElementById("abastecimentos-table");
  tbody.innerHTML = "";

  const dataToShow =
    filteredAbastecimentos.length > 0 ? filteredAbastecimentos : abastecimentos;
  // Ordenar por data (mais recente primeiro)
  const sortedData = [...dataToShow].sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  );
  const paginatedData = paginate(
    sortedData,
    currentAbastecimentosPage,
    itemsPerPage
  );

  if (paginatedData.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7" class="p-4 text-center text-gray-500">Nenhum abastecimento encontrado</td>`;
    tbody.appendChild(tr);
  } else {
    paginatedData.forEach((abastecimento) => {
      const veiculo = veiculos.find((v) => v.id === abastecimento.veiculoId);
      const tr = document.createElement("tr");
      tr.className = "border-b";

      tr.innerHTML = `
                        <td class="p-3">${formatarData(abastecimento.data)}</td>
                        <td class="p-3">${
                          veiculo
                            ? veiculo.placa + " - " + veiculo.modelo
                            : "Veículo não encontrado"
                        }</td>
                        <td class="p-3">${
                          abastecimento.combustivel.charAt(0).toUpperCase() +
                          abastecimento.combustivel.slice(1)
                        }</td>
                        <td class="p-3">${abastecimento.litros.toFixed(
                          2
                        )} L</td>
                        <td class="p-3">R$ ${abastecimento.valor.toFixed(
                          2
                        )}</td>
                        <td class="p-3">${abastecimento.km.toLocaleString(
                          "pt-BR"
                        )} km</td>
                        <td class="p-3">
                            <button class="text-blue-600 hover:text-blue-800 mr-2 editar-abastecimento" data-id="${
                              abastecimento.id
                            }">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800 excluir-abastecimento" data-id="${
                              abastecimento.id
                            }">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;

      tbody.appendChild(tr);
    });
  }

  // Atualizar paginação
  updatePagination("abastecimentos", dataToShow.length);

  // Adicionar eventos aos botões
  document.querySelectorAll(".editar-abastecimento").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const abastecimento = abastecimentos.find((a) => a.id === id);
      if (abastecimento) showAbastecimentoForm(abastecimento);
    });
  });

  document.querySelectorAll(".excluir-abastecimento").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      if (confirm("Tem certeza que deseja excluir este abastecimento?")) {
        abastecimentos = abastecimentos.filter((a) => a.id !== id);
        saveData();
        updateAbastecimentosTable();
        updateDashboard();
      }
    });
  });
}

function paginate(array, pageNumber, pageSize) {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

function updatePagination(type, totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById(`${type}-pagination`);
  const pagesContainer = document.getElementById(`${type}-pages`);

  if (totalPages <= 1) {
    paginationContainer.classList.add("hidden");
    return;
  }

  paginationContainer.classList.remove("hidden");
  pagesContainer.innerHTML = "";

  // Limitar a exibição para no máximo 5 páginas
  let startPage = Math.max(1, currentVeiculosPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (type === "abastecimentos") {
    startPage = Math.max(1, currentAbastecimentosPage - 2);
    endPage = Math.min(totalPages, startPage + 4);
  }

  // Ajustar se estiver no final
  if (endPage - startPage < 4 && startPage > 1) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `pagination-btn px-3 py-1 border rounded ${
      (type === "veiculos" && i === currentVeiculosPage) ||
      (type === "abastecimentos" && i === currentAbastecimentosPage)
        ? "active"
        : ""
    }`;
    pageBtn.textContent = i;
    pageBtn.setAttribute("data-page", i);
    pagesContainer.appendChild(pageBtn);
  }
}

function populateVeiculoSelects() {
  const veiculoSelect = document.getElementById("veiculo");
  const relatorioVeiculoSelect = document.getElementById("relatorio-veiculo");

  veiculoSelect.innerHTML = '<option value="">Selecione</option>';
  relatorioVeiculoSelect.innerHTML = '<option value="">Todos</option>';

  veiculos.forEach((veiculo) => {
    const option = document.createElement("option");
    option.value = veiculo.id;
    option.textContent = `${veiculo.placa} - ${veiculo.modelo}`;

    veiculoSelect.appendChild(option.cloneNode(true));
    relatorioVeiculoSelect.appendChild(option);
  });
}

function showVeiculoForm(veiculo = null) {
  const form = document.getElementById("veiculo-form");

  if (veiculo) {
    // Edição
    document.getElementById("veiculo-id").value = veiculo.id;
    document.getElementById("placa").value = veiculo.placa || "";
    document.getElementById("modelo").value = veiculo.modelo || "";
    document.getElementById("marca").value = veiculo.marca || "";
    document.getElementById("tipo").value = veiculo.tipo || "";
    document.getElementById("km").value = veiculo.km || "";
    document.getElementById("situacao").value = veiculo.situacao || "ativo";
  } else {
    // Novo
    form.reset();
    document.getElementById("veiculo-id").value = "";
    document.getElementById("situacao").value = "ativo";
  }

  document.getElementById("veiculo-form-container").classList.remove("hidden");
}

function hideVeiculoForm() {
  document.getElementById("veiculo-form-container").classList.add("hidden");
}

function handleVeiculoSubmit(e) {
  e.preventDefault();
  try {
    console.log("Tentando salvar veículo..."); // <-- Adicione isso
    const id = document.getElementById("veiculo-id").value;
    const placa = document.getElementById("placa").value.toUpperCase();
    const modelo = document.getElementById("modelo").value;
    const marca = document.getElementById("marca").value;
    const tipo = document.getElementById("tipo").value;
    const km = parseFloat(document.getElementById("km").value) || 0;
    const situacao = document.getElementById("situacao").value;

    if (!placa || !modelo || !marca || !tipo) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (id && veiculos.find((v) => v.id === id)) {
      const index = veiculos.findIndex((v) => v.id === id);
      if (index !== -1) {
        veiculos[index] = {
          ...veiculos[index],
          placa,
          modelo,
          marca,
          tipo,
          km,
          situacao,
        };
      }
    } else {
      const novoId = generateId();
      veiculos.push({ id: novoId, placa, modelo, marca, tipo, km, situacao });
    }

    saveData();
    console.log("Salvou."); // <-- Adicione isso
    hideVeiculoForm();
    console.log("hideVeiculoForm."); // <-- Adicione isso
    updateVeiculosTable();
    console.log("updateVeiculosTable."); // <-- Adicione isso
    updateDashboard();
    console.log("updateDashboard."); // <-- Adicione isso
    populateVeiculoSelects();
    console.log("populateVeiculoSelects."); // <-- Adicione isso
  } catch (error) {
    console.error("Erro ao salvar veículo:", error);
    alert("Erro ao salvar veículo. Veja o console para mais detalhes.");
  }
}

function showAbastecimentoForm(abastecimento = null) {
  const form = document.getElementById("abastecimento-form");

  if (abastecimento) {
    // Edição
    document.getElementById("abastecimento-id").value = abastecimento.id;
    document.getElementById("data").value = abastecimento.data;
    document.getElementById("veiculo").value = abastecimento.veiculoId;
    document.getElementById("litros").value = abastecimento.litros;
    document.getElementById("valor").value = abastecimento.valor;
    document.getElementById("combustivel").value = abastecimento.combustivel;
    document.getElementById("km-atual").value = abastecimento.km;
  } else {
    // Novo
    form.reset();
    document.getElementById("abastecimento-id").value = "";
    document.getElementById("data").value = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("combustivel").value = "gasolina";

    // Preencher KM do primeiro veículo se existir
    if (veiculos.length > 0) {
      document.getElementById("veiculo").value = veiculos[0].id;
      document.getElementById("km-atual").value = veiculos[0].km;
    }
  }

  document
    .getElementById("abastecimento-form-container")
    .classList.remove("hidden");
}

function hideAbastecimentoForm() {
  document
    .getElementById("abastecimento-form-container")
    .classList.add("hidden");
}
function handleAbastecimentoSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("abastecimento-id").value.trim(); // sempre limpe espaços
  const data = document.getElementById("data").value;
  const veiculoId = document.getElementById("veiculo").value;
  const litros = parseFloat(document.getElementById("litros").value);
  const valor = parseFloat(document.getElementById("valor").value);
  const combustivel = document.getElementById("combustivel").value;
  const km = parseFloat(document.getElementById("km-atual").value);

  // Validar campos obrigatórios
  if (!data || !veiculoId || isNaN(litros) || isNaN(valor) || isNaN(km)) {
    alert(
      "Por favor, preencha todos os campos obrigatórios com valores válidos."
    );
    return;
  }

  // Validar veículo
  const veiculo = veiculos.find((v) => v.id === veiculoId);
  if (!veiculo) {
    alert("Veículo não encontrado!");
    return;
  }

  const abastecimentoExistente = abastecimentos.find((a) => a.id === id);

  if (id && abastecimentoExistente) {
    // Editar
    const index = abastecimentos.findIndex((a) => a.id === id);
    abastecimentos[index] = {
      ...abastecimentoExistente,
      data,
      veiculoId,
      litros,
      valor,
      combustivel,
      km,
    };

    // Atualizar KM do veículo se necessário
    if (km > veiculo.km) {
      veiculo.km = km;
    }
  } else {
    // Novo
    const novoId = generateId();
    abastecimentos.push({
      id: novoId,
      data,
      veiculoId,
      litros,
      valor,
      combustivel,
      km,
    });

    // Atualizar KM do veículo
    if (km > veiculo.km) {
      veiculo.km = km;
    }
  }

  saveData();
  hideAbastecimentoForm();
  updateAbastecimentosTable();
  updateDashboard();
}

function gerarRelatorioPeriodo() {
  const dataInicio = document.getElementById("relatorio-inicio").value;
  const dataFim = document.getElementById("relatorio-fim").value;

  if (!dataInicio || !dataFim) {
    alert("Por favor, informe o período para gerar o relatório.");
    return;
  }

  // Filtrar abastecimentos
  const abastecimentosPeriodo = abastecimentos.filter(
    (a) => a.data >= dataInicio && a.data <= dataFim
  );

  if (abastecimentosPeriodo.length === 0) {
    alert("Nenhum abastecimento encontrado no período selecionado.");
    return;
  }

  // Calcular totais
  const totalLitros = abastecimentosPeriodo.reduce(
    (sum, a) => sum + a.litros,
    0
  );
  const totalValor = abastecimentosPeriodo.reduce((sum, a) => sum + a.valor, 0);

  // Gerar HTML do relatório
  const relatorioHTML = `
                <h4 class="font-medium mb-2">Resumo do Período</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="bg-gray-100 p-3 rounded">
                        <p class="text-sm text-gray-600">Total Abastecido</p>
                        <p class="text-xl font-bold">${totalLitros.toFixed(
                          2
                        )} L</p>
                    </div>
                    <div class="bg-gray-100 p-3 rounded">
                        <p class="text-sm text-gray-600">Valor Total</p>
                        <p class="text-xl font-bold">R$ ${totalValor.toFixed(
                          2
                        )}</p>
                    </div>
                </div>
                
                <h4 class="font-medium mb-2">Detalhes dos Abastecimentos</h4>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="p-2 text-left">Data</th>
                                <th class="p-2 text-left">Veículo</th>
                                <th class="p-2 text-left">Combustível</th>
                                <th class="p-2 text-left">Litros</th>
                                <th class="p-2 text-left">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${abastecimentosPeriodo
                              .map((a) => {
                                const veiculo = veiculos.find(
                                  (v) => v.id === a.veiculoId
                                );
                                return `
                                    <tr class="border-b">
                                        <td class="p-2">${formatarData(
                                          a.data
                                        )}</td>
                                        <td class="p-2">${
                                          veiculo
                                            ? veiculo.placa +
                                              " - " +
                                              veiculo.modelo
                                            : "Veículo não encontrado"
                                        }</td>
                                        <td class="p-2">${
                                          a.combustivel
                                            .charAt(0)
                                            .toUpperCase() +
                                          a.combustivel.slice(1)
                                        }</td>
                                        <td class="p-2">${a.litros.toFixed(
                                          2
                                        )} L</td>
                                        <td class="p-2">R$ ${a.valor.toFixed(
                                          2
                                        )}</td>
                                    </tr>
                                `;
                              })
                              .join("")}
                        </tbody>
                    </table>
                </div>
            `;

  // Exibir relatório
  document.getElementById(
    "relatorio-titulo"
  ).textContent = `Relatório: ${formatarData(dataInicio)} a ${formatarData(
    dataFim
  )}`;
  document.getElementById("relatorio-conteudo").innerHTML = relatorioHTML;
  document.getElementById("relatorio-resultados").classList.remove("hidden");
}

function gerarRelatorioVeiculo() {
  const veiculoId = document.getElementById("relatorio-veiculo").value;

  // Filtrar abastecimentos
  let abastecimentosVeiculo;
  if (veiculoId) {
    abastecimentosVeiculo = abastecimentos.filter(
      (a) => a.veiculoId === veiculoId
    );
  } else {
    abastecimentosVeiculo = [...abastecimentos];
  }

  if (abastecimentosVeiculo.length === 0) {
    alert("Nenhum abastecimento encontrado para o veículo selecionado.");
    return;
  }

  // Ordenar por data
  abastecimentosVeiculo.sort((a, b) => new Date(a.data) - new Date(b.data));

  // Calcular totais
  const totalLitros = abastecimentosVeiculo.reduce(
    (sum, a) => sum + a.litros,
    0
  );
  const totalValor = abastecimentosVeiculo.reduce((sum, a) => sum + a.valor, 0);

  // Calcular média de consumo
  let mediaConsumo = 0;
  if (abastecimentosVeiculo.length > 1) {
    const kmInicial = abastecimentosVeiculo[0].km;
    const kmFinal = abastecimentosVeiculo[abastecimentosVeiculo.length - 1].km;
    const litrosTotal = abastecimentosVeiculo
      .slice(1)
      .reduce((sum, a) => sum + a.litros, 0);
    mediaConsumo = litrosTotal > 0 ? (kmFinal - kmInicial) / litrosTotal : 0;
  }

  // Gerar HTML do relatório
  const veiculo = veiculoId ? veiculos.find((v) => v.id === veiculoId) : null;
  const relatorioHTML = `
                <h4 class="font-medium mb-2">Resumo do Veículo</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div class="bg-gray-100 p-3 rounded">
                        <p class="text-sm text-gray-600">Veículo</p>
                        <p class="text-xl font-bold">${
                          veiculo
                            ? veiculo.placa + " - " + veiculo.modelo
                            : "Todos os veículos"
                        }</p>
                    </div>
                    <div class="bg-gray-100 p-3 rounded">
                        <p class="text-sm text-gray-600">Total Abastecido</p>
                        <p class="text-xl font-bold">${totalLitros.toFixed(
                          2
                        )} L</p>
                    </div>
                    <div class="bg-gray-100 p-3 rounded">
                        <p class="text-sm text-gray-600">Valor Total</p>
                        <p class="text-xl font-bold">R$ ${totalValor.toFixed(
                          2
                        )}</p>
                    </div>
                </div>
                
                ${
                  mediaConsumo > 0
                    ? `
                <div class="bg-gray-100 p-3 rounded mb-4">
                    <p class="text-sm text-gray-600">Média de Consumo</p>
                    <p class="text-xl font-bold">${mediaConsumo.toFixed(
                      2
                    )} km/L</p>
                </div>
                `
                    : ""
                }
                
                <h4 class="font-medium mb-2">Histórico de Abastecimentos</h4>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="p-2 text-left">Data</th>
                                <th class="p-2 text-left">Combustível</th>
                                <th class="p-2 text-left">Litros</th>
                                <th class="p-2 text-left">Valor</th>
                                <th class="p-2 text-left">KM</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${abastecimentosVeiculo
                              .map((a) => {
                                return `
                                    <tr class="border-b">
                                        <td class="p-2">${formatarData(
                                          a.data
                                        )}</td>
                                        <td class="p-2">${
                                          a.combustivel
                                            .charAt(0)
                                            .toUpperCase() +
                                          a.combustivel.slice(1)
                                        }</td>
                                        <td class="p-2">${a.litros.toFixed(
                                          2
                                        )} L</td>
                                        <td class="p-2">R$ ${a.valor.toFixed(
                                          2
                                        )}</td>
                                        <td class="p-2">${a.km.toLocaleString(
                                          "pt-BR"
                                        )} km</td>
                                    </tr>
                                `;
                              })
                              .join("")}
                        </tbody>
                    </table>
                </div>
            `;

  // Exibir relatório
  document.getElementById("relatorio-titulo").textContent = `Relatório: ${
    veiculo ? veiculo.placa + " - " + veiculo.modelo : "Todos os Veículos"
  }`;
  document.getElementById("relatorio-conteudo").innerHTML = relatorioHTML;
  document.getElementById("relatorio-resultados").classList.remove("hidden");
}

function exportarRelatorio() {
  alert(
    "Funcionalidade de exportação seria implementada aqui (PDF, Excel, etc.)"
  );
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function saveData() {
  localStorage.setItem("veiculos", JSON.stringify(veiculos));
  localStorage.setItem("abastecimentos", JSON.stringify(abastecimentos));
}
