<main>
    <div id="pagamento-modal" class="modal" style="display:none;"></div>

    <h2>Produto Exclusivo</h2>

    <?php
    $produtos = [
        [
            'nome' => 'Membro Iniciante',
            'preco' => 7.50,
            'produto_id' => getenv('ABACATEPAY_PRODUCT_ID'),
            'imagem' => '/uploads/usuario/placeholder.webp'
        ],
        [
            'nome' => 'Membro Básico',
            'preco' => 15.00,
            'produto_id' => getenv('ABACATEPAY_PRODUCT2_ID'),
            'imagem' => '/uploads/usuario/placeholder.webp'
        ],
        [
            'nome' => 'Membro Profissional',
            'preco' => 30.00,
            'produto_id' => getenv('ABACATEPAY_PRODUCT3_ID'),
            'imagem' => '/uploads/usuario/placeholder.webp'
        ],
        [
            'nome' => 'Membro Premium',
            'preco' => 45.00,
            'produto_id' => getenv('ABACATEPAY_PRODUCT4_ID'),
            'imagem' => '/uploads/usuario/placeholder.webp'
        ]
    ];
    ?>

    <?php foreach ($produtos as $produto): ?>
    <section class="produto-card">
        <img src="<?= $produto['imagem'] ?>" alt="Produto" class="produto-imagem" style="width: 20rem;">
        <h3><?= $produto['nome'] ?></h3>
        <p class="preco-animal">R$ <?= number_format($produto['preco'], 2, ',', '.') ?></p>
        <button type="button" class="comprar-btn" data-preco="<?= $produto['preco'] ?>" data-nome="<?= $produto['nome'] ?>" data-produto-id="<?= $produto['produto_id'] ?>">Comprar</button>
    </section>
    <?php endforeach; ?>
</main>

<script src="/frontEnd/utils/pagamento.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".comprar-btn").forEach(function(btn) {
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
        <div class="modal-content">
            <button type="button" class="modal-close" onclick="fecharModalPagamento()">×</button>
            <h3>${nome}</h3>
            <p class="preco-animal">R$ ${parseFloat(preco).toFixed(2)}</p>
            <p>Confirme para ser redirecionado ao AbacatePay.</p>
            <button type="button" class="btn-comprar" id="btn-pagar" data-produto-id="${produtoId}">Pagar R$ ${parseFloat(preco).toFixed(2)}</button>
            <button type="button" class="btn-cancelar" onclick="fecharModalPagamento()">Cancelar</button>
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
