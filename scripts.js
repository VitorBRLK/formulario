$(document).ready(function() {
    
    // Aplica formatação ao CPF conforme o usuário digita
    $('#cpf').on('input', function() {
        $(this).val(formatarCPF($(this).val()));
    });

    // Restringe a entrada no campo CPF para apenas números
    $('#cpf').on('keypress', function(event) {
        limitarEntradaNumerica(event);
    });

    // Consulta o CEP ao perder o foco no campo
    $('#num_cep').on('blur', function() {
        buscarCEP();
    });

    // Exibe os dados preenchidos ao tentar enviar o formulário
    $('#formulario').on('submit', function(event) {
        mostrarDados(event);
    });
});

// Formata o CPF inserido no campo de CPF para o formato XXX.XXX.XXX-XX.
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após os três primeiros dígitos
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após os seis primeiros dígitos
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen antes dos dois últimos dígitos
    return cpf;
}

// Limita a entrada de caracteres no campo de CPF para apenas números.
function limitarEntradaNumerica(event) {
    const key = event.key;
    if (!/[0-9]/.test(key) && key !== 'Backspace' && key !== 'Tab') {
        event.preventDefault();
    }
}

// Preenche automaticamente os campos do formulário com os dados retornados da API do ViaCEP.
function buscarCEP() {
    var cep = $('#num_cep').val().replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep != "") {
        var validacep = /^[0-9]{8}$/;
        if (validacep.test(cep)) {
            // Requisição à API ViaCEP
            $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function(data) {
                if (!("erro" in data)) {
                    preencherFormulario(data);
                } else {
                    alert("CEP não encontrado.");
                }
            });
        } else {
            alert("Formato de CEP inválido.");
        }
    }
}

// Preenche os campos do formulário com os dados do endereço obtidos pela API
function preencherFormulario(conteudo) {
    $('#logradouro_str').val(conteudo.logradouro);
    $('#bairro_str').val(conteudo.bairro);
    $('#cidade_str').val(conteudo.localidade);
    $('#estado_str').val(conteudo.uf);
}

// Valida um CPF verificando sua estrutura e seus dígitos verificadores.
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Verifica se todos os dígitos são iguais (ex: "11111111111")

    let soma = 0, resto;
    
    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) 
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    // Validação do segundo dígito verificador
    for (let i = 1; i <= 10; i++) 
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}


// Captura os dados inseridos no formulário e os exibe para o usuário.
function mostrarDados(event) {
    event.preventDefault();
    const cpf = $('#cpf').val(); // Evita o envio do formulário
    if (!validarCPF(cpf)) {
        alert("CPF inválido.");
        return;
    }

    const nome = $('#nome').val();
    const idade = $('#idade').val();
    const cep = $('#num_cep').val();
    const logradouro = $('#logradouro_str').val();
    const cidade = $('#cidade_str').val();
    const estado = $('#estado_str').val();

    // Exibe os dados preenchidos em um alerta
    alert(`Dados inseridos:\nNome: ${nome}\nIdade: ${idade}\nCPF: ${cpf}\nCEP: ${cep}\nLogradouro: ${logradouro}\nCidade: ${cidade}\nEstado: ${estado}`);
}