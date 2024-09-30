// Desafio Aula 03

// Neste desafio você recebeu a tarefa de testar as informações de um único usuário. 
// Você precisa escrever um teste para verificar se as informações como nome, senha, 
// email, as transações e o saldo desse usuário aparecem na interface do usuário de forma correta.

// Resolução:

describe('Desafio aula 03 - Testa informações de um usuário específico', () => {
  beforeEach(() => {
    cy.fixture('dadosUsuario').as('usuario');
    cy.get('@usuario').then((usuario) => {
      cy.login(usuario.email, usuario.senha);
      cy.visit('/home');
    });
  });

  it('Verifica informações de usuário, como transações, saldo e nome', () => {
    cy.get('@usuario').then((usuario) => {
      cy.url().should('include', '/home');
      cy.contains(usuario.nome).should('be.visible');
      const ultimaTransacao = usuario.transacoes[usuario.transacoes.length - 1];
      cy.getByData('lista-transacoes').find('li').last().as('ultimaTransacaoElemento');
      cy.get('@ultimaTransacaoElemento').should('contain', ultimaTransacao.valor);
      cy.getByData('saldo').should('contain', usuario.saldo);
    });
  });
});