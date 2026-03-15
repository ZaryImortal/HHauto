// ==UserScript==
// @name         HaremHeroes Login
// @namespace    https://github.com/Roukys/HHauto
// @version      0.3
// @description  AutoLogin Atualizado
// @author       RuperSama, Zary
// @match        https://*.hentaiheroes.com/*
// @match        https://connect.chibipass.com/*
// @grant        none
// ==/UserScript==

var userEmail = "YOUR_EMAIL"; // Seu Email
var userPass = "YOUR_PASSWORD"; // Sua Senha

// Função responsável por preencher os dados e logar
function login() {
    var email = document.getElementById("auth-email");
    var pass = document.getElementById("auth-password");
    var btn = document.getElementById("submit-authenticate");

    // Verifica se os elementos já carregaram na tela
    if (email && pass && btn) {
        email.value = userEmail;
        pass.value = userPass;

        // Dispara eventos 'input' e 'change' para que o site (React/Vue) reconheça
        // que o texto foi alterado e destrave o botão automaticamente
        email.dispatchEvent(new Event('input', { bubbles: true }));
        email.dispatchEvent(new Event('change', { bubbles: true }));
        pass.dispatchEvent(new Event('input', { bubbles: true }));
        pass.dispatchEvent(new Event('change', { bubbles: true }));

        // Aguarda 1 segundo para garantir que o botão habilitou e clica nele
        setTimeout(function() {
            btn.disabled = false; // Força a habilitação por segurança
            btn.click();
        }, 1000);
    } else {
        // Se a página ainda estiver carregando, tenta novamente em 1 segundo
        setTimeout(login, 1000);
    }
}

// Essa função procura o botão verde (Play) no iFrame do jogo, como no seu script antigo
function hhFrame() {
    var iframe = document.getElementById("hh_game");
    if(iframe == null) {
        setTimeout(hhFrame, 2000); // Tenta novamente caso o iframe não tenha carregado
        return;
    }

    try {
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (innerDoc) {
            var btns = innerDoc.getElementsByClassName("igreen");
            if(btns.length > 0){
                btns[0].click();
                return; // Para de tentar após clicar
            }
        }
    } catch(error) {
        // Pode ignorar erros de origin do iframe, tenta novamente
    }

    setTimeout(hhFrame, 2000);
}

// Direciona a execução dependendo de onde o script está rodando no momento
function load() {
    // Não executa se as credenciais estiverem vazias
    if(userEmail == "" || userPass == "") return;

    // Se estivermos rodando de dentro do iFrame do ChibiPass (Login)
    if (window.location.href.includes("chibipass.com")) {
        setTimeout(login, 1000);
    }
    // Se estivermos no site principal do HentaiHeroes
    else if (window.location.href.includes("hentaiheroes.com")) {
        setTimeout(hhFrame, 3000); // Aguarda a página principal e foca em entrar no jogo
    }
}

// Inicia o script quando a página ou iframe terminar de carregar
window.onload = load;
