// Desafio Aula 04

// Durante a aula desenvolvemos um teste de jornada de usuário para a página de minha conta, 
// onde testamos o fluxo de alteração de dados de uma pessoa usuária na nossa aplicação. 
// Para este desafio, quero que você melhore o código de jornada de usuário que está disponível neste link.

// Resolução:

describe('Transações bancárias', () => {
  const novaTransacao = {
    tipoTransacao: 'Depósito',
    valor: '250',
  };

  beforeEach(() => {
    cy.fixture('dadosUsuario').as('usuario');
    cy.get('@usuario').then((usuario) => {
      cy.login(usuario.email, usuario.senha);
      cy.visit('/home');
    });
  });

  it('Deve permitir que usuário acesse a aplicação, realize transações e faça logout', () => {
    cy.get('@usuario').then((usuario) => {
      cy.url().should('include', '/home');
      cy.contains(usuario.nome).should('be.visible');
      cy.getByData('titulo-boas-vindas').should('contain', 'Bem vindo de volta!');
      cy.realizarTransacao(novaTransacao);
      cy.getByData('lista-transacoes').find('li').last().contains(novaTransacao.valor);
      cy.verificarTransacaoNaAPI(novaTransacao);
      cy.getByData('botao-sair').click();
      cy.url().should('include', '/');
      cy.getByData('titulo-principal').contains(
        'Experimente mais liberdade no controle da sua vida financeira. Crie sua conta com a gente!'
      );
    });
  });
});

// Comandos personalizados
Cypress.Commands.add('realizarTransacao', (transacao) => {
  cy.getByData('select-opcoes').select(transacao.tipoTransacao).should('have.value', transacao.tipoTransacao);
  cy.getByData('form-input').type(transacao.valor).should('have.value', transacao.valor);
  cy.getByData('realiza-transacao').click();
});

Cypress.Commands.add('verificarTransacaoNaAPI', (transacao) => {
  cy.window().then((win) => {
    const userId = win.localStorage.getItem('userId');
    cy.request({
      method: 'GET',
      url: `http://localhost:8000/users/${userId}/transations`,
      failOnStatusCode: false,
    }).then((resposta) => {
      expect(resposta.status).to.eq(200);
      expect(resposta.body).to.not.be.empty;
      expect(resposta.body).to.have.lengthOf.at.least(1);
      expect(resposta.body[resposta.body.length - 1]).to.deep.include(transacao);
    });
  });
});