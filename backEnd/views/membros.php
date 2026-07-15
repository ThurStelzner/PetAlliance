<main>
    <div id="pagamento-modal"></div>

    <div>
        <h2>Escolha seu plano</h2>
        <p>Desbloqueie recursos exclusivos e destaque seus animais</p>
    </div>

    <?php
    $produtos = [
        [
            'nome' => 'Iniciante',
            'preco' => 7.50,
            'preco_riscado' => 15.00,
            'preco_dia' => 0.25,
            'produto_id' => getenv('ABACATEPAY_PRODUCT_ID'),
            'destaque' => false,
            'descricao' => 'Badge de membro e destaque para 5 animais',
            'beneficios' => [
                'Badge de membro',
                'Perfil verificado',
                'Destaque para 5 animais',
                'Suporte por email'
            ]
        ],
        [
            'nome' => 'Básico',
            'preco' => 15.00,
            'preco_riscado' => 30.00,
            'preco_dia' => 0.50,
            'produto_id' => getenv('ABACATEPAY_PRODUCT2_ID'),
            'destaque' => false,
            'descricao' => 'Badge de membro e destaque para 10 animais',
            'beneficios' => [
                'Badge de membro',
                'Perfil verificado',
                'Destaque para 10 animais',
                'Suporte por email'
            ]
        ],
        [
            'nome' => 'Profissional',
            'preco' => 30.00,
            'preco_riscado' => 60.00,
            'preco_dia' => 1.00,
            'produto_id' => getenv('ABACATEPAY_PRODUCT3_ID'),
            'destaque' => true,
            'descricao' => 'Badge de membro e destaque para 20 animais',
            'beneficios' => [
                'Badge de membro',
                'Perfil verificado',
                'Destaque para 20 animais',
                'Suporte prioritário'
            ]
        ],
        [
            'nome' => 'Premium',
            'preco' => 45.00,
            'preco_riscado' => 90.00,
            'preco_dia' => 1.50,
            'produto_id' => getenv('ABACATEPAY_PRODUCT4_ID'),
            'destaque' => false,
            'descricao' => 'Badge de membro e destaque para 30 animais',
            'beneficios' => [
                'Badge de membro',
                'Perfil verificado',
                'Destaque para 30 animais',
                'Suporte VIP 24h'
            ]
        ]
    ];
    ?>

    <div>
    <?php foreach ($produtos as $produto): ?>
        <section>
            <?php if ($produto['destaque']): ?>
                <span>Mais Popular</span>
            <?php endif; ?>
            <div>
                <h3><?= $produto['nome'] ?></h3>
                <p><?= $produto['descricao'] ?></p>
            </div>
            <div>
                <span>R$ <?= number_format($produto['preco_riscado'], 2, ',', '.') ?></span>
                <span>R$ <?= number_format($produto['preco'], 2, ',', '.') ?></span>
                <span>/mês</span>
                <span>≈ R$ <?= number_format($produto['preco_dia'], 2, ',', '.') ?>/dia</span>
            </div>
            <ul>
                <?php foreach ($produto['beneficios'] as $beneficio): ?>
                    <li>
                        <span>✓</span>
                        <?= $beneficio ?>
                    </li>
                <?php endforeach; ?>
            </ul>
            <button type="button" data-preco="<?= $produto['preco'] ?>" data-nome="Membro <?= $produto['nome'] ?>" data-produto-id="<?= $produto['produto_id'] ?>">
                Assinar agora
            </button>
        </section>
    <?php endforeach; ?>
    </div>
</main>

<script src="/frontEnd/utils/pagamento.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".plano-comprar-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            var preco = this.dataset.preco;
            var nome = this.dataset.nome;
            var produtoId = this.dataset.produtoId;
            abrirModalPagamento(preco, nome, produtoId);
        });
    });
});

function abrirModalPagamento(preco, nome, produtoId) {
    var modal = document.getElementById("pagamento-modal");
    modal.innerHTML = `
        <div>
            <button type="button" onclick="fecharModalPagamento()">×</button>
            <div>
                <h3>${nome}</h3>
                <p>R$ ${parseFloat(preco).toFixed(2)}</p>
                <p>Confirme para ser redirecionado ao AbacatePay.</p>
                <button type="button" id="btn-pagar" data-produto-id="${produtoId}">Pagar R$ ${parseFloat(preco).toFixed(2)}</button>
                <button type="button" onclick="fecharModalPagamento()">Cancelar</button>
            </div>
        </div>
    `;
    modal.style.display = "flex";

    document.getElementById("btn-pagar").addEventListener("click", function() {
        var self = this;
        self.disabled = true;
        self.textContent = "Processando...";
        processarPagamento(produtoId, preco, self);
    });
}

function fecharModalPagamento() {
    document.getElementById("pagamento-modal").style.display = "none";
}

async function processarPagamento(produtoId, preco, btn) {
    try {
        var resultado = await fetch("/backEnd/pagamento.php?route=criar_checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ product_id: produtoId, preco: preco })
        });
        var dados = await resultado.json();

        if (dados.success && dados.checkout_url) {
            fecharModalPagamento();
            window.location.href = dados.checkout_url;
        } else {
            alert("Erro: " + (dados.error || "Erro desconhecido"));
            btn.disabled = false;
            btn.textContent = "Pagar R$ " + parseFloat(preco).toFixed(2);
        }
    } catch (error) {
        alert("Erro ao processar a compra: " + error.message);
        btn.disabled = false;
        btn.textContent = "Pagar R$ " + parseFloat(preco).toFixed(2);
    }
}
</script>
