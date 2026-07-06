const API_URL_PAGAMENTOS = '/backEnd/pagamento.php';

async function obterHistoricoPagamentos() {
    const response = await fetch(`${API_URL_PAGAMENTOS}?route=historico`, {
        method: 'GET',
        credentials: 'same-origin'
    });
    const data = await response.json();
    return data;
}

async function verificarStatusPagamento(produtoId) {
    const response = await fetch(`${API_URL_PAGAMENTOS}?route=status&produto_id=${produtoId}`, {
        method: 'GET',
        credentials: 'same-origin'
    });
    const data = await response.json();
    return data;
}

function carregarHistoricoPagamentos() {
    const container = document.getElementById('historico-pagamentos');
    if (!container) return;

    obterHistoricoPagamentos().then(pagamentos => {
        if (!pagamentos || pagamentos.length === 0) {
            container.innerHTML = '<p>Nenhum pagamento registrado.</p>';
            return;
        }

        let html = '<table class="tabela-pagamentos"><thead><tr><th>Data</th><th>Status</th><th>Valor</th></tr></thead><tbody>';

        pagamentos.forEach(pgto => {
            const statusClass = pgto.status_pagamento === 'PAID' ? 'status-pago' :
                pgto.status_pagamento === 'PENDING' ? 'status-pendente' : 'status-outro';
            html += `<tr class="${statusClass}">
                <td>${new Date(pgto.criado_em).toLocaleDateString('pt-BR')}</td>
                <td>${pgto.status_pagamento}</td>
                <td>R$ ${parseFloat(pgto.valor || 0).toFixed(2)}</td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }).catch(error => {
        container.innerHTML = '<p>Erro ao carregar histórico de pagamentos.</p>';
        console.error(error);
    });
}